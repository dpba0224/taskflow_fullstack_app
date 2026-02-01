package com.taskflow.controller;

import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.security.UserPrincipal;
import com.taskflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PutMapping("/{id}/theme")
    public ResponseEntity<ApiResponse<UserResponse>> updateTheme(
            @PathVariable String id, @RequestBody Map<String, String> body) {
        String currentUserId = UserPrincipal.getCurrentUserId();
        if (!currentUserId.equals(id)) {
            throw new UnauthorizedException("You can only update your own theme");
        }
        UserResponse user = userService.updateTheme(id, body.get("theme"));
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}
