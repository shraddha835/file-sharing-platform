package com.filesharing.repository;

import com.filesharing.model.Folder;
import com.filesharing.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByOwnerAndParentIsNullAndDeletedFalse(User owner);
    List<Folder> findByOwnerAndParentAndDeletedFalse(User owner, Folder parent);
    Optional<Folder> findByIdAndOwnerAndDeletedFalse(Long id, User owner);
}
