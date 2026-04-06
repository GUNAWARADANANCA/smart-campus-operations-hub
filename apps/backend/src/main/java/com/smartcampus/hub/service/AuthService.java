package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.RegisterRequest;
import com.smartcampus.hub.dto.UserDto;
import com.smartcampus.hub.exception.BadRequestException;
import com.smartcampus.hub.exception.ResourceNotFoundException;
import com.smartcampus.hub.model.User;
import com.smartcampus.hub.model.UserRole;
import com.smartcampus.hub.repository.UserRepository;
import com.smartcampus.hub.service.support.DtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;

  public UserDto login(String email, String ignoredPassword) {
    User user =
        userRepository
            .findByEmailIgnoreCase(email.trim())
            .orElseThrow(() -> new ResourceNotFoundException("Unknown email"));
    return DtoMapper.toUserDto(user);
  }

  @Transactional
  public UserDto register(RegisterRequest request) {
    if (userRepository.existsByEmailIgnoreCase(request.email().trim())) {
      throw new BadRequestException("Email already registered");
    }
    User created =
        User.builder()
            .name(request.name().trim())
            .email(request.email().trim().toLowerCase())
            .role(UserRole.USER)
            .build();
    return DtoMapper.toUserDto(userRepository.save(created));
  }
}
