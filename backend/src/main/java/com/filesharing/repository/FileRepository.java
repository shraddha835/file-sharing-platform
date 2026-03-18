package com.filesharing.repository;

import com.filesharing.model.FileEntity;
import com.filesharing.model.Folder;
import com.filesharing.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {

    List<FileEntity> findByOwnerAndDeletedFalse(User owner);

    List<FileEntity> findByOwnerAndFolderAndDeletedFalse(User owner, Folder folder);

    List<FileEntity> findByOwnerAndFolderIsNullAndDeletedFalse(User owner);

    Optional<FileEntity> findByIdAndOwnerAndDeletedFalse(Long id, User owner);

    @Query("SELECT COALESCE(SUM(f.size), 0) FROM FileEntity f WHERE f.owner = :owner AND f.deleted = false")
    Long sumSizeByOwner(User owner);
}
