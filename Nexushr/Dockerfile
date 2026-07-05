# ---------- Build Stage ----------
FROM maven:3.9.8-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .

COPY src ./src

# Combine dependency resolution and package in one layer with cache mount  
RUN --mount=type=cache,target=/root/.m2 mvn clean package -DskipTests -q

# ---------- Runtime Stage ----------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
