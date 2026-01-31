package com.taskflow.controller;

import com.taskflow.dto.request.CommentRequest;
import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.CommentResponse;
import com.taskflow.security.UserPrincipal;
import com.taskflow.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/api/v1/tickets/{ticketId}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @PathVariable String ticketId, @Valid @RequestBody CommentRequest request) {
        String userId = UserPrincipal.getCurrentUserId();
        CommentResponse response = commentService.addComment(ticketId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @GetMapping("/api/v1/tickets/{ticketId}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(@PathVariable String ticketId) {
        List<CommentResponse> responses = commentService.getComments(ticketId);
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }

    @PutMapping("/api/v1/comments/{id}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable String id, @Valid @RequestBody CommentRequest request) {
        String userId = UserPrincipal.getCurrentUserId();
        CommentResponse response = commentService.updateComment(id, request, userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @DeleteMapping("/api/v1/comments/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(@PathVariable String id) {
        String userId = UserPrincipal.getCurrentUserId();
        commentService.deleteComment(id, userId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
