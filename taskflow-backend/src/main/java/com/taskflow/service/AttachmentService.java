package com.taskflow.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.model.Attachment;
import com.taskflow.repository.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final Cloudinary cloudinary;

    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain", "text/csv",
            "application/zip", "application/x-rar-compressed",
            "application/json", "application/xml"
    );

    public Attachment upload(MultipartFile file, String ticketId, String commentId, String userId) {
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("File type not allowed: " + contentType);
        }

        String url;
        String publicId;

        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "taskflow/attachments",
                    "resource_type", "auto"
            ));
            url = (String) uploadResult.get("secure_url");
            publicId = (String) uploadResult.get("public_id");
        } catch (Exception e) {
            // Fallback: store as Base64 data URL if Cloudinary is not configured
            try {
                String base64 = Base64.getEncoder().encodeToString(file.getBytes());
                url = "data:" + file.getContentType() + ";base64," + base64;
                publicId = "local-" + UUID.randomUUID();
            } catch (IOException ex) {
                throw new RuntimeException("Failed to process file", ex);
            }
        }

        Attachment attachment = Attachment.builder()
                .filename(publicId)
                .originalName(file.getOriginalFilename())
                .mimeType(file.getContentType())
                .size(file.getSize())
                .url(url)
                .publicId(publicId)
                .uploadedBy(userId)
                .ticketId(ticketId)
                .commentId(commentId)
                .build();

        return attachmentRepository.save(attachment);
    }

    public Attachment getById(String id) {
        return attachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));
    }

    public List<Attachment> getByTicketId(String ticketId) {
        return attachmentRepository.findByTicketId(ticketId);
    }

    public void delete(String id, String userId) {
        Attachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));

        if (!attachment.getUploadedBy().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own attachments");
        }

        if (attachment.getPublicId() != null && !attachment.getPublicId().startsWith("local-")) {
            try {
                cloudinary.uploader().destroy(attachment.getPublicId(), ObjectUtils.emptyMap());
            } catch (Exception e) {
                // Ignore Cloudinary errors during delete
            }
        }

        attachmentRepository.delete(attachment);
    }
}
