/** @type {import('eslint').Linter.Config} */
export default {
  extends: ["@remix-run/eslint-config", "@remix-run/eslint-config/node"],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'hydrogen/prefer-image-component': 'off',
    'no-useless-escape': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    'no-case-declarations': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
