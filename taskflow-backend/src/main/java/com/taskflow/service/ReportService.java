package com.taskflow.service;

import com.taskflow.dto.response.UserResponse;
import com.taskflow.model.Ticket;
import com.taskflow.repository.TicketRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public Map<String, Object> generateStandupReport(String userId, LocalDate date) {
        Instant startOfDay = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant startOfYesterday = date.minusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        List<Ticket> completed = ticketRepository.findByAssigneeIdAndStatus(userId, "COMPLETED")
                .stream()
                .filter(t -> t.getCompletedAt() != null && t.getCompletedAt().isAfter(startOfYesterday) && t.getCompletedAt().isBefore(startOfDay))
                .toList();

        List<Ticket> inProgress = ticketRepository.findByAssigneeIdAndStatusIn(userId,
                List.of("IN_PROGRESS", "TO_DO", "ACKNOWLEDGED"));

        UserResponse user = userRepository.findById(userId)
                .map(UserResponse::fromUser).orElse(null);

        StringBuilder md = new StringBuilder();
        md.append("# Daily Standup - ").append(date.format(DateTimeFormatter.ofPattern("MMMM d, yyyy"))).append("\n\n");

        md.append("## Completed Yesterday\n");
        if (completed.isEmpty()) {
            md.append("_No tickets completed_\n");
        } else {
            completed.forEach(t -> md.append("- ").append(t.getTicketNumber()).append(": ").append(t.getTitle()).append("\n"));
        }

        md.append("\n## Working On Today\n");
        if (inProgress.isEmpty()) {
            md.append("_No tickets in progress_\n");
        } else {
            inProgress.forEach(t -> md.append("- ").append(t.getTicketNumber()).append(": ").append(t.getTitle()).append("\n"));
        }

        md.append("\n## Blocked/Issues\n_No blockers_\n");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("date", date.toString());
        result.put("user", user);
        result.put("markdown", md.toString());
        result.put("stats", Map.of(
                "completedYesterday", completed.size(),
                "inProgressToday", inProgress.size(),
                "blocked", 0
        ));
        return result;
    }
}
