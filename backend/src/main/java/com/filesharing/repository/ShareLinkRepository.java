package com.filesharing.repository;

import com.filesharing.model.ShareLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShareLinkRepository extends JpaRepository<ShareLink, Long> {
    Optional<ShareLink> findByTokenAndActiveTrue(String token);
    List<ShareLink> findByFileIdAndActiveTrue(Long fileId);
    List<ShareLink> findByCreatedByIdAndActiveTrue(Long userId);
}
