FROM ubuntu

RUN apt-get update && apt-get -y upgrade && \
  apt-get -y install git openssl wget curl gnupg gcc g++ make
# vim mc

RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add - && \
  echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list && \
  curl -sL https://deb.nodesource.com/setup_14.x | bash -

RUN apt-get update && \
  apt-get -y install postgresql-client mongodb-org-shell nodejs
