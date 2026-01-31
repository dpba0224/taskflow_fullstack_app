package com.taskflow.repository;

import com.taskflow.model.Attachment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AttachmentRepository extends MongoRepository<Attachment, String> {
    List<Attachment> findByTicketId(String ticketId);
    List<Attachment> findByCommentId(String commentId);
}
