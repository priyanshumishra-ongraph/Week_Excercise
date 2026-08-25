const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const envConfigFile = `export const environment = {
  production: ${process.env.NODE_ENV === 'production'},
  apiUrl: '${process.env.API_URL || 'http://localhost:3000/api'}'
};
`;

if (!fs.existsSync('./src/environments')) {
  fs.mkdirSync('./src/environments');
}

fs.writeFileSync('./src/environments/environment.ts', envConfigFile);
fs.writeFileSync('./src/environments/environment.development.ts', envConfigFile);
console.log('Environment files generated correctly from .env');
