package com.taskflow.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "attachments")
public class Attachment {
    @Id
    private String id;

    private String filename;
    private String originalName;
    private String mimeType;
    private long size;
    private String url;
    private String publicId;

    @Indexed
    private String uploadedBy;

    @Indexed
    private String ticketId;

    @Indexed
    private String commentId;

    @CreatedDate
    private Instant createdAt;
}
