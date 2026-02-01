package com.taskflow.controller;

import com.taskflow.dto.request.TicketRequest;
import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.TicketResponse;
import com.taskflow.security.UserPrincipal;
import com.taskflow.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<ApiResponse<TicketResponse>> createTicket(@Valid @RequestBody TicketRequest request) {
        String userId = UserPrincipal.getCurrentUserId();
        TicketResponse response = ticketService.createTicket(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicket(@PathVariable String id) {
        TicketResponse response = ticketService.getTicketById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String assignee,
            @RequestParam(required = false) String reporter,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit) {

        List<String> statuses = status != null ? Arrays.asList(status.split(",")) : null;
        List<String> types = type != null ? Arrays.asList(type.split(",")) : null;
        List<String> priorities = priority != null ? Arrays.asList(priority.split(",")) : null;

        int safeLimit = Math.min(Math.max(limit, 1), 200);
        Page<TicketResponse> ticketPage = ticketService.getTickets(
                statuses, types, priorities, assignee, reporter, search, sortBy, sortOrder, page, safeLimit);

        Map<String, Object> data = Map.of(
                "tickets", ticketPage.getContent(),
                "pagination", Map.of(
                        "page", ticketPage.getNumber(),
                        "limit", ticketPage.getSize(),
                        "total", ticketPage.getTotalElements(),
                        "totalPages", ticketPage.getTotalPages()
                )
        );
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit) {
        String userId = UserPrincipal.getCurrentUserId();
        Page<TicketResponse> ticketPage = ticketService.getMyTickets(userId, page, limit);
        Map<String, Object> data = Map.of(
                "tickets", ticketPage.getContent(),
                "pagination", Map.of(
                        "page", ticketPage.getNumber(),
                        "limit", ticketPage.getSize(),
                        "total", ticketPage.getTotalElements(),
                        "totalPages", ticketPage.getTotalPages()
                )
        );
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @GetMapping("/reported")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReportedTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit) {
        String userId = UserPrincipal.getCurrentUserId();
        Page<TicketResponse> ticketPage = ticketService.getReportedTickets(userId, page, limit);
        Map<String, Object> data = Map.of(
                "tickets", ticketPage.getContent(),
                "pagination", Map.of(
                        "page", ticketPage.getNumber(),
                        "limit", ticketPage.getSize(),
                        "total", ticketPage.getTotalElements(),
                        "totalPages", ticketPage.getTotalPages()
                )
        );
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> updateTicket(
            @PathVariable String id, @RequestBody TicketRequest request) {
        String userId = UserPrincipal.getCurrentUserId();
        TicketResponse response = ticketService.updateTicket(id, request, userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTicket(@PathVariable String id) {
        String userId = UserPrincipal.getCurrentUserId();
        ticketService.deleteTicket(id, userId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
