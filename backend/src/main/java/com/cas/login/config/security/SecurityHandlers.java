package com.cas.login.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Manejadores de autenticación para respuestas JSON personalizadas.
 * Esta clase centraliza la lógica de respuesta para eventos de autenticación
 * exitosa y fallida, proporcionando respuestas consistentes en formato JSON.
 */
@RequiredArgsConstructor
public class SecurityHandlers {
    
    private final ObjectMapper objectMapper;
    
    /**
     * Crea un manejador para autenticación exitosa.
     * Devuelve información del usuario y sus roles en formato JSON.
     * 
     * @return AuthenticationSuccessHandler configurado
     */
    // Métodos de handlers eliminados para dejar el login pelado
    
    /**
     * Crea un manejador para logout exitoso.
     * Devuelve confirmación en formato JSON.
     * 
     * @return LogoutSuccessHandler como lambda
     */
    public static void handleLogoutSuccess(
            jakarta.servlet.http.HttpServletRequest request,
            jakarta.servlet.http.HttpServletResponse response,
            org.springframework.security.core.Authentication authentication) throws java.io.IOException {
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"success\": true, \"message\": \"Logout successful\"}");
        response.getWriter().flush();
    }
}
