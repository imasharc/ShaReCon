#!/bin/bash

################
# Stage 1 logic
################

echo "Executing Stage 1: Setting up environment..."

################
# BACKEND
# compose database container
echo "Starting Stage 1.1-database: Composing database containers..."
docker-compose -f backend/docker/docker-compose-db.yaml up --build -d

# Check the exit code of the last command
if [ $? -eq 0 ]; then
    echo "Stage 1.1-database: Docker-compose command succeeded."
else
    echo "Stage 1.1-database: Docker-compose command failed."
    echo "Stopping the script..."
    exit 1
fi

# compose dev backend container
echo "Starting Stage 1.1-backend: Composing backend dev container..."
docker-compose -f backend/docker/docker-compose-dev.yaml up --build -d

# Check the exit code of the last command
if [ $? -eq 0 ]; then
    echo "Stage 1.1-backend: Docker-compose command succeeded."
else
    echo "Stage 1.1-backend: Docker-compose command failed."
    echo "Stopping the script..."
    exit 1
fi
# BACKEND
################

################
# FRONTEND
# compose dev container
echo "Starting Stage 1.1-frontend: Composing frontend dev container..."
docker-compose -f frontend/docker/docker-compose-dev.yaml up --build -d

# Check the exit code of the last command
if [ $? -eq 0 ]; then
    echo "Stage 1.1-frontend: Docker-compose command succeeded."
else
    echo "Stage 1.1-frontend: Docker-compose command failed."
    echo "Stopping the script..."
    exit 1
fi
# FRONTEND
################

echo "Finished all sub-stages from Stage 1. Waiting 10s for environments to startup fully..."

################
# Stage 1 logic completed
# wait for a few seconds to ensure database is up and running
sleep 10
################

################
# Stage 2 logic
################

echo "Executing Stage 2: Setting up database schema..."

################
# DATABASE SCHEMA
# execute the database schema creation script
echo "Starting Stage 2.1-postgres-schema: Setting up postgres schema..."
docker exec -i postgres16 psql -U postgres -d postgres < backend/database_schema.sql

# Check the exit code of the last command
if [ $? -eq 0 ]; then
    echo "Stage 2.1-postgres: Docker exec command succeeded."
else
    echo "Stage 2.1-postgres: Docker exec command failed."
    echo "Stopping the script..."
    exit 1
fi

echo "Finished all sub-stages from Stage 2"

################
echo "All stages executed successfully"