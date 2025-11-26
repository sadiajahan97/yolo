docker compose down --volumes
docker volume prune --force
docker system prune --force
docker compose build --no-cache
docker compose up
