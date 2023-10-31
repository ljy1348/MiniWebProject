package com.example.web.controller;

import com.example.web.model.dto.FileIdDto;
import com.example.web.model.entity.File;
import com.example.web.repository.FileRepository;
import com.example.web.service.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api")
public class FileController {
    @Autowired
    FileService fileService;

    @PostMapping("/user/img")
    public ResponseEntity<Object> addFile(@RequestParam("file") MultipartFile file, @RequestParam("writer") String writer) {
        try {
            log.info("이미지 업로드 1");
            File file1 = new File();
            file1.setFileName(file.getOriginalFilename());
            file1.setFileType(file.getContentType());
            file1.setFileData(file.getBytes());
            file1.setWriter(writer);
            file1.setIsImage(true);
            log.info("이미지 업로드 2");

            File savedFile = fileService.addFile(file1);
            log.info("이미지 업로드 3");

            // 다운로드 URL 생성
            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/img/")
                    .path(savedFile.getFid().toString())
                    .toUriString();
            log.info("이미지 업로드 4");
            return new ResponseEntity<>(downloadUrl,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/img/{fid}")
    public ResponseEntity<byte[]> previewFile(@PathVariable Long fid) {
        try {
            log.info("이미지 불러오기1");
            Optional<File> optional = fileService.findById(fid);
            log.info("이미지 불러오기2");
            if (optional.isPresent()) {
                File file = optional.get();
            log.info("이미지 불러오기3");
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("application/octet-stream"))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFileName() + "\"")
                        .body(file.getFileData());
            } else {
            log.info("이미지 불러오기4");
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            log.info("이미지 불러오기5");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @PostMapping("/down/{fid}")
    public ResponseEntity<Object> downBybid(@PathVariable Long fid) {
        try {
            log.info("이미지 불러오기1");
            Optional<File> optional = fileService.findById(fid);
            log.info("이미지 불러오기2");
            if (optional.isPresent()) {
                File file = optional.get();
                log.info("이미지 불러오기3");
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFileName() + "\"")
                        .body(file.getFileData());
            } else {
                log.info("이미지 불러오기4");
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            log.info("이미지 불러오기5");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
}
