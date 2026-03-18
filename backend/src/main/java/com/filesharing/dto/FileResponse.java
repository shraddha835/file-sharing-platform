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
public class FileResponse {
    private Long id;
    private String originalName;
    private String contentType;
    private Long size;
    private Long folderId;
    private String folderName;
    private boolean publiclyShared;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
