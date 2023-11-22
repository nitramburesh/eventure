package com.bures.eventure.domain.controller

import com.bures.eventure.domain.dto.auth.LoginDTO
import com.bures.eventure.domain.dto.auth.LoginResponseDTO
import com.bures.eventure.domain.dto.auth.RegisterDTO
import com.bures.eventure.domain.model.User
import com.bures.eventure.security.JwtTokenUtil
import com.bures.eventure.service.UserService
import io.jsonwebtoken.Jwts
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.context.support.HttpRequestHandlerServlet
import java.util.Date


@RestController
@RequestMapping("/api/v1")
class AuthController(private val userService: UserService, private val jwtTokenUtil: JwtTokenUtil) {
    @PostMapping("/register")
    fun register(@RequestBody body: RegisterDTO): ResponseEntity<User>{
        val user = User()
        user.username = body.username
        user.password = body.password
        user.likedEvents = emptyList()
        user.profilePicture = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"

        return ResponseEntity.ok(userService.save(user));
    }

    @PostMapping("/login")
    fun login(@RequestBody body: LoginDTO, response: HttpServletResponse): ResponseEntity<Any>{
        val user = userService.findByUsername(body.username) ?: return ResponseEntity.badRequest().body("User not found!")

        if (!user.comparePassword(body.password)){
            return ResponseEntity.badRequest().body("Invalid password!")
        }
        val jwt = jwtTokenUtil.generateJwtToken(user)

        val cookie = Cookie("jwt", jwt)
        cookie.isHttpOnly = true;
        response.addCookie(cookie)
        return ResponseEntity.ok(LoginResponseDTO(id = user.id.toString(), username = user.username, profilePicture = user.profilePicture))
    }
    @PostMapping("/logout")
    fun logout(response: HttpServletResponse):ResponseEntity<Any>{
        val cookie = Cookie("jwt", null)
        cookie.maxAge = 0
        response.addCookie(cookie)

        return ResponseEntity.ok("Successfully logged out")
    }

}