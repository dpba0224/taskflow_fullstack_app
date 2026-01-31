package com.taskflow.controller;

import com.taskflow.dto.request.ChangePasswordRequest;
import com.taskflow.dto.request.LoginRequest;
import com.taskflow.dto.request.RegisterRequest;
import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.AuthResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.security.UserPrincipal;
import com.taskflow.service.AuthService;
import com.taskflow.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        String userId = UserPrincipal.getCurrentUserId();
        UserResponse response = authService.getCurrentUser(userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        String userId = UserPrincipal.getCurrentUserId();
        authService.changePassword(userId, request);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@RequestBody Map<String, String> body) {
        String userId = UserPrincipal.getCurrentUserId();
        UserResponse response = userService.updateProfile(
                userId, body.get("firstName"), body.get("lastName"), body.get("avatar"));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/avatar")
    public ResponseEntity<ApiResponse<UserResponse>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        String userId = UserPrincipal.getCurrentUserId();
        UserResponse response = userService.uploadAvatar(userId, file);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
