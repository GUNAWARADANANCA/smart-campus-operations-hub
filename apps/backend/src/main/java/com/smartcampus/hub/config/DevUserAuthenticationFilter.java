package com.smartcampus.hub.config;

import com.smartcampus.hub.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

@RequiredArgsConstructor
public class DevUserAuthenticationFilter extends OncePerRequestFilter {

  public static final String HEADER = "X-Dev-User-Email";

  private final UserRepository userRepository;

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {
    String email = request.getHeader(HEADER);
    if (email != null && !email.isBlank()) {
      userRepository
          .findByEmailIgnoreCase(email.trim())
          .ifPresent(
              user -> {
                var authorities =
                    List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
                var token =
                    new UsernamePasswordAuthenticationToken(
                        user.getEmail(), null, authorities);
                SecurityContextHolder.getContext().setAuthentication(token);
              });
    }
    filterChain.doFilter(request, response);
  }
}
