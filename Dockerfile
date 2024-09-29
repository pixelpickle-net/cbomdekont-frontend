# Build stage
FROM node:18-alpine AS builder

# Gerekli paketleri yükle
RUN apk add --no-cache python3 make g++

# Çalışma dizinini ayarla
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm ci

# Kaynak kodları kopyala
COPY . .

# Uygulamayı build et
RUN npm run build

# Production stage
FROM nginx:alpine

# Build çıktısını Nginx'in servis edeceği dizine kopyala
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx yapılandırmasını kopyala
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 80 portunu aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]