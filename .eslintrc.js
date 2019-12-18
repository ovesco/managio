module.exports = {
  extends: ['airbnb-typescript/base'],
  parser: "@typescript-eslint/parser",
  plugins: ['@typescript-eslint'],
  settings: {
    'import/extensions': [".js",".jsx",".ts",".tsx"],
    'import/parsers': {
      '@typescript-eslint/parser': [".ts",".tsx"]
    },
    'import/resolver': {
      'node': {
        'extensions': [".js",".jsx",".ts",".tsx"]
      }
    }
  },
  rules: {
    "padded-blocks": "off",
    "import/no-cycle": "off",
    "linebreak-style": "off",
    "max-len": ["error", 140],
    "dot-notation": "off",
  }
};
