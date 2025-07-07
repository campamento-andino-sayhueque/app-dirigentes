package com.cas.login.config.security;

import com.cas.login.config.CookieLoggingFilter;
import com.cas.login.service.UserDetailsServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.http.HttpStatus;
import org.springframework.core.annotation.Order;


/**
 * Configuración de seguridad modularizada para la aplicación.
 * Esta clase configura Spring Security con dos cadenas de filtros separadas:
 * - Una para endpoints de API (/api/**)
 * - Otra para autenticación por formularios
 * 
 * La configuración utiliza clases auxiliares para mantener el código organizado:
 * - SecurityRoles: constantes de roles
 * - SecurityEndpoints: configuración de permisos por endpoint
 * - SecurityHandlers: manejadores de eventos de autenticación
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private SecurityHandlers securityHandlers;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }   
    
    @Bean
    @Order(1) // API specific configuration (incluye login)
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        // Initialize security handlers
        if (securityHandlers == null) {
            securityHandlers = new SecurityHandlers(objectMapper);
        }


        JsonUsernamePasswordAuthenticationFilter jsonAuthFilter = new JsonUsernamePasswordAuthenticationFilter(objectMapper);
        jsonAuthFilter.setAuthenticationManager(http.getSharedObject(org.springframework.security.authentication.AuthenticationManager.class));
        jsonAuthFilter.setFilterProcessesUrl("/api/login");
        jsonAuthFilter.setAuthenticationSuccessHandler(securityHandlers.createSuccessHandler());
        jsonAuthFilter.setAuthenticationFailureHandler(securityHandlers.createFailureHandler());

        http
            .securityMatcher("/api/**")
            .authorizeHttpRequests(SecurityEndpoints::configureApiEndpoints)
            .addFilterAt(jsonAuthFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
            .logout(logout ->
                logout
                    .logoutUrl("/api/logout")
                    .logoutSuccessHandler(SecurityHandlers::handleLogoutSuccess)
                    .permitAll()
            )
            .httpBasic(customizer -> {})
            .csrf(csrf -> csrf.disable())
            .addFilterAfter(new CookieLoggingFilter(), org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(eh -> eh
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            )
            .authenticationProvider(authenticationProvider());

        return http.build();
    }
}
