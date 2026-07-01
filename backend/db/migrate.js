const { runMigrations } = require('./database');

runMigrations();
console.log('All migrations completed.');
