package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.ResourceCreateRequest;
import com.smartcampus.hub.dto.ResourceDto;
import com.smartcampus.hub.dto.ResourceUpdateRequest;
import com.smartcampus.hub.service.CampusResourceService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class CampusResourceController {

  private final CampusResourceService campusResourceService;

  @GetMapping
  public List<ResourceDto> list() {
    return campusResourceService.findAll();
  }

  @GetMapping("/{id}")
  public ResourceDto get(@PathVariable Long id) {
    return campusResourceService.findById(id);
  }

  @PostMapping
  public ResourceDto create(@Valid @RequestBody ResourceCreateRequest body) {
    return campusResourceService.create(body);
  }

  @PutMapping("/{id}")
  public ResourceDto update(@PathVariable Long id, @Valid @RequestBody ResourceUpdateRequest body) {
    return campusResourceService.update(id, body);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    campusResourceService.delete(id);
  }
}
