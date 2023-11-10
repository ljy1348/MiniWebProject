package com.example.web.jwt;

import com.example.web.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Slf4j
public class JwtRequestFilter extends OncePerRequestFilter {

    // JWT 관련 로직을 처리하는 서비스
    private JwtService jwtService;
    private UserService userService;
    public JwtRequestFilter(JwtService jwtService, UserService accountService) {
        this.jwtService = jwtService;
        this.userService = accountService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        try {
        String username = jwtService.extractUsername(token);
        List<SimpleGrantedAuthority> list = jwtService.getAuthoritiesStringFromToken(token);
            // 토큰 검증 로직
            if (!jwtService.isTokenExpired(token)) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        list
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            // 토큰 검증 실패
            SecurityContextHolder.clearContext();
        }
        filterChain.doFilter(request, response);
    }
}
