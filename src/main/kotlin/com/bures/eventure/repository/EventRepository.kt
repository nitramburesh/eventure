package com.bures.eventure.repository

import com.bures.eventure.domain.dto.event.EventDTO
import com.bures.eventure.domain.model.Event
import org.bson.types.ObjectId
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository

interface EventRepository: MongoRepository<Event, ObjectId> {
    fun findAllBy(pageable: Pageable): List<Event>
}