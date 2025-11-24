FROM node:lts-slim AS build
WORKDIR /tmp
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:lts-slim
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
COPY --from=build /tmp/.next .next
COPY --from=build /tmp/node_modules node_modules
RUN npm prune
CMD ["npm", "start"]
