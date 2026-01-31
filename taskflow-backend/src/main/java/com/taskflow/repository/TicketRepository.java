package com.taskflow.repository;

import com.taskflow.model.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;
import java.util.Optional;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    Optional<Ticket> findTopByOrderByTicketNumberDesc();
    Page<Ticket> findByAssigneeId(String assigneeId, Pageable pageable);
    Page<Ticket> findByReporterId(String reporterId, Pageable pageable);
    List<Ticket> findByAssigneeIdAndStatus(String assigneeId, String status);
    List<Ticket> findByAssigneeIdAndStatusIn(String assigneeId, List<String> statuses);

    @Query("{'$or': [{'title': {$regex: ?0, $options: 'i'}}, {'description': {$regex: ?0, $options: 'i'}}]}")
    Page<Ticket> searchByKeyword(String keyword, Pageable pageable);

    long countByStatus(String status);
}
