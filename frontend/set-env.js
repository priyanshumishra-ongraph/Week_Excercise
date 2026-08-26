const fs = require('fs');
const dotenv = require('dotenv');

// Load .env for local development. In production the value comes from the
// platform's environment variables (e.g. API_URL in the Vercel dashboard).
dotenv.config();

// URL is sourced strictly from the environment. No hardcoded fallback:
// if API_URL is missing, fail the build loudly instead of shipping a broken bundle.
const apiUrl = process.env.API_URL;
if (!apiUrl) {
  console.error(
    '\n[set-env] ERROR: API_URL is not set.\n' +
    '  - Local dev: add API_URL to frontend/.env\n' +
    '  - Production: set API_URL in your Vercel Project Settings > Environment Variables\n'
  );
  process.exit(1);
}

const isProd =
  process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

const envConfigFile = `export const environment = {
  production: ${isProd},
  apiUrl: '${apiUrl}'
};
`;

if (!fs.existsSync('./src/environments')) {
  fs.mkdirSync('./src/environments');
}

fs.writeFileSync('./src/environments/environment.ts', envConfigFile);
fs.writeFileSync('./src/environments/environment.development.ts', envConfigFile);
console.log(`Environment files generated (production=${isProd}, apiUrl=${apiUrl})`);
