FROM ubuntu:latest

# -- Layer: OS + Python 3.11

ARG shared_workspace=/opt/workspace

RUN apt-get clean add-apt-repository ppa:deadsnakes/ppa && apt-get update -y && \
    apt-get install -y python3.11 python3-pip curl wget git unzip procps openjdk-8-jdk && \
    ln -s /usr/bin/python3 /usr/bin/python && \
    rm -rf /var/lib/apt/lists/*

ENV SHARED_WORKSPACE=${shared_workspace}

# -- Runtime
# Prepare dirs
RUN mkdir -p /tmp/logs/ && chmod a+w /tmp/logs/ && mkdir /app && chmod a+rwx /app && mkdir /data && chmod a+rwx /data
ENV JAVA_HOME=/usr
ENV PATH=$SPARK_HOME:$PATH:/bin:$JAVA_HOME/bin:$JAVA_HOME/jre/bin
ENV PYTHONPATH=$SPARK_HOME/python:$PYTHONPATH
ENV SHARED_WORKSPACE=/opt/workspace
RUN mkdir -p ${SHARED_WORKSPACE}
VOLUME ${SHARED_WORKSPACE}

CMD ["bash"]