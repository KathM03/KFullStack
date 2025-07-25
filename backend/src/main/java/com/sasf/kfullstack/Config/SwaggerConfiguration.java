package com.sasf.kfullstack.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfiguration {
        final String securitySchemeName = "bearerAuth";

        @Bean
        public OpenAPI apiInfo() {
                return new OpenAPI()
                                .info(new Info()
                                                .title("API Kfullstack")
                                                .version("v1")
                                                .description("Documentación de la API")
                                                .contact(new Contact()
                                                                .name("Katherine Molina")
                                                                .email("katherine.molina@sasf.net")

                                                ))
                                .addSecurityItem(new SecurityRequirement()
                                                .addList(securitySchemeName))
                                .components(new Components()
                                                .addSecuritySchemes(securitySchemeName,
                                                                new SecurityScheme()
                                                                                .name(securitySchemeName)
                                                                                .type(SecurityScheme.Type.HTTP)
                                                                                .scheme("bearer")
                                                                                .bearerFormat("JWT")));
        }

}
