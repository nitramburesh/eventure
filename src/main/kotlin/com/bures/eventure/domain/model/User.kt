package com.bures.eventure.domain.model
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
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

    var likedEvents: List<ObjectId> = emptyList()
    var attendedEvents: List<ObjectId> = emptyList()
    var profilePicture: String = ""
    fun comparePassword(password: String): Boolean {
        return BCryptPasswordEncoder().matches(password, this.password)
    }

}

