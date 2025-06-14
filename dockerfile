From node :20

Workdir /usr/src/app

Copy package*.json ./

Run npm install


Copy ..


Run npm  run build


CMD ["node", "dist/main"]