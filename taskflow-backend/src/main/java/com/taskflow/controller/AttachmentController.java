package com.taskflow.controller;

import com.taskflow.dto.response.ApiResponse;
import com.taskflow.model.Attachment;
import com.taskflow.security.UserPrincipal;
import com.taskflow.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Attachment>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String ticketId,
            @RequestParam(required = false) String commentId) {
        String userId = UserPrincipal.getCurrentUserId();
        Attachment attachment = attachmentService.upload(file, ticketId, commentId, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(attachment));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Attachment>> getById(@PathVariable String id) {
        Attachment attachment = attachmentService.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(attachment));
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<ApiResponse<List<Attachment>>> getByTicket(@PathVariable String ticketId) {
        List<Attachment> attachments = attachmentService.getByTicketId(ticketId);
        return ResponseEntity.ok(ApiResponse.ok(attachments));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        String userId = UserPrincipal.getCurrentUserId();
        attachmentService.delete(id, userId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
