package com.example.web.repository;

import com.example.web.model.dto.FileIdDto;
import com.example.web.model.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {
    List<FileIdDto>  findAllByBidAndIsImage(long bid, boolean isImage);

    List<File> findByFidIn(List<Long> fid);

}
