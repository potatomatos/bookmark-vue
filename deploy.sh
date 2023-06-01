echo "开始打包项目..."
git pull
node -v
npm -v
yarn -v
yarn install
yarn build
echo "开始构建镜像..."
echo "停止容器"
sudo docker stop bookmark-vue || true
echo "删除容器"
sudo docker rm bookmark-vue || true
echo "删除镜像"
sudo docker rmi bookmark-vue || true
echo "打包镜像"
sudo docker build -t bookmark-vue .
echo "镜像打包成功！开始运行容器"
sudo docker run -d -p 8003:80 --name bookmark-vue bookmark-vue
echo "容器已启动！"