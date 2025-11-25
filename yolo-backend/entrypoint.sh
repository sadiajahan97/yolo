#!/bin/sh
prisma migrate deploy
exec "$@"
