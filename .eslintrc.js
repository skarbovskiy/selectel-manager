module.exports = {
  parserOptions: {
    ecmaVersion: 6
  },
  rules: {
    'max-len': [2, {code: 120, tabWidth: 2}],
    indent: [2, 2, {SwitchCase: 1}],
    quotes: [2, 'single', {'allowTemplateLiterals': true, avoidEscape: true}],
    'linebreak-style': [2, 'unix'],
    semi: [2, 'always'],
    'no-unused-vars': [2, { 'vars': 'all', 'args': 'none' }],
    'no-trailing-spaces': [2],
    'comma-dangle': [2, 'never'],
    'no-multiple-empty-lines': [2, {max: 1, maxEOF: 1}],
    'no-extra-parens': [2, 'all']
  },
  env: {
    node: true
  },
  extends: 'eslint:recommended',
  plugins: [
    'require-path-exists'
  ]
};
