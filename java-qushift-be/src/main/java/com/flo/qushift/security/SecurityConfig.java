package com.flo.qushift.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.server.resource.introspection.ReactiveOpaqueTokenIntrospector;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    @Value("${client.frontend-endpoint}")
    private String clientEndpoint;

    @Value("${spring.security.oauth2.resourceserver.opaque-token.introspection-uri}")
    private String introspectionUri;

    @Value("${spring.security.oauth2.resourceserver.opaque-token.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.resourceserver.opaque-token.client-secret}")
    private String clientSecret;

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(final ServerHttpSecurity http) {
		http.csrf(ServerHttpSecurity.CsrfSpec::disable);
        http.authorizeExchange(exchanges -> {
            // Swagger
            exchanges.pathMatchers("/swagger-ui.html").permitAll();
            // Health check
            exchanges.pathMatchers(HttpMethod.GET, "/actuator/**").permitAll();
            exchanges.anyExchange().permitAll();
        });
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        final CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(clientEndpoint));
//        configuration.setAllowedOrigins(List.of("*"));  // set access from all domains
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));

        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public ReactiveOpaqueTokenIntrospector introspector() {
        CustomAuthoritiesOpaqueTokenIntrospector customAuthoritiesOpaqueTokenIntrospector = new CustomAuthoritiesOpaqueTokenIntrospector();
        customAuthoritiesOpaqueTokenIntrospector.setDelegate(introspectionUri, clientId, clientSecret);
        return customAuthoritiesOpaqueTokenIntrospector;
    }
}
