import { defineConfig } from 'orval';
import { transformPokeApiOpenApi } from './scripts/transform-pokeapi-openapi.mjs';

const pokeApiOpenApiUrl =
  'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/openapi.yml';

export default defineConfig({
  pokeapi: {
    input: {
      target: pokeApiOpenApiUrl,
      override: {
        transformer: transformPokeApiOpenApi,
      },
    },
    output: {
      mode: 'single',
      target: './src/api/pokeapi/generated/client.ts',
      schemas: {
        path: './src/api/pokeapi/generated/schema',
        type: 'zod',
      },
      client: 'axios',
      httpClient: 'axios',
      clean: true,
      prettier: true,
      override: {
        zod: {
          generate: {
            param: true,
            query: true,
            header: true,
            body: true,
            response: true,
          },
        },
      },
    },
  },
});
