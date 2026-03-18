package com.filesharing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShareLinkResponse {
    private Long id;
    private String token;
    private String shareUrl;
    private Long fileId;
    private String fileName;
    private LocalDateTime expiresAt;
    private int downloadCount;
    private boolean active;
    private LocalDateTime createdAt;
}
