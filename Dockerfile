FROM caddy:2-alpine

WORKDIR /app

# Copy website files and assets
COPY . /app
COPY Caddyfile /etc/caddy/Caddyfile

# Railway injects $PORT environment variable dynamically
EXPOSE 80 3000 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
