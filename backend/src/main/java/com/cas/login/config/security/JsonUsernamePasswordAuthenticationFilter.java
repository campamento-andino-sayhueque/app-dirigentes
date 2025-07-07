package com.cas.login.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import com.fasterxml.jackson.core.type.TypeReference;

public class JsonUsernamePasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final ObjectMapper objectMapper;

    public JsonUsernamePasswordAuthenticationFilter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        if (request.getContentType() != null && request.getContentType().contains("application/json")) {
            try {
                Map<String, String> credentials = objectMapper.readValue(request.getInputStream(), new TypeReference<Map<String, String>>() {});
                String username = credentials.get("username");
                String password = credentials.get("password");
                UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username, password);
                setDetails(request, authRequest);
                if (getAuthenticationManager() == null) {
                    throw new IllegalStateException("AuthenticationManager no configurado en el filtro JsonUsernamePasswordAuthenticationFilter");
                }
                return this.getAuthenticationManager().authenticate(authRequest);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else {
            return super.attemptAuthentication(request, response);
        }
    }
}
