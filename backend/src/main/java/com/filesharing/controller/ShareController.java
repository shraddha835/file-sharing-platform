package com.filesharing.controller;

import com.filesharing.dto.CreateShareLinkRequest;
import com.filesharing.dto.ShareLinkResponse;
import com.filesharing.model.FileEntity;
import com.filesharing.model.User;
import com.filesharing.service.FileService;
import com.filesharing.service.ShareService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/share")
@RequiredArgsConstructor
public class ShareController {

    private final ShareService shareService;
    private final FileService fileService;

    @PostMapping
    public ResponseEntity<ShareLinkResponse> createLink(
            @RequestBody CreateShareLinkRequest body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(shareService.createShareLink(body.getFileId(), body.getExpiresAt(), user));
    }

    @GetMapping("/{token}")
    public ResponseEntity<ShareLinkResponse> getLinkInfo(@PathVariable String token) {
        return ResponseEntity.ok(shareService.getShareLink(token));
    }

    @GetMapping("/download/{token}")
    public ResponseEntity<Resource> downloadShared(@PathVariable String token) throws IOException {
        FileEntity file = shareService.getFileByToken(token);
        Resource resource = fileService.downloadFileByStoragePath(file.getStoragePath());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getOriginalName() + "\"")
                .contentType(MediaType.parseMediaType(file.getContentType()))
                .body(resource);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ShareLinkResponse>> myLinks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(shareService.getMyLinks(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        shareService.deactivateShareLink(id, user);
        return ResponseEntity.noContent().build();
    }
}
