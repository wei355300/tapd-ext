FROM registry.cn-hangzhou.aliyuncs.com/petkit-saas/all-in-one:latest

MAINTAINER "mantas.cn" <mantas.cn>

#
# JAVA
#

ARG JAR_BASE_DIR=/proj/server/
ARG JAR_PATH=java/target/tapd.jar

COPY ${JAR_PATH} ${JAR_BASE_DIR}/

#
# WEB
#

# 镜像中存放的文件路径
ARG WEB_BASE_DIR=/proj/web
ARG WEB_PATH=web/dist

# nginx的项目配置文件路径
ARG NGINX_DIR_CONF=/etc/nginx/conf.d

RUN mkdir -p ${WEB_BASE_DIR} && \
    rm -f ${NGINX_DIR_CONF}/default.conf && \
    mkdir -p ${WEB_BASE_DIR}

COPY ${WEB_PATH} ${WEB_BASE_DIR}/dist/
COPY docker/nginx_svc.conf ${NGINX_DIR_CONF}


#
# ENTRYPOINT
#

COPY docker/entrypoint.sh /start.sh

RUN chmod a+x /start.sh

ENTRYPOINT ["/start.sh"]
