package com.filesharing.service;

import com.filesharing.dto.ShareLinkResponse;
import com.filesharing.model.FileEntity;
import com.filesharing.model.ShareLink;
import com.filesharing.model.User;
import com.filesharing.repository.FileRepository;
import com.filesharing.repository.ShareLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShareService {

    private final ShareLinkRepository shareLinkRepository;
    private final FileRepository fileRepository;

    @Value("${app.base-url}")
    private String baseUrl;

    @Transactional
    public ShareLinkResponse createShareLink(Long fileId, LocalDateTime expiresAt, User user) {
        FileEntity file = fileRepository.findByIdAndOwnerAndDeletedFalse(fileId, user)
                .orElseThrow(() -> new IllegalArgumentException("File not found"));

        ShareLink link = ShareLink.builder()
                .token(UUID.randomUUID().toString())
                .file(file)
                .createdBy(user)
                .expiresAt(expiresAt)
                .build();

        shareLinkRepository.save(link);
        return toResponse(link);
    }

    public ShareLinkResponse getShareLink(String token) {
        ShareLink link = shareLinkRepository.findByTokenAndActiveTrue(token)
                .orElseThrow(() -> new IllegalArgumentException("Share link not found or expired"));

        if (link.getExpiresAt() != null && link.getExpiresAt().isBefore(LocalDateTime.now())) {
            link.setActive(false);
            shareLinkRepository.save(link);
            throw new IllegalArgumentException("Share link has expired");
        }

        return toResponse(link);
    }

    public FileEntity getFileByToken(String token) {
        ShareLink link = shareLinkRepository.findByTokenAndActiveTrue(token)
                .orElseThrow(() -> new IllegalArgumentException("Share link not found"));

        if (link.getExpiresAt() != null && link.getExpiresAt().isBefore(LocalDateTime.now())) {
            link.setActive(false);
            shareLinkRepository.save(link);
            throw new IllegalArgumentException("Share link has expired");
        }

        link.setDownloadCount(link.getDownloadCount() + 1);
        shareLinkRepository.save(link);

        return link.getFile();
    }

    @Transactional
    public void deactivateShareLink(Long linkId, User user) {
        ShareLink link = shareLinkRepository.findById(linkId)
                .orElseThrow(() -> new IllegalArgumentException("Link not found"));

        if (!link.getCreatedBy().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not authorised");
        }

        link.setActive(false);
        shareLinkRepository.save(link);
    }

    public List<ShareLinkResponse> getMyLinks(User user) {
        return shareLinkRepository.findByCreatedByIdAndActiveTrue(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private ShareLinkResponse toResponse(ShareLink link) {
        return ShareLinkResponse.builder()
                .id(link.getId())
                .token(link.getToken())
                .shareUrl(baseUrl + "/api/share/download/" + link.getToken())
                .fileId(link.getFile().getId())
                .fileName(link.getFile().getOriginalName())
                .expiresAt(link.getExpiresAt())
                .downloadCount(link.getDownloadCount())
                .active(link.isActive())
                .createdAt(link.getCreatedAt())
                .build();
    }
}
