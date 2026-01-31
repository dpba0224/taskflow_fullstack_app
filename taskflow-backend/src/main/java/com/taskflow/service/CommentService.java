package com.taskflow.service;

import com.taskflow.dto.request.CommentRequest;
import com.taskflow.dto.response.CommentResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.model.Comment;
import com.taskflow.repository.CommentRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public CommentResponse addComment(String ticketId, CommentRequest request, String userId) {
        Comment comment = Comment.builder()
                .ticketId(ticketId)
                .userId(userId)
                .content(request.getContent())
                .build();
        comment = commentRepository.save(comment);
        return toResponse(comment);
    }

    public List<CommentResponse> getComments(String ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtDesc(ticketId)
                .stream().map(this::toResponse).toList();
    }

    public CommentResponse updateComment(String commentId, CommentRequest request, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        if (!comment.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only edit your own comments");
        }
        comment.setContent(request.getContent());
        comment.setEdited(true);
        comment = commentRepository.save(comment);
        return toResponse(comment);
    }

    public void deleteComment(String commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        if (!comment.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own comments");
        }
        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment comment) {
        UserResponse user = userRepository.findById(comment.getUserId())
                .map(UserResponse::fromUser).orElse(null);
        return CommentResponse.fromComment(comment, user);
    }
}
