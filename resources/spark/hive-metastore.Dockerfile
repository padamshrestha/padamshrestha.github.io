# FROM python:3.10-buster

# ARG shared_workspace=/usr/workspace

# RUN mkdir -p /usr/share/man/man1

# RUN apt-get update && \
#       apt-get -y install libpq-dev python3-dev gcc \
#       wget procps tar less vim sudo gnupg gnupg2 gnupg1 software-properties-common iputils-ping

# RUN apt-add-repository 'deb http://security.debian.org/debian-security stretch/updates main'
# RUN apt-get update
# RUN apt -y install openjdk-8-jdk openjdk-8-jre

# RUN wget --quiet https://downloads.apache.org/hive/hive-3.1.3/apache-hive-3.1.3-bin.tar.gz
# RUN wget --quiet https://dlcdn.apache.org/hadoop/common/hadoop-3.3.1/hadoop-3.3.1.tar.gz

# RUN tar -xf apache-hive-3.1.3-bin.tar.gz -C /usr
# RUN tar -xf hadoop-3.3.1.tar.gz -C /usr
# RUN mv /usr/apache-hive-3.1.3-bin /usr/hive
# RUN mv /usr/hadoop-3.3.1 /usr/hadoop

# RUN mkdir -p /usr/hive/hcatalog/var/log
# RUN mkdir -p /tmp/hive
# RUN chmod 777 /tmp/hive

# EXPOSE 9083
# EXPOSE 10000
# EXPOSE 10001

# RUN pip install pyspark==3.3.1
# RUN pip install pandas
# RUN pip install ipython
# RUN pip install openpyxl
# RUN pip install faker
# RUN pip install delta-spark
# RUN pip install pynessie
# RUN pip install findspark

FROM cluster-base

ARG apache_hive_version=3.1.3

RUN apt-get update -y && \
    apt-get install -y curl vim && \
    wget https://downloads.apache.org/hive/hive-${apache_hive_version}/apache-hive-${apache_hive_version}-bin.tar.gz && \
    tar -xf apache-hive-${apache_hive_version}-bin.tar.gz -C /usr && \
    mv /usr/apache-hive-${apache_hive_version}-bin /usr/hive

RUN wget https://dlcdn.apache.org/hadoop/common/hadoop-3.3.1/hadoop-3.3.1.tar.gz && \
    tar -xf hadoop-3.3.1.tar.gz -C /usr && \
    mv /usr/hadoop-3.3.1 /usr/hadoop

RUN mkdir -p /usr/hive/hcatalog/var/log
RUN mkdir -p /tmp/hive
RUN chmod -R 777 /tmp/hive

# ENV HIVE_HOME=/usr/hive
# ENV PATH=$HIVE_HOME:$PATH
ENV PATH=/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/hive:/bin:/usr/bin

EXPOSE 9083
# EXPOSE 10000
# EXPOSE 10001

# WORKDIR ${SHARED_WORKSPACE}

# CMD ["/usr/hive/bin/schematool -dbType postgres -initSchema --verbose"]
CMD /usr/hive/bin/hive --service metastore --hiveconf hive.root.logger=INFO,console

