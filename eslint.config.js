import js from '@eslint/js'
import globals from 'globals'
import pluginCypress from 'eslint-plugin-cypress'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import stylistic from '@stylistic/eslint-plugin'

export default [
    { ignores: ['dist'] },
    {
        files: ['cypress/**/*.js'],
        ...pluginCypress.configs.globals,
    },
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        settings: { react: { version: '18.3' } },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            '@stylistic': stylistic,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            'react/jsx-no-target-blank': 'off',
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'curly': 'error',
            'eqeqeq': 'error',
            'no-eq-null': 'error',
            'no-var': 'error',
            'no-unassigned-vars': 'error',
            'prefer-const': 'error',
            'yoda': 'error',
            '@stylistic/arrow-spacing': [
                'error', { 'before': true, 'after': true },
            ],
            '@stylistic/brace-style': ['error', 'stroustrup', {}],
            '@stylistic/comma-dangle': ['error', {
                'arrays': 'only-multiline',
                'objects': 'only-multiline',
                'imports': 'never',
                'exports': 'never',
                'functions': 'never',
                'importAttributes': 'never',
                'dynamicImports': 'never',
                'enums': 'only-multiline',
                'generics': 'never',
                'tuples': 'never',
            }],
            '@stylistic/comma-style': ['error', 'last'],
            '@stylistic/indent': [
                'error',
                4,
                { 'SwitchCase': 1 },
            ],
            '@stylistic/linebreak-style': [
                'error',
                'unix',
            ],
            '@stylistic/no-tabs': 'error',
            '@stylistic/no-trailing-spaces': 'error',
            '@stylistic/object-curly-spacing': [
                'error', 'always',
            ],
            '@stylistic/quotes': [
                'error',
                'single',
                { 'avoidEscape': true }
            ],
            '@stylistic/semi': [
                'error',
                'never',
            ],
            'react/prop-types': 0,
            'react/react-in-jsx-scope': 0,
        },
    },
]
