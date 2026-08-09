# syntax=docker/dockerfile:1

# nginxinc/nginx-unprivileged runs as a non-root user out of the box and
# listens on 8080 instead of 80 — no NET_BIND_SERVICE capability needed,
# consistent with the Pod Security Contexts in your other DevSecOps project.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY --chown=nginx:nginx index.html /usr/share/nginx/html/index.html
COPY --chown=nginx:nginx admin.html /usr/share/nginx/html/admin.html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/ || exit 1
