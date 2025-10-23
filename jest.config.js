export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-allure2-reporter/environment-node',
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
        target: 'ES2020',
        moduleResolution: 'node',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }],
  },
  testMatch: ['**/tests/**/*.test.ts'],
  reporters: ['default', ['jest-allure2-reporter', {resultsDir: './allure-results'}]],
  setupFilesAfterEnv:['jest-extended/all'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['src/**/*.ts'],
};