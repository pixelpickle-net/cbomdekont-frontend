# Build stage
FROM node:18-alpine as build

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
FROM nginx:stable-alpine

# Nginx yapılandırmasını kopyala
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build çıktısını Nginx'in servis edeceği dizine kopyala
COPY --from=build /app/dist /usr/share/nginx/html

# 80 portunu aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]