#!/bin/bash
# Force usage of Java 21 for this project to avoid Lombok/JDK 24 issues
export JAVA_HOME="/Users/paulhwang/Library/Java/JavaVirtualMachines/temurin-21.0.5/Contents/Home"

# Load environment variables from .env if present
if [ -f ../.env ]; then
  echo "Loading environment variables from ../.env"
  export $(grep -v '^#' ../.env | xargs)
else
  echo "Warning: ../.env file not found. Database connection may fail."
fi

./mvnw spring-boot:run
