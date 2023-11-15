package com.example.web.config.security;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${EC2_HOST}")
    String frontHost;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://"+frontHost+":*") // React 앱의 주소
                .allowedOrigins("http://"+frontHost) // React 앱의 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS") // 허용할 HTTP 메서드
                .allowedHeaders("*")
                .exposedHeaders("*")
                .allowCredentials(true);
    }
}
