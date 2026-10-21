# Utilizar una imagen base que soporte Node.js
FROM node:20-bullseye-slim

# Instalar el motor SWI-Prolog y dependencias[cite: 8]
RUN apt-get update && \
    apt-get install -y swi-prolog && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar configuración de dependencias de la API
COPY package*.json ./

# Instalar Express
RUN npm install

# Copiar el código Prolog, el servidor y el frontend estático
COPY . .

# Exponer el puerto de comunicación del servicio web
EXPOSE 3000

# Comando de arranque del contenedor
CMD ["node", "server.js"]