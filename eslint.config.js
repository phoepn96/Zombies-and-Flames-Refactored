import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import parser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname
});

export default [
  js.configs.recommended,
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'function', next: 'function' }
      ],
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }]
    }
  },
  prettier
];