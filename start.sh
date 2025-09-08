#!/bin/sh
# set default port if not provided
: "${PORT:=8080}"

echo "Starting container, PORT=$PORT"
# substitute only $PORT in the template and write actual nginx conf
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# exec nginx in foreground so signals are propagated
exec nginx -g 'daemon off;'