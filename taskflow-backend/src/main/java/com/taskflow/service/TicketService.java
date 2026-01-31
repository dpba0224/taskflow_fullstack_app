package com.taskflow.service;

import com.taskflow.dto.request.TicketRequest;
import com.taskflow.dto.response.TicketResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.model.Ticket;
import com.taskflow.model.User;
import com.taskflow.repository.CommentRepository;
import com.taskflow.repository.TicketRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final MongoTemplate mongoTemplate;

    public TicketResponse createTicket(TicketRequest request, String reporterId) {
        String ticketNumber = generateTicketNumber();

        Ticket ticket = Ticket.builder()
                .ticketNumber(ticketNumber)
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .priority(request.getPriority())
                .status(request.getStatus() != null ? request.getStatus() : "TO_DO")
                .assigneeId(request.getAssigneeId())
                .reporterId(reporterId)
                .dueDate(request.getDueDate())
                .tags(request.getTags() != null ? request.getTags() : new ArrayList<>())
                .build();

        ticket = ticketRepository.save(ticket);
        return toResponse(ticket);
    }

    public TicketResponse getTicketById(String id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        return toResponse(ticket);
    }

    public Page<TicketResponse> getTickets(List<String> statuses, List<String> types,
                                            List<String> priorities, String assigneeId,
                                            String reporterId, String search,
                                            String sortBy, String sortOrder,
                                            int page, int limit) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (statuses != null && !statuses.isEmpty()) {
            criteriaList.add(Criteria.where("status").in(statuses));
        } else {
            criteriaList.add(Criteria.where("status").ne("DELETED"));
        }
        if (types != null && !types.isEmpty()) {
            criteriaList.add(Criteria.where("type").in(types));
        }
        if (priorities != null && !priorities.isEmpty()) {
            criteriaList.add(Criteria.where("priority").in(priorities));
        }
        if (assigneeId != null) {
            criteriaList.add(Criteria.where("assigneeId").is(assigneeId));
        }
        if (reporterId != null) {
            criteriaList.add(Criteria.where("reporterId").is(reporterId));
        }
        if (search != null && !search.isBlank()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("title").regex(search, "i"),
                    Criteria.where("description").regex(search, "i")
            ));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        long total = mongoTemplate.count(query, Ticket.class);

        Sort sort = Sort.by(
                "asc".equalsIgnoreCase(sortOrder) ? Sort.Direction.ASC : Sort.Direction.DESC,
                sortBy != null ? sortBy : "createdAt"
        );
        Pageable pageable = PageRequest.of(page, limit, sort);
        query.with(pageable);

        List<Ticket> tickets = mongoTemplate.find(query, Ticket.class);
        List<TicketResponse> responses = tickets.stream().map(this::toResponse).toList();

        return new PageImpl<>(responses, pageable, total);
    }

    public Page<TicketResponse> getMyTickets(String userId, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ticketRepository.findByAssigneeId(userId, pageable).map(this::toResponse);
    }

    public Page<TicketResponse> getReportedTickets(String userId, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ticketRepository.findByReporterId(userId, pageable).map(this::toResponse);
    }

    public TicketResponse updateTicket(String id, TicketRequest request, String userId) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        checkTicketAccess(ticket, userId);

        if (request.getTitle() != null) ticket.setTitle(request.getTitle());
        if (request.getDescription() != null) ticket.setDescription(request.getDescription());
        if (request.getType() != null) ticket.setType(request.getType());
        if (request.getPriority() != null) ticket.setPriority(request.getPriority());
        if (request.getStatus() != null) {
            ticket.setStatus(request.getStatus());
            if ("COMPLETED".equals(request.getStatus())) {
                ticket.setCompletedAt(Instant.now());
            }
        }
        if (request.getAssigneeId() != null) ticket.setAssigneeId(request.getAssigneeId());
        if (request.getDueDate() != null) ticket.setDueDate(request.getDueDate());
        if (request.getTags() != null) ticket.setTags(request.getTags());

        ticket = ticketRepository.save(ticket);
        return toResponse(ticket);
    }

    public void deleteTicket(String id, String userId) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        checkTicketAccess(ticket, userId);
        ticket.setStatus("DELETED");
        ticket.setDeletedAt(Instant.now());
        ticketRepository.save(ticket);
    }

    private void checkTicketAccess(Ticket ticket, String userId) {
        boolean isReporter = userId.equals(ticket.getReporterId());
        boolean isAssignee = userId.equals(ticket.getAssigneeId());
        if (!isReporter && !isAssignee) {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null || !"ADMIN".equals(user.getRole())) {
                throw new UnauthorizedException("You do not have permission to modify this ticket");
            }
        }
    }

    private String generateTicketNumber() {
        return ticketRepository.findTopByOrderByTicketNumberDesc()
                .map(t -> {
                    int num = Integer.parseInt(t.getTicketNumber().substring(3));
                    return String.format("TK-%04d", num + 1);
                })
                .orElse("TK-0001");
    }

    private TicketResponse toResponse(Ticket ticket) {
        UserResponse assignee = null;
        if (ticket.getAssigneeId() != null) {
            assignee = userRepository.findById(ticket.getAssigneeId())
                    .map(UserResponse::fromUser).orElse(null);
        }
        UserResponse reporter = userRepository.findById(ticket.getReporterId())
                .map(UserResponse::fromUser).orElse(null);
        long commentCount = commentRepository.countByTicketId(ticket.getId());
        return TicketResponse.fromTicket(ticket, assignee, reporter, commentCount);
    }
}
