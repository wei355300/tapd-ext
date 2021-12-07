#!/bin/sh

base_path=`pwd`

# 使用本地 docker 的环境
# eval $(minikube docker-env)

_image_tag=`date "+%Y%m%d%H%M%S"`
# _image_tag="latest"

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
    docker build -f docker/Dockerfile -t mantas/tapdext:${_image_tag} .

    echo "build image done!"
}

# 更新minikube 的服务
_update_service() {

    echo "updating minikube service"

    # _image_tag=$1

    # 通过 sed 更新 tapdext.yaml 里的版本号?
    `sed -i "" "s|image: mantas/tapdext:[0-9]*$|image: mantas/tapdext:$_image_tag|g" tapdext.yaml`
    minikube kubectl -- apply -f tapdext.yaml

    echo "update minikube service done!"
}

_remove_none_images() {
    # docker image prune -a -f
    docker images|grep '<none>'|awk '{print $3}' | xargs docker rmi
}

_build_docker_image

# _image_tag=$?

# echo "image_tag = $_image_tag";

_update_service

_remove_none_images