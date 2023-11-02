package com.bures.eventure.domain.model

import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "location")
data class Location(
var city: String,
var streetAddress: String,
var postalCode: Int,
)

