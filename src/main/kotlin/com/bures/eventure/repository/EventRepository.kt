package com.bures.eventure.repository

import com.bures.eventure.domain.dto.event.EventDTO
import com.bures.eventure.domain.model.Event
import org.bson.types.ObjectId
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query

import org.springframework.data.repository.query.Param

interface EventRepository: MongoRepository<Event, ObjectId> {
    fun findAllBy(pageable: Pageable): List<Event>
    fun findAllByCreatorId(creatorId: String): List<Event>
    fun findByCommentsIn(comments: List<ObjectId>): List<Event>
    fun findByAttendeesIn(userId: ObjectId): List<Event>
}