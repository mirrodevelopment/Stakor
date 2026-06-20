package com.stakor.controller;

import com.stakor.dto.SigninRequest;
import com.stakor.dto.SignupRequest;
import com.stakor.model.User;
import com.stakor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("message", "Email is already in use!"));
        }

        User user = User.builder()
            .name(request.getName())
            .phone(request.getPhone())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .build();

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "message", "User registered successfully!",
            "name", user.getName()
        ));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody SigninRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid email or password!"));
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid email or password!"));
        }

        return ResponseEntity.ok(Map.of(
            "message", "Sign in successful!",
            "name", user.getName()
        ));
    }

    /**
     * Returns safe profile data (no password) for the given email.
     * Called by the profile page on load to populate user details.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User not found."));
        }

        User user = userOpt.get();
        return ResponseEntity.ok(Map.of(
            "name",  user.getName(),
            "email", user.getEmail(),
            "phone", user.getPhone()
        ));
    }
}
