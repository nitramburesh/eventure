package com.bures.eventure

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Import
import org.springframework.security.config.annotation.web.builders.WebSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity


@SpringBootApplication(exclude = [SecurityAutoConfiguration::class])
@Import(SecurityConfig::class)
//@EnableWebSecurity
class EventureApplication
fun main(args: Array<String>) {
	runApplication<EventureApplication>(*args)
}
