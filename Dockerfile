FROM node:alpine as builder
RUN apk update && apk add curl yarn python3 build-base gcc wget git --no-cache
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

WORKDIR /usr/src/app

# Cache deps
COPY package.json yarn.lock ./
RUN yarn install --production --ignore-scripts --prefer-offline --pure-lockfile

# Build
COPY generate_translations.js \
  tsconfig.json \
  webpack.config.js \
  .babelrc \
  ./

COPY lemmy-translations lemmy-translations
COPY src src

ARG VERSION="unknown"
ARG COMMIT="unknown"

# Set UI version
RUN echo "export const VERSION = '${VERSION}';\nexport const COMMIT = '${COMMIT}';" > "src/shared/version.ts"

RUN yarn 
RUN yarn build:prod

# Prune the image
RUN node-prune /usr/src/app/node_modules

RUN rm -rf ./node_modules/import-sort-parser-typescript
RUN rm -rf ./node_modules/typescript
RUN rm -rf ./node_modules/npm

RUN du -sh ./node_modules/* | sort -nr | grep '\dM.*'

FROM node:alpine as runner
COPY --from=builder /usr/src/app/dist /app/dist
COPY --from=builder /usr/src/app/node_modules /app/node_modules

ENV LEMMY_UI_HOST="0.0.0.0:1234"
ENV LEMMY_UI_EXTRA_THEMES_FOLDER="./extra_themes"
ENV LEMMY_UI_DEBUG="false"

ENV LEMMY_INTERNAL_HOST="0.0.0.0:8536"
ENV LEMMY_EXTERNAL_HOST="0.0.0.0:8536"
ENV LEMMY_WS_HOST="0.0.0.0:8536"
ENV LEMMY_HTTPS="false"

EXPOSE 1234
WORKDIR /app
CMD node dist/js/server.js
