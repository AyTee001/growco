import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:3000/api-docs-json',
  output: 'src/app/client',
  plugins: [
    '@hey-api/typescript',
    '@hey-api/sdk',
    {
      name: '@hey-api/client-fetch',
    },
  ],
});