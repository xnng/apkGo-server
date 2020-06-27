FROM ubuntu:18.04

LABEL author="xnng <xnng77@gmail.com>"

SHELL ["/bin/bash", "-c"]

RUN cp /etc/apt/sources.list /etc/apt/sources.list.bak \
  && echo "deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse \
  deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse \
  deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse \
  deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse \
  deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse \
  deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse \
  deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse \
  deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse \
  deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse \
  deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse" > /etc/apt/sources.list \
  && apt update && apt upgrade -y \
  # 安装必要工具
  && apt install wget unzip -y \
  # 安装gradle
  && wget https://downloads.gradle-dn.com/distributions/gradle-5.4.1-bin.zip \
  && mkdir /opt/gradle \
  && unzip -d /opt/gradle gradle-5.4.1-bin.zip \
  && echo export PATH=$PATH:/opt/gradle/gradle-5.4.1/bin >> /etc/profile \
  && source /etc/profile \
  # 安装jdk
  && apt install openjdk-8-jdk -y \
  && echo export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64 >> /etc/profile \
  && source /etc/profile \
  # 安装android sdk
  && mkdir -p /androidsdk \
  && cd /androidsdk \
  && wget https://dl.google.com/android/repository/commandlinetools-linux-6514223_latest.zip \
  && unzip commandlinetools-linux-6514223_latest.zip \
  && echo export PATH=$PATH:/androidsdk/tools:/androidsdk/tools/bin >> /etc/profile \
  && echo export ANDROID_HOME=/androidsdk >> /etc/profile \
  && source /etc/profile \
  && yes | sdkmanager --sdk_root=${ANDROID_HOME} --licenses \
  && sdkmanager --sdk_root=${ANDROID_HOME} "platform-tools" "platforms;android-28"

# 安装nginx保持后台进程
RUN apt install -y nginx

EXPOSE 80

CMD ["nginx","-g","daemon off;"]