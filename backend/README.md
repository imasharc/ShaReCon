# backend of the app

[building the image w/ docker]:
RUNNING DEV:
docker compose -f docker-compose.dev.yaml up --build -d

RUNNING PROD:
docker compose up --build -d

-d -> detach flag so that u can still use the terminal