# FROM eclipse-temurin:17.0.4.1_1-jre-focal
FROM eclipse-temurin:17-jdk AS builder

# adding node & yarn latest version repos
RUN apt-get update 
RUN apt-get install curl gnupg2 -y
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install nodejs -y
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install yarn -y

RUN apt-get update
# node-sass uses node-gyp
# https://www.npmjs.com/package/node-gyp require you to do it:
# On Unix
# Python v3.7, v3.8, v3.9, or v3.10
# make
# A proper C/C++ compiler toolchain, like GCC, g++
RUN apt-get install gcc g++ make python3.10 -y

RUN apt-get install make maven git -y
RUN npm install -g lerna

COPY . /cloudbeaver
RUN git clone --depth 1 https://github.com/dbeaver/dbeaver.git /dbeaver
# can also manualy copy the git repo to there
# COPY dbeaver /dbeaver
RUN cd /cloudbeaver/deploy && ./build.sh

FROM eclipse-temurin:17.0.4.1_1-jre-focal

COPY --from=builder cloudbeaver/deploy/cloudbeaver /opt/cloudbeaver

EXPOSE 8978

WORKDIR /opt/cloudbeaver/
ENTRYPOINT ["./run-server.sh"]
