const OFF = 0
const WARN = 1
const ERROR = 2

module.exports = {
  env: {
    // 环境
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser', // 解析器，本解析器支持Ts
  parserOptions: {
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    // 插件
    'react',
    'unicorn',
    'promise',
    '@typescript-eslint',
    'prettier'
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.tsx', '.ts', '.js', '.json']
      },
      typescript: {}
    }
  },
  rules: {
    // 规则
  }
}
