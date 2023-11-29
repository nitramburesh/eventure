package com.bures.eventure.repository

import com.bures.eventure.domain.model.Venue
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository

interface VenueRepository: MongoRepository<Venue, ObjectId> {
}