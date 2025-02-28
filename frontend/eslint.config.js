// @ts-check
const eslint = require('@eslint/js')
const tseslint = require('typescript-eslint')
const angular = require('angular-eslint')
const simpleImportSort = require('eslint-plugin-simple-import-sort')

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    ignores: ['src/environments/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      {
        plugins: {
          'simple-import-sort': simpleImportSort
        },
        rules: {
          'simple-import-sort/imports': [
            'error',
            {
              groups: [['^\\u0000'], ['^@?(?!baf)\\w'], ['^@baf?\\w'], ['^\\w'], ['^[^.]'], ['^\\.']]
            }
          ],
          'simple-import-sort/exports': 'error'
        }
      }
    ],
    processor: angular.processInlineTemplates,
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase'
        }
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case'
        }
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
          filter: {
            regex: '^(ts-jest|\\^.*)$',
            match: false
          }
        },
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow'
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow'
        },
        {
          selector: 'typeLike',
          format: ['PascalCase']
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE']
        },
        {
          selector: 'property',
          format: ['camelCase']
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase']
        }
      ],
      'no-new-wrappers': 'error',
      'no-throw-literal': 'error',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-invalid-this': 'off',
      '@typescript-eslint/no-invalid-this': ['warn']
    }
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility
    ],
    rules: {}
  }
)
