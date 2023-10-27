package com.example.web.service;

import com.example.web.jwt.JwtService;
import com.example.web.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.User;
import com.example.web.model.entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = new User();
        try {
            user = userRepository.findByUserName(username)
                    .orElseThrow(() -> new UsernameNotFoundException("유저 정보를 찾을수 없습니다 : " + username));
        } catch (Exception e) {
            System.out.println(e);
        }
        return new org.springframework.security.core.userdetails.User(
                user.getUserName(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }

    public void registry(User user) {
        if (user.getRole() == null) {
            user.setRole(User.Role.USER);
        }
        System.out.println(user.getUserName());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public String login(User user) {
        User account2 = userRepository.findByUserName(user.getUserName())
                .orElseThrow(() -> new IllegalArgumentException("유저 정보를 찾을수 없습니다 : " + user.getUserName()));
        if (!passwordEncoder.matches(user.getPassword(), account2.getPassword())) {
            throw new IllegalArgumentException("잘못된 비밀번호입니다.");
        }
        return jwtService.createToken(account2);
    }

}
