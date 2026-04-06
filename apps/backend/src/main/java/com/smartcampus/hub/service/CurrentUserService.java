package com.smartcampus.hub.service;

import com.smartcampus.hub.exception.BadRequestException;
import com.smartcampus.hub.exception.ResourceNotFoundException;
import com.smartcampus.hub.model.User;
import com.smartcampus.hub.model.UserRole;
import com.smartcampus.hub.repository.UserRepository;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

  private final UserRepository userRepository;

  public User requireUser() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null
        || !auth.isAuthenticated()
        || "anonymousUser".equals(auth.getPrincipal().toString())) {
      throw new BadRequestException("Not authenticated");
    }
    String email = auth.getName();
    return userRepository
        .findByEmailIgnoreCase(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
  }

  public boolean hasRole(UserRole role) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null) {
      return false;
    }
    String target = "ROLE_" + role.name();
    return auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).anyMatch(target::equals);
  }

  public boolean hasAnyRole(UserRole... roles) {
    Set<String> wanted =
        java.util.Arrays.stream(roles).map(r -> "ROLE_" + r.name()).collect(Collectors.toSet());
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null) {
      return false;
    }
    return auth.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .anyMatch(wanted::contains);
  }
}
