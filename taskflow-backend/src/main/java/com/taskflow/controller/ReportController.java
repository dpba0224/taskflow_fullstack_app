package com.taskflow.controller;

import com.taskflow.dto.response.ApiResponse;
import com.taskflow.security.UserPrincipal;
import com.taskflow.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/standup")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStandupReport(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String userId) {
        LocalDate reportDate = date != null ? LocalDate.parse(date) : LocalDate.now();
        String uid = userId != null ? userId : UserPrincipal.getCurrentUserId();
        Map<String, Object> report = reportService.generateStandupReport(uid, reportDate);
        return ResponseEntity.ok(ApiResponse.ok(report));
    }
}
