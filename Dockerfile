FROM node:current-alpine@sha256:b8ea75e6dcdf7dbba1ea8b57f77ec89ef04c1719d2ae986c8fbea21f9f4ec187 AS build

RUN mkdir /form-management
WORKDIR /form-management

RUN npm install -g @angular/cli@20.0.5

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN ng build --configuration production

FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /form-management/dist/form-management/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
