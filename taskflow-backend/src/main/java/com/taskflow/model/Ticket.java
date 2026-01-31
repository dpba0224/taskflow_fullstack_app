package com.taskflow.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
@CompoundIndex(name = "status_priority_created", def = "{'status': 1, 'priority': 1, 'createdAt': -1}")
public class Ticket {
    @Id
    private String id;

    @Indexed(unique = true)
    private String ticketNumber;

    private String title;
    private String description;
    private String type;       // BUG, FEATURE_REQUEST, SUPPORT_TICKET, TASK
    private String priority;   // CRITICAL, HIGH, MEDIUM, LOW
    private String status;     // BACKLOG, TO_DO, ACKNOWLEDGED, IN_PROGRESS, FOR_CONFIRMATION, COMPLETED, DELETED

    @Indexed
    private String assigneeId;

    @Indexed
    private String reporterId;

    private Instant dueDate;

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Builder.Default
    private List<String> attachments = new ArrayList<>();

    private Instant completedAt;
    private Instant deletedAt;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
