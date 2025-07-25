package com.sasf.kfullstack.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sasf.kfullstack.Entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    public Optional<User> findByUsername(String username);

    public Optional<User> findByEmail(String email);

    public boolean existsByEmail(String email);
    
    public boolean existsByUsername(String username);

    public Optional<User> findByEmailAndStatus(String email, String status);

}
