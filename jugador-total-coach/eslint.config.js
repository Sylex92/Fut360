import js from '@eslint/js';
import ts from 'typescript-eslint';

export default ts.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '.cache/**', '.tooling/**'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['apps/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
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
  {
    files: ['tools/*.mjs'],
    languageOptions: { globals: { process: 'readonly', console: 'readonly' } },
  },
  {
    files: ['packages/viewer-3d/**/*.{ts,tsx}'],
    ignores: ['packages/viewer-3d/**/*.test.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@fut360/session-engine',
            '@fut360/coach-pwa',
            '@fut360/exercise-catalog',
            'node:*',
          ],
        },
      ],
    },
  },
  {
    files: ['packages/session-engine/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            'react*',
            'three*',
            'node:*',
            '@fut360/coach-pwa',
            '@fut360/exercise-catalog',
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        'window',
        'document',
        'fetch',
        'performance',
        'Date',
        'localStorage',
        'indexedDB',
        'setTimeout',
        'setInterval',
      ],
    },
  },
);
