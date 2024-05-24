package com.flo.qushift.controller;

import com.flo.qushift.service.BackupService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/backup")
public class BackupController {

    private final BackupService backupService;

    @GetMapping("/writer")
    public ResponseEntity<String> writeFile(@RequestParam String topicId) {
        String locFile = backupService.writeBackupFile(topicId);
        return ResponseEntity.ok(locFile);
    }

    @GetMapping("/reader")
    public ResponseEntity<ByteArrayResource> readFile(@RequestParam String locFile) {
        ByteArrayResource byteArrayResource = backupService.exportBackupFile(locFile);

        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=%s", "data.json"))
                .body(byteArrayResource);
    }
}
