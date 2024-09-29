# Build stage
FROM node:18-alpine as builder

# Gerekli araçları yükle
RUN apk add --no-cache python3 make g++

# Çalışma dizinini ayarla
WORKDIR /app

# Sadece package.json ve package-lock.json'ı kopyala
COPY package*.json ./

# npm ci yerine npm install kullan ve ek adımlar ekle
RUN npm install && \
    npm install @rollup/rollup-linux-x64-musl && \
    npm rebuild && \
    npm cache clean --force

# Geri kalan dosyaları kopyala
COPY . .

# Build işlemini çalıştır
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Nginx yapılandırmasını kopyala
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build çıktısını Nginx'in servis edeceği dizine kopyala
COPY --from=build /app/dist /usr/share/nginx/html

# 80 portunu aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]