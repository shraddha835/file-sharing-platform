package com.filesharing.controller;

import com.filesharing.dto.CreateFolderRequest;
import com.filesharing.dto.FileResponse;
import com.filesharing.dto.FolderResponse;
import com.filesharing.model.User;
import com.filesharing.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    // ---- File endpoints ----

    @PostMapping("/upload")
    public ResponseEntity<FileResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folderId", required = false) Long folderId,
            @AuthenticationPrincipal User user) throws IOException {
        return ResponseEntity.ok(fileService.uploadFile(file, folderId, user));
    }

    @GetMapping
    public ResponseEntity<List<FileResponse>> listFiles(
            @RequestParam(value = "folderId", required = false) Long folderId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(fileService.getFilesInFolder(folderId, user));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FileResponse>> listAllFiles(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(fileService.getAllFiles(user));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) throws IOException {
        Resource resource = fileService.downloadFile(id, user);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @PatchMapping("/{id}/rename")
    public ResponseEntity<FileResponse> rename(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(fileService.renameFile(id, body.get("name"), user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) throws IOException {
        fileService.deleteFile(id, user);
        return ResponseEntity.noContent().build();
    }

    // ---- Folder endpoints ----

    @PostMapping("/folders")
    public ResponseEntity<FolderResponse> createFolder(
            @RequestBody CreateFolderRequest body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(fileService.createFolder(body.getName(), body.getParentId(), user));
    }

    @GetMapping("/folders")
    public ResponseEntity<List<FolderResponse>> listFolders(
            @RequestParam(value = "parentId", required = false) Long parentId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(fileService.getFolders(parentId, user));
    }

    @DeleteMapping("/folders/{id}")
    public ResponseEntity<Void> deleteFolder(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        fileService.deleteFolder(id, user);
        return ResponseEntity.noContent().build();
    }
}
