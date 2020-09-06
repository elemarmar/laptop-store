const fs = require('fs');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');

const latptopData = JSON.parse(json);
console.log(latptopData);
console.log(__dirname);
