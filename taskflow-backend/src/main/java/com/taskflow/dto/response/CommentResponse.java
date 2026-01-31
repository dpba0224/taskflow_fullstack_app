package com.taskflow.dto.response;

import com.taskflow.model.Comment;
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
public class CommentResponse {
    private String id;
    private String ticketId;
    private UserResponse user;
    private String content;
    private List<String> attachments;
    private boolean edited;
    private Instant createdAt;
    private Instant updatedAt;

    public static CommentResponse fromComment(Comment comment, UserResponse user) {
        return CommentResponse.builder()
                .id(comment.getId())
                .ticketId(comment.getTicketId())
                .user(user)
                .content(comment.getContent())
                .attachments(comment.getAttachments())
                .edited(comment.isEdited())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
