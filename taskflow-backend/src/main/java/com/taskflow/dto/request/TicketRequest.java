package com.taskflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
public class TicketRequest {
    @NotBlank @Size(max = 200)
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String type;

    @NotBlank
    private String priority;

    private String status;
    private String assigneeId;
    private Instant dueDate;
    private List<String> tags;
}
