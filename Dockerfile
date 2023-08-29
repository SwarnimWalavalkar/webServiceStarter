FROM node:16-alpine as build_image
# add arm support
RUN apk add --no-cache g++ make python3
WORKDIR /usr/app
COPY package.json yarn.lock ./
COPY . .
RUN yarn --frozen-lockfile
RUN yarn build

FROM node:16-alpine
# add arm support
RUN apk add --no-cache g++ make python3
WORKDIR /usr/app
COPY package.json yarn.lock ./
COPY --from=build_image /usr/app/dist ./dist
COPY --from=build_image /usr/app/package.json ./package.json
RUN yarn install --production
EXPOSE 4000
CMD yarn start
