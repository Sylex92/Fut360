import js from '@eslint/js';
import ts from 'typescript-eslint';

export default ts.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '.cache/**', '.tooling/**'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['apps/**/*.{ts,tsx}', 'packages/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['**/packages/*/src/**'], message: 'Usa la API pública del paquete.' },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: ['react*', 'three*', 'node:*', '@fut360/*'] },
      ],
      'no-restricted-globals': [
        'error',
        'window',
        'document',
        'fetch',
        'performance',
        'localStorage',
        'indexedDB',
      ],
    },
  },
  {
    files: ['packages/exercise-catalog/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: ['react*', 'three*', 'node:*', '@fut360/coach-pwa'] },
      ],
      'no-restricted-globals': [
        'error',
        'window',
        'document',
        'fetch',
        'localStorage',
        'indexedDB',
      ],
    },
  },
  { files: ['tools/*.mjs'], languageOptions: { globals: { process: 'readonly' } } },
);
