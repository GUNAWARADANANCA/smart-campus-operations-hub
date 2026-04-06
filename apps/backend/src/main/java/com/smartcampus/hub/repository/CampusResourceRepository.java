package com.smartcampus.hub.repository;

import com.smartcampus.hub.model.CampusResource;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CampusResourceRepository extends MongoRepository<CampusResource, String> {
}