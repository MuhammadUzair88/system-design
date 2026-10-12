# we will run the command docker build -t test .
# than it will create an image through that image we will run the container
FROM node 

WORKDIR /app
# write the npm package.json etc commands above the index.js so that docker cache the files and they dont rerun after every build
# COPY package.json package.json
# COPY package-lock.json package-lock.json
COPY package*.json .

RUN npm install
# COPY index.js index.js
COPY . .

CMD [ "node","index.js" ]