package com.nexushr.nexushr.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI nexusHrOpenAPI() {

        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()

                .info(

                        new Info()

                                .title("Nexus HR Management System API")

                                .version("1.0")

                                .description("REST APIs for Nexus HR Management System")

                                .contact(

                                        new Contact()

                                                .name("Chayan De")

                                                .email("your-email@example.com")

                                )

                                .license(

                                        new License()

                                                .name("MIT License")

                                )

                )

                .addSecurityItem(

                        new SecurityRequirement()

                                .addList(securitySchemeName)

                )

                .schemaRequirement(

                        securitySchemeName,

                        new SecurityScheme()

                                .name(securitySchemeName)

                                .type(SecurityScheme.Type.HTTP)

                                .scheme("bearer")

                                .bearerFormat("JWT")

                );

    }

}