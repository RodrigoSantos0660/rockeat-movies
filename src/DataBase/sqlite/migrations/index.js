const sqliteConnection = require("../../sqlite");
const createusers = require("./createusers");

async function migrationsrun (){
  const schemas = [
    createusers
  ].join('');
  sqliteConnection()
  .then(db => db.exec(schemas))
  .catch(error => console.error(error));
}

module.exports = migrationsrun;