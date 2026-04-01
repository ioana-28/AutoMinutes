import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: require('eslint-plugin-prettier'),
    },
    extends: [
      js.configs.recommended, // JavaScript rules
      tsPlugin.configs.recommended, // TypeScript rules
      reactHooks.configs.recommended, // React Hooks rules
      reactRefresh.configs.vite, // Vite plugin rules
      'plugin:prettier/recommended', // Prettier integration
    ],
    rules: {
      // Example: allow unused variables if they start with _
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'prettier/prettier': ['warn'], // Show Prettier issues as warnings
    },
  },
]);
