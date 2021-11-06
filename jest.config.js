/* eslint-disable @typescript-eslint/no-var-requires */
const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  rootDir: '.',
  projects: ['<rootDir>/jest.config.js'],
  transform: tsjPreset.transform,
  coverageDirectory: 'coverage',
  setupFiles: ['./jest-setup.js'],
  collectCoverageFrom: ['packages/*/src/**/{!(index|main),}.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  coverageReporters: ['lcovonly'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ['<rootDir>/packages/**/*.test.ts'],
  testResultsProcessor: 'jest-sonar-reporter',
  testEnvironment: 'node',
  collectCoverage: true,
  forceExit: true,
}
