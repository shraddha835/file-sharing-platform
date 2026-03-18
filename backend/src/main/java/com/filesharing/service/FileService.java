package com.filesharing.service;

import com.filesharing.dto.FileResponse;
import com.filesharing.dto.FolderResponse;
import com.filesharing.model.FileEntity;
import com.filesharing.model.Folder;
import com.filesharing.model.User;
import com.filesharing.repository.FileRepository;
import com.filesharing.repository.FolderRepository;
import com.filesharing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    @Value("${app.storage.location}")
    private String storageLocation;

    @Transactional
    public FileResponse uploadFile(MultipartFile multipartFile, Long folderId, User user) throws IOException {
        long fileSize = multipartFile.getSize();

        if (user.getStorageUsed() + fileSize > user.getStorageQuota()) {
            throw new IllegalStateException("Storage quota exceeded");
        }

        Folder folder = null;
        if (folderId != null) {
            folder = folderRepository.findByIdAndOwnerAndDeletedFalse(folderId, user)
                    .orElseThrow(() -> new IllegalArgumentException("Folder not found"));
        }

        String rawName = multipartFile.getOriginalFilename();
        String originalName = (rawName == null || rawName.isBlank()) ? "upload"
                : Paths.get(rawName).getFileName().toString();
        String storedName = UUID.randomUUID() + "_" + originalName;
        Path uploadDir = Paths.get(storageLocation, String.valueOf(user.getId()));
        Files.createDirectories(uploadDir);

        Path filePath = uploadDir.resolve(storedName);
        Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        FileEntity fileEntity = FileEntity.builder()
                .originalName(originalName)
                .storedName(storedName)
                .contentType(multipartFile.getContentType())
                .size(fileSize)
                .storagePath(user.getId() + "/" + storedName)
                .owner(user)
                .folder(folder)
                .build();

        fileRepository.save(fileEntity);

        // Update user storage used
        user.setStorageUsed(user.getStorageUsed() + fileSize);
        userRepository.save(user);

        return toResponse(fileEntity);
    }

    public Resource downloadFile(Long fileId, User user) throws MalformedURLException {
        FileEntity fileEntity = fileRepository.findByIdAndOwnerAndDeletedFalse(fileId, user)
                .orElseThrow(() -> new IllegalArgumentException("File not found"));

        Path filePath = Paths.get(storageLocation).resolve(fileEntity.getStoragePath());
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            throw new IllegalStateException("File not accessible");
        }

        return resource;
    }

    public Resource downloadFileByStoragePath(String storagePath) throws MalformedURLException {
        Path filePath = Paths.get(storageLocation).resolve(storagePath);
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new IllegalStateException("File not accessible");
        }
        return resource;
    }

    public List<FileResponse> getFilesInFolder(Long folderId, User user) {
        List<FileEntity> files;
        if (folderId == null) {
            files = fileRepository.findByOwnerAndFolderIsNullAndDeletedFalse(user);
        } else {
            Folder folder = folderRepository.findByIdAndOwnerAndDeletedFalse(folderId, user)
                    .orElseThrow(() -> new IllegalArgumentException("Folder not found"));
            files = fileRepository.findByOwnerAndFolderAndDeletedFalse(user, folder);
        }
        return files.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<FileResponse> getAllFiles(User user) {
        return fileRepository.findByOwnerAndDeletedFalse(user)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public void deleteFile(Long fileId, User user) throws IOException {
        FileEntity fileEntity = fileRepository.findByIdAndOwnerAndDeletedFalse(fileId, user)
                .orElseThrow(() -> new IllegalArgumentException("File not found"));

        Path filePath = Paths.get(storageLocation).resolve(fileEntity.getStoragePath());
        Files.deleteIfExists(filePath);

        fileEntity.setDeleted(true);
        fileRepository.save(fileEntity);

        user.setStorageUsed(Math.max(0, user.getStorageUsed() - fileEntity.getSize()));
        userRepository.save(user);
    }

    @Transactional
    public FileResponse renameFile(Long fileId, String newName, User user) {
        FileEntity fileEntity = fileRepository.findByIdAndOwnerAndDeletedFalse(fileId, user)
                .orElseThrow(() -> new IllegalArgumentException("File not found"));
        fileEntity.setOriginalName(newName);
        return toResponse(fileRepository.save(fileEntity));
    }

    // Folder operations

    @Transactional
    public FolderResponse createFolder(String name, Long parentId, User user) {
        Folder parent = null;
        if (parentId != null) {
            parent = folderRepository.findByIdAndOwnerAndDeletedFalse(parentId, user)
                    .orElseThrow(() -> new IllegalArgumentException("Parent folder not found"));
        }
        Folder folder = Folder.builder().name(name).owner(user).parent(parent).build();
        return toFolderResponse(folderRepository.save(folder));
    }

    public List<FolderResponse> getFolders(Long parentId, User user) {
        List<Folder> folders;
        if (parentId == null) {
            folders = folderRepository.findByOwnerAndParentIsNullAndDeletedFalse(user);
        } else {
            Folder parent = folderRepository.findByIdAndOwnerAndDeletedFalse(parentId, user)
                    .orElseThrow(() -> new IllegalArgumentException("Parent folder not found"));
            folders = folderRepository.findByOwnerAndParentAndDeletedFalse(user, parent);
        }
        return folders.stream().map(this::toFolderResponse).collect(Collectors.toList());
    }

    @Transactional
    public void deleteFolder(Long folderId, User user) {
        Folder folder = folderRepository.findByIdAndOwnerAndDeletedFalse(folderId, user)
                .orElseThrow(() -> new IllegalArgumentException("Folder not found"));
        deleteFolderRecursive(folder, user);
    }

    private void deleteFolderRecursive(Folder folder, User user) {
        List<FileEntity> files = fileRepository.findByOwnerAndFolderAndDeletedFalse(user, folder);
        long reclaimedBytes = 0;
        for (FileEntity file : files) {
            file.setDeleted(true);
            reclaimedBytes += file.getSize();
        }
        if (!files.isEmpty()) {
            fileRepository.saveAll(files);
            user.setStorageUsed(Math.max(0, user.getStorageUsed() - reclaimedBytes));
            userRepository.save(user);
        }
        List<Folder> subFolders = folderRepository.findByOwnerAndParentAndDeletedFalse(user, folder);
        for (Folder sub : subFolders) {
            deleteFolderRecursive(sub, user);
        }
        folder.setDeleted(true);
        folderRepository.save(folder);
    }

    // Mappers

    public FileResponse toResponse(FileEntity f) {
        return FileResponse.builder()
                .id(f.getId())
                .originalName(f.getOriginalName())
                .contentType(f.getContentType())
                .size(f.getSize())
                .folderId(f.getFolder() != null ? f.getFolder().getId() : null)
                .folderName(f.getFolder() != null ? f.getFolder().getName() : null)
                .publiclyShared(f.isPubliclyShared())
                .createdAt(f.getCreatedAt())
                .updatedAt(f.getUpdatedAt())
                .build();
    }

    public FolderResponse toFolderResponse(Folder f) {
        return FolderResponse.builder()
                .id(f.getId())
                .name(f.getName())
                .parentId(f.getParent() != null ? f.getParent().getId() : null)
                .createdAt(f.getCreatedAt())
                .build();
    }
}
