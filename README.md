# ShaReCon

> **IN DEVELOPMENT**

## Overview

ShaReCon is intended to be Modern Open-Source Social Media Platform (that is also a part of my engineering thesis)

## Features

- **Acount Creation**
- **Add textual posts**
- **Leave comments under posts**
- **More to come...**

## How it works?

Client side is written in React, while the backend is written in NodeJS (with some Typescript on top of it) and all the data is stored using Postgres database.
All is containerized with Docker.

## Prerequisites

Before running the application, ensure you have the Docker (v24.0.6) installed.

To setup the Docker environment for the application run:

    ```bash
    bash ./startup.sh
    ```

## Getting Started

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/imasharc/ShaReCon.git
   ```

2. Install the required libraries:

   ```bash
   bash ./startup.sh
   ```

3. Ports used for application:
   - frontend: 3000
   - backend: 3001
   - postgres web admin: 5050

## Configuration

You can customize the ports of the application by modifying:

- backend\docker\docker-compose-db.yaml for the database
- backend\docker\docker-compose-dev.yaml for backend development
- frontend\docker\docker-compose-dev.yaml for frontend development
