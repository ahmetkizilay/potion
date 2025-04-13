// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: [
    'eslint.config.mjs',
    'src/**/*.ts',
  ],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
  ],
  rules: {
    'quotes': ['error', 'single'],
    'import/no-unresolved': 0,
    'indent': ['error', 2],
    'object-curly-spacing': ['error', 'always'],
    'max-len': ['error', {
      code: 80,
      ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
      ignoreComments: true,
      ignoreUrls: true,
    }],
  },
});