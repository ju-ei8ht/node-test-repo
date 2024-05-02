# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app .

# Environmental Variables
ARG DB_HOST=DB_HOST
ARG DB_DATABASE=DB_DATABASE
ARG MYSQL_PORT=MYSQL_PORT
ARG MYSQL_USER=MYSQL_USER
ARG MYSQL_PWD=MYSQL_PWD
ARG UNSHORTEN_API=UNSHORTEN_API

ENV DB_HOST=$DB_HOST \
DB_DATABASE=$DB_DATABASE \
MYSQL_PORT=$MYSQL_PORT \
MYSQL_USER=$MYSQL_USER \
MYSQL_PWD=$MYSQL_PWD \
UNSHORTEN_API=$UNSHORTEN_API

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/routes/index.ts" ]