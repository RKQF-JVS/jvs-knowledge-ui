FROM nginx:1.15.4
VOLUME /tmp
ENV LANG en_US.UTF-8
COPY dist  /usr/share/nginx/html/
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
#这个地方一定要把之前的默认给替换掉，不然使用这个默认nginx的镜像会无法替换配置
COPY my.conf  /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 443
