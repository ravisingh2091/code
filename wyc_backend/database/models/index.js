const fs = require('fs');
const path = require('path');
module.exports = (db, sequelize) => {
   const models = {};
   fs.readdirSync(__dirname).filter((file) => file !== 'index.js').forEach((file) => {
       const modelName = path.parse(file).name;
       const model = require(path.join(__dirname, file))(db, sequelize);
       models[modelName] = model;
   });
   return models;
};