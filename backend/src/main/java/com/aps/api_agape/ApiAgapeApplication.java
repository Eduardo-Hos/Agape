package com.aps.api_agape;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class ApiAgapeApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiAgapeApplication.class, args);
    }

    @Bean
    public BCryptPasswordEncoder encoderSenha() {
        return new BCryptPasswordEncoder();
    }
}
