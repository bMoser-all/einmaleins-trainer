FROM nginx:alpine
RUN apk add --no-cache gettext

# static files
COPY dist /usr/share/nginx/html

# nginx template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# start script
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# optional: document the port
EXPOSE 8080

# run the helper script (exec will replace shell with nginx)
ENTRYPOINT ["/usr/local/bin/start.sh"]