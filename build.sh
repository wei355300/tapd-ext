#!/bin/sh

base_path=`pwd`

# 使用本地 docker 的环境
# eval $(minikube docker-env)

# 构建镜像
_build_docker_image() {

    echo "starting build docker image"

    # package java
    cd java
    mvn clean && mvn package -Dmaven.test.skip=true

    # dist web
    cd ${base_path}
    cd web
    npm run build


    # docker image
    cd ${base_path}
    #tag=`date "+%Y%m%d%H%M%S"`
    tag="latest"
    docker build -f docker/Dockerfile -t mantas/tapdext:${tag} .

    # docker image prune -a -f
    docker images|grep '<none>'|awk '{print $3}' | xargs docker rmi

    # return $tag

    echo "build image done!"
}

# 更新minikube 的服务
_update_service() {

    echo "updating minikube service"

    # _image_tag=$1

    # 通过 sed 更新 tapdext.yaml 里的版本号?
    minikube kubectl -- apply -f tapdext.yaml

    echo "update minikube service done!"
}

_build_docker_image

# _image_tag=$?

# echo "image_tag = $_image_tag";

_update_service

