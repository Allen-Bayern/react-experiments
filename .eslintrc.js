const { resolve: pathResolve } = require('path');

module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:react/jsx-runtime',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
            jsx: true,
        },
        tsconfigRootDir: pathResolve(__dirname),
    },
    plugins: ['react', 'prettier'],
    rules: {
        'no-console': 0,
        indent: [2, 4],
        quotes: [2, 'single'],
        semi: [2, 'always'],
        'prettier/prettier': [2, {}, { usePrettierrc: true }],
        'react/no-deprecated': 0,
        'react/prop-types': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
    },
};
