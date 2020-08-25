# Set the base image
FROM biz2credit/baseimage-node:release1.0

LABEL author="Madhur Tandon <madhur.tandon@biz2credit.com>"

# Install PM2
RUN npm install -g pm2

RUN mkdir -p /usr/src/app

# Define working directory
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN chmod 777 entrypoint.sh
RUN mv configuration .env
RUN npm install

RUN npm run build

# Run app
#CMD ["pm2", "start", "processes.json", "--no-daemon"]
CMD envconsul -once  -consul=${CONSUL_URL} -prefix=${PREFIX_DB} -prefix=${PREFIX_MAIN} -token=${CONSUL_TOKEN}  /usr/src/app/entrypoint.sh
# the --no-daemon is a minor workaround to prevent the docker container from thinking pm2 has stopped running and ending itself
