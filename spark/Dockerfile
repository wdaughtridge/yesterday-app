FROM ubuntu
WORKDIR /usr/src/app
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get -y install default-jre-headless curl unzip wget openssh-server python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    curl https://dlcdn.apache.org/spark/spark-3.4.0/spark-3.4.0-bin-hadoop3.tgz | tar xvzf - --strip-components=1 -C .
RUN ssh-keygen -b 2048 -t rsa -f ~/.ssh/id_rsa -q -N "" && \
    cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
ENTRYPOINT /etc/init.d/ssh start && ./sbin/start-all.sh && tail -f /dev/null