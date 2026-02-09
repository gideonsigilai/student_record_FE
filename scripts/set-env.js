const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
const result = dotenv.config();

if (result.error) {
  console.log('No .env file found, using defaults');
} else {
  console.log('Loaded environment variables from .env');
}

const targetPath = path.resolve(__dirname, '../src/environments/environment.ts');
// We also update prod environment to ensure it has the values
// In a real setup, prod environment might be built differently (e.g. CI/CD)
// but for this verification, we update both to be safe or just the default one.
// Let's just update environment.ts which is used by default in `ng serve`

const envFileContent = `
export const environment = {
  production: false,
  apiUrl: '${process.env.API_BASE_URL || 'http://localhost:8080/api'}'
};
`;

const prodEnvFileContent = `
export const environment = {
  production: true,
  apiUrl: '${process.env.API_BASE_URL || 'http://localhost:8080/api'}'
};
`;

fs.writeFileSync(targetPath, envFileContent);
console.log(`Output generated at ${targetPath}`);

// Also update prod for `ng build`
const prodTargetPath = path.resolve(__dirname, '../src/environments/environment.prod.ts');
fs.writeFileSync(prodTargetPath, prodEnvFileContent);
console.log(`Output generated at ${prodTargetPath}`);
