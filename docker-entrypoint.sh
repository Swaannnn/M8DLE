#!/bin/sh
set -e

# Applique les migrations Prisma avant de démarrer (désactivable avec SKIP_MIGRATIONS=true).
if [ "${SKIP_MIGRATIONS}" != "true" ]; then
    echo "Running prisma migrate deploy..."
    (cd /app/migrate && ./node_modules/.bin/prisma migrate deploy)
fi

exec node server.js
