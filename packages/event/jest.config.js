/* eslint-disable @typescript-eslint/no-var-requires */
const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  displayName: '@skore-io/event',
  name: '@skore-io/event',
  transform: tsjPreset.transform,
  coverageDirectory: 'coverage',
  setupFiles: ['../../jest-setup.js'],
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  testEnvironment: 'node',
  collectCoverage: true,
  forceExit: true,
  coverageReporters: ['lcovonly', 'text'],
  collectCoverageFrom: ['src/**/{!(index),}.ts'],
}
