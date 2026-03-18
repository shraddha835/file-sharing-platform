package com.filesharing.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateShareLinkRequest {
    private Long fileId;
    private LocalDateTime expiresAt;
}
