FROM hub.littlediary.cn/arm32v7/nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html
