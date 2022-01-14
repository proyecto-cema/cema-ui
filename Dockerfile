# build stage
FROM node:lts-alpine as build-stage
ARG ENVIRONMENT_NAME
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
RUN yarn run "build-$ENVIRONMENT_NAME"

# production stage
FROM nginx:stable-alpine as production-stage
RUN rm /etc/nginx/conf.d/default.conf
COPY  /nginx/cema-ui.conf /etc/nginx/conf.d/cema-ui.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]