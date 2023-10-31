package com.example.web.service;

import com.example.web.model.dto.FileIdDto;
import com.example.web.model.entity.File;
import com.example.web.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FileService {
    @Autowired
    FileRepository fileRepository;

    public File addFile(File file) {
        return fileRepository.save(file);
    }

    public Optional<File> findById(Long fid) {
        return fileRepository.findById(fid);
    }

    public List<FileIdDto> findFidByBid(Long bid) {
        return fileRepository.findAllByBid(bid);
    }
}
