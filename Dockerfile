# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /tmp/dev /tmp/prod && \
    chown -R bun:bun /tmp

# Copy and install dependencies in development mode
COPY --chown=bun:bun package.json bun.lockb /tmp/dev/
USER bun
RUN cd /tmp/dev && bun install --frozen-lockfile

# Copy and install dependencies in production mode
COPY --chown=bun:bun package.json bun.lockb /tmp/prod/
RUN cd /tmp/prod && bun install --frozen-lockfile --production

# Copy node_modules from temp directory
# Then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /tmp/prod/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
RUN bun test
RUN bun run build.ts

# Copy production dependencies and source code into final image
FROM base AS release
COPY --from=prerelease /app/out .

# Environmental Variables
ARG DB_HOST=default_host
ARG DB_DATABASE=default_database
ARG MYSQL_PORT=3306
ARG MYSQL_USER=default_user
ARG MYSQL_PWD=default_password
ARG UNSHORTEN_API=default_api

ENV DB_HOST=$DB_HOST \
DB_DATABASE=$DB_DATABASE \
MYSQL_PORT=$MYSQL_PORT \
MYSQL_USER=$MYSQL_USER \
MYSQL_PWD=$MYSQL_PWD \
UNSHORTEN_API=$UNSHORTEN_API

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "index.js" ]