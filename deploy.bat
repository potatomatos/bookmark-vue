@echo on
setlocal

:: 设置项目的基本信息
set REPO_URL=https://potatomatos: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@mirror.ghproxy.com/https://github.com/potatomatos/bookmark-vue.git
set PROJECT_DIR=bookmark-vue
set DOCKER_IMAGE_NAME=bookmark-vue
set DOCKER_CONTAINER_NAME=bookmark-vue

:: 检查项目目录是否存在，如果不存在则克隆，如果存在则更新
if not exist "%PROJECT_DIR%" (
    git clone %REPO_URL% %PROJECT_DIR%
    cd /d "%PROJECT_DIR%"
) else (
    cd /d "%PROJECT_DIR%"
    git pull
)

:: 构建
call yarn install
if %ERRORLEVEL% NEQ 0 (
    echo yarn install 失败，跳过构建...
    goto :eof
)

:: 执行yarn编译打包命令
call yarn build

call docker stop %DOCKER_CONTAINER_NAME%
call docker rm %DOCKER_CONTAINER_NAME%
call docker rmi %DOCKER_IMAGE_NAME%

:: 使用docker打包镜像
call docker build -t %DOCKER_IMAGE_NAME% .

:: 使用docker启动容器

call docker run -d -p 9003:80 --log-opt max-size=100m --log-opt max-file=3 --restart=always --name %DOCKER_CONTAINER_NAME% %DOCKER_IMAGE_NAME%

echo Build and Docker run completed successfully.
endlocal