package com.bures.eventure.domain.model
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.MongoId
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Component

@Document(collection = "users")
@Component
class User {
    @Id
    var id: ObjectId = ObjectId.get()

    @Indexed(unique = true)
    var username: String = ""

    var password: String = ""
        set(value){
            field = BCryptPasswordEncoder().encode(value)
        }

    var likedEvents: List<String> = emptyList()
    var attendedEvents: List<String> = emptyList()
    fun comparePassword(password: String): Boolean {
        return BCryptPasswordEncoder().matches(password, this.password)
    }

}

