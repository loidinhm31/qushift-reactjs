package com.flo.qushift.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.DefaultOAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.core.OAuth2TokenIntrospectionClaimNames;
import org.springframework.security.oauth2.server.resource.introspection.NimbusReactiveOpaqueTokenIntrospector;
import org.springframework.security.oauth2.server.resource.introspection.ReactiveOpaqueTokenIntrospector;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Collection;
import java.util.List;

@Component
public class CustomAuthoritiesOpaqueTokenIntrospector implements ReactiveOpaqueTokenIntrospector {
    private NimbusReactiveOpaqueTokenIntrospector delegate;

    public void setDelegate(String introspectionUri, String clientId, String clientSecret) {
        this.delegate = new NimbusReactiveOpaqueTokenIntrospector(introspectionUri, clientId, clientSecret);
    }

    @Override
    public Mono<OAuth2AuthenticatedPrincipal> introspect(String token) {
        Mono<OAuth2AuthenticatedPrincipal> principalMono = this.delegate.introspect(token);
        return principalMono
                .flatMap(principal -> {
                    String username;
                    if (principal.getAttributes().containsKey("username")) {
                        username = principal.getAttributes().get("username").toString();
                    } else {
                        username = principal.getName();
                    }
                    return Mono.just(new DefaultOAuth2AuthenticatedPrincipal(
                            username, principal.getAttributes(), extractAuthorities(principal)));
                });
    }

    private Collection<GrantedAuthority> extractAuthorities(OAuth2AuthenticatedPrincipal principal) {
        List<String> scopes = principal.getAttribute(OAuth2TokenIntrospectionClaimNames.SCOPE);

        Collection<? extends GrantedAuthority> grantedAuthorities = null;
        if (principal.getAttributes().containsKey("username")) {
            String userSso = principal.getAttributes().get("username").toString();

            // TODO Get priority authorities
        }
        return (Collection<GrantedAuthority>) grantedAuthorities;
    }
}
