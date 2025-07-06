/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
    ecmaVersion: "latest",
    sourceType: "module",
  },
  ignorePatterns: [".eslintrc.js"],
  plugins: ["@typescript-eslint", "prettier'"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  rules: {
    // Отключаем стандартное правило ESLint (работает только с JS)
    "no-unused-vars": "off",

    // Запрещаем неиспользуемые переменные
    "@typescript-eslint/no-unused-vars": ["error", { args: "all", argsIgnorePattern: "^_" }],

    // Запрещаем неиспользуемые переменные в блоках (даже если они внутри if/else)
    "no-inner-declarations": ["error", "both"],

    // Требуем использование `const`, если переменная не переопределяется
    "prefer-const": "error",

    // запрет на `any`
    "@typescript-eslint/no-explicit-any": "error",

    // предупреждениe если не указан тип данных который возвращает функция
    "@typescript-eslint/explicit-function-return-type": ["warn"],

    // ошибка, если забыли `await` перед вызовом промиса
    "@typescript-eslint/require-await": "error",

    // Запрещаем лишние `return await`
    "@typescript-eslint/return-await": ["error", "in-try-catch"],

    // Разрешить использовать ts-ignore, но с комментарием
    "@typescript-eslint/ban-ts-comment": ["warn", { "ts-ignore": "allow-with-description" }],

    // Строгий режим Prettier
    "prettier/prettier": "error",
  },
};
