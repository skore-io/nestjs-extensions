/* eslint-disable @typescript-eslint/no-var-requires */
const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  displayName: '@skore-io/keycloak',
  name: '@skore-io/keycloak',
  transform: tsjPreset.transform,
  coverageDirectory: 'coverage',
  setupFiles: ['../../jest-setup.js'],
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  testEnvironment: 'node',
  collectCoverage: true,
  forceExit: true,
  coverageReporters: ['lcovonly', 'text'],
  collectCoverageFrom: ['src/**/{!(keycloak.module|index),}.ts'],
  testTimeout: 10000,
}
