module.exports = {
  rootDir: '.',
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  testEnvironment: 'node',
  restoreMocks: true,
  clearMocks: true,
  resetMocks: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  collectCoverageFrom: ['src/**/{!(security.module|index|rest.template),}.ts'],
  coverageReporters: ['json', 'lcovonly', 'text', 'clover'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
