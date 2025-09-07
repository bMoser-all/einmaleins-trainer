FROM nginx:alpine
# envsubst für Template-Substitution
RUN apk add --no-cache gettext

# static files
COPY dist /usr/share/nginx/html

# nginx template (wird beim Start in die echte conf umgewandelt)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# generate config from template and start nginx in foreground
CMD ["sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]