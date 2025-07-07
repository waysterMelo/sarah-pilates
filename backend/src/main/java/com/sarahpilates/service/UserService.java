package com.sarahpilates.service;

import com.sarahpilates.entity.User;
import com.sarahpilates.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements UserDetailsService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));
    }
    
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User save(User user) {
        // Verificar se email já existe
        if (user.getId() == null && userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email já está em uso");
        }
        
        // Verificar se email já existe para outro usuário (na edição)
        if (user.getId() != null) {
            Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
            if (existingUser.isPresent() && !existingUser.get().getId().equals(user.getId())) {
                throw new RuntimeException("Email já está em uso");
            }
        }
        
        // Criptografar senha se foi alterada
        if (user.getId() == null || !user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        
        return userRepository.save(user);
    }
    
    public User update(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Verificar se email já existe para outro usuário
        Optional<User> existingUser = userRepository.findByEmail(userDetails.getEmail());
        if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
            throw new RuntimeException("Email já está em uso");
        }
        
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());
        user.setActive(userDetails.getActive());
        
        // Só atualizar senha se foi fornecida uma nova
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty() && 
            !userDetails.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        
        return userRepository.save(user);
    }
    
    public void deleteById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado");
        }
        userRepository.deleteById(id);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public User createDefaultAdmin() {
        if (!userRepository.existsByEmail("admin@sarahpilates.com")) {
            User admin = new User();
            admin.setName("Administrador");
            admin.setEmail("admin@sarahpilates.com");
            admin.setPassword("admin123");
            admin.setRole(User.UserRole.ADMIN);
            admin.setActive(true);
            return save(admin);
        }
        return userRepository.findByEmail("admin@sarahpilates.com").orElse(null);
    }
}