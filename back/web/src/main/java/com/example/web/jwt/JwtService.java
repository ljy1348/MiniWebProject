package com.example.web.jwt;



import com.example.web.model.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

@Slf4j
@Component
public class JwtService {

    @Value("${jwt.secretKey}")
    private String SECRET_KEY;


    public String createToken(User user) {
        Claims claims = Jwts.claims().setSubject(user.getUserName());
        claims.put("role", user.getRole());// JWT payload 에 저장되는 정보단위// 정보는 key / value 쌍으로 저장
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims) // 정보 저장
                .setIssuedAt(now) // 토큰 발행 시간 정보
                .setExpiration(new Date(now.getTime() + 1000*60*60)) // 토큰 유효시각 설정
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)  // 암호화 알고리즘과, secret 값
                .compact();
    }

//    jwt토큰 디코딩
    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }

//    jwt 토큰을 디코딩 해서 claim 정보 가져오기
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

//    추출한 claim에서 username 가져오기
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

//    추출한 claim에서 만료시간 가져오기
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

//    추출한 클레임에서 사용자 권한 가져오기
    public List<SimpleGrantedAuthority> getAuthoritiesFromToken(String token) {
    Claims claims = extractAllClaims(token);
    String role = (String) claims.get("role"); // 문자열로 권한 정보를 읽어옴
    return Collections.singletonList(new SimpleGrantedAuthority("ROLE_"+role));
    }

//    사용자 권한 가져오기 - 단건
    public List<SimpleGrantedAuthority> getAuthoritiesStringFromToken(String token) {
        Claims claims = extractAllClaims(token);
        String role = (String) claims.get("role"); // 문자열로 권한 정보를 읽어옴
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_"+role));
    }

//    토큰이 만료되었는지 확인
    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

//    토큰이 인증 정보와 같은지 확인하기
    public Boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
}

}