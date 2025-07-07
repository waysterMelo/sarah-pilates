package com.sarahpilates.controller;

import com.sarahpilates.dto.LoginRequest;
import com.sarahpilates.dto.LoginResponse;
import com.sarahpilates.entity.User;
import com.sarahpilates.security.JwtTokenProvider;
import com.sarahpilates.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Autenticação e Autorização")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    
    @PostMapping("/login")
    @Operation(summary = "Fazer login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        
        User user = (User) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(user);
        
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUser(user);
        response.setExpiresIn(jwtTokenProvider.getExpirationTime());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    @Operation(summary = "Registrar novo usuário")
    public ResponseEntity<User> register(@Valid @RequestBody User user) {
        User savedUser = userService.save(user);
        // Remover senha da resposta
        savedUser.setPassword(null);
        return ResponseEntity.ok(savedUser);
    }
    
    @GetMapping("/me")
    @Operation(summary = "Obter dados do usuário logado")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        // Remover senha da resposta
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}