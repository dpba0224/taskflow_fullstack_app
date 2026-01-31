package com.taskflow.repository;

import com.taskflow.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByTicketIdOrderByCreatedAtDesc(String ticketId);
    long countByTicketId(String ticketId);
    void deleteByTicketId(String ticketId);
}
