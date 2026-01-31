package com.taskflow.dto.response;

import com.taskflow.model.Ticket;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
    private String id;
    private String ticketNumber;
    private String title;
    private String description;
    private String type;
    private String priority;
    private String status;
    private UserResponse assignee;
    private UserResponse reporter;
    private Instant dueDate;
    private List<String> tags;
    private int attachmentCount;
    private long commentCount;
    private Instant createdAt;
    private Instant updatedAt;

    public static TicketResponse fromTicket(Ticket ticket, UserResponse assignee, UserResponse reporter, long commentCount) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .ticketNumber(ticket.getTicketNumber())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .type(ticket.getType())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .assignee(assignee)
                .reporter(reporter)
                .dueDate(ticket.getDueDate())
                .tags(ticket.getTags())
                .attachmentCount(ticket.getAttachments() != null ? ticket.getAttachments().size() : 0)
                .commentCount(commentCount)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}
