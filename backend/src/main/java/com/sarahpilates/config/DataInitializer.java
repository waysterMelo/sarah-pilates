package com.sarahpilates.config;

import com.sarahpilates.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final UserService userService;
    
    @Override
    public void run(String... args) throws Exception {
        try {
            // Criar usuário admin padrão
            userService.createDefaultAdmin();
            log.info("Usuário admin padrão criado/verificado com sucesso");
            log.info("Email: admin@sarahpilates.com");
            log.info("Senha: admin123");
        } catch (Exception e) {
            log.error("Erro ao criar usuário admin padrão: ", e);
        }
    }
}