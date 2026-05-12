
FROM node:20.11.0

WORKDIR /app

COPY package.json ./


RUN npm install


COPY . .


RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*


CMD ["npm", "run", "dev"]