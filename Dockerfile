# Etapa 1: build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


# Etapa 2: servir com Nginx
FROM nginx:stable-alpine AS production

# Copia arquivos da build para o Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove a config default do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Adiciona a configuração personalizada
COPY ./nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
