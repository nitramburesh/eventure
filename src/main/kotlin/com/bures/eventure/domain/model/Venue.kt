package com.bures.eventure.domain.model

import org.bson.types.ObjectId
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.MongoId

@Document(collection = "venues")
data class Venue(
    @MongoId
    val id: ObjectId,
    val name: String,
    val address: String,
    val city: String,
    val country: String,
    val postalCode: Int
)
