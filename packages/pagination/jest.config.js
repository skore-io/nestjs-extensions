/* eslint-disable @typescript-eslint/no-var-requires */
const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  displayName: '@skore-io/pagination',
  name: '@skore-io/pagination',
  transform: tsjPreset.transform,
  coverageDirectory: 'coverage',
  setupFiles: ['../../jest-setup.js'],
  testMatch: ['<rootDir>/test/*.test.ts'],
  testEnvironment: 'node',
  collectCoverage: true,
  forceExit: true,
  coverageReporters: ['lcovonly', 'text'],
  collectCoverageFrom: ['src/**/{!(index|pagination-result|pagination.ts),}.ts'],
}
