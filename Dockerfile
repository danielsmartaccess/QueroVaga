FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Garantir que a pasta de assets exista
RUN mkdir -p /app/src/assets/images

# Instalar servidor http simples com suporte a proxy
RUN npm install -g http-server

# Compilar o aplicativo Angular para produção
RUN npm run build

# Porta para o servidor node
EXPOSE 4200

# Iniciar o servidor com suporte a proxy
CMD ["http-server", "dist/frontend", "-p", "4200", "--proxy", "http://backend:8000"]
