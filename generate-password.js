const fs = require('fs');
const secret = require('./secret.json');
const encrypt = require('./src/crypto.js').encrypt;

const key = secret.username + ':' + secret.password;
const encrypted = encrypt(JSON.stringify(secret), key);

fs.writeFileSync('./.env', `REACT_APP_SECRET=${encrypted}`, 'utf-8');

console.log('Password generated!');
