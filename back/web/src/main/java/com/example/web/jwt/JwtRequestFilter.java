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
//        jwt 토큰을 통해 username을 얻고 데이터베이스에서 user의 권한 받아오기
//        jwt의 장점인 서버와의 통신 없이 인증정보를 활용하기에 위반되기 때문에 우선 주석처리
//        혹시 보안을 강화 하고 싶거나 유저의 권한 정보가 실시간으로 반영되기를 원한다면 사용
//        혹은 이것 말고 리프레시 토큰을 사용하면 비슷한 효과를 낼 수 있다.
//        try {
//            String username = jwtService.extractUsername(token);
//            UserDetails userDetails = accountService.loadUserByUsername(username);
//            // 토큰 검증 로직
//            if (jwtService.validateToken(token, userDetails)) {
//                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
//                        userDetails.getUsername(),
//                        null,
//                        userDetails.getAuthorities()
//                );
//                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                SecurityContextHolder.getContext().setAuthentication(authentication);
//            }

        filterChain.doFilter(request, response);
    }
}
