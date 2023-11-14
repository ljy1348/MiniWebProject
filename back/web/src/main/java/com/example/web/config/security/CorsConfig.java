package com.example.web.config.security;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

        @Value("http://localhost:3000")
        private String localport;

    @Value("http://${FRONT_HOST}")
    private String frontHost;

        @Value("${front.proxy.http}")
        private String proxy;


    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(localport, proxy,frontHost) // React 앱의 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS") // 허용할 HTTP 메서드
                .allowedHeaders("*")
                .exposedHeaders("*");
    }
}
