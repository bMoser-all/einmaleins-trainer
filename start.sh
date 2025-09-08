#!/bin/sh
: "${PORT:=8080}"           # default if not set
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'