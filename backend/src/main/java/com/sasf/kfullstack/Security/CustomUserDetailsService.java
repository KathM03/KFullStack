package com.sasf.kfullstack.Security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.sasf.kfullstack.Constants.StatusConstants;
import com.sasf.kfullstack.Entity.User;
import com.sasf.kfullstack.Repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User userData = userRepository.findByEmailAndStatus(email, StatusConstants.ACTIVE)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new org.springframework.security.core.userdetails.User(
                userData.getEmail(),
                userData.getPassword(),
                java.util.Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + userData.getRole().name())));
    }
}
