package com.taskflow.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.User;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final Cloudinary cloudinary;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromUser)
                .toList();
    }

    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserResponse.fromUser(user);
    }

    public UserResponse updateTheme(String userId, String theme) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setTheme(theme);
        user = userRepository.save(user);
        return UserResponse.fromUser(user);
    }

    public UserResponse updateProfile(String userId, String firstName, String lastName, String avatar) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (avatar != null) user.setAvatar(avatar);
        user = userRepository.save(user);
        return UserResponse.fromUser(user);
    }

    public UserResponse uploadAvatar(String userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed for avatars");
        }

        String avatarUrl;
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "taskflow/avatars",
                    "resource_type", "image",
                    "transformation", "w_256,h_256,c_fill,g_face"
            ));
            avatarUrl = (String) uploadResult.get("secure_url");
        } catch (Exception e) {
            // Fallback: store as Base64 data URL if Cloudinary is not configured or fails
            try {
                String base64 = Base64.getEncoder().encodeToString(file.getBytes());
                avatarUrl = "data:" + file.getContentType() + ";base64," + base64;
            } catch (IOException ex) {
                throw new RuntimeException("Failed to process avatar image", ex);
            }
        }

        user.setAvatar(avatarUrl);
        user = userRepository.save(user);
        return UserResponse.fromUser(user);
    }
}
