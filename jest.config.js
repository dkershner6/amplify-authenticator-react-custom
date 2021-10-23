module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.stories.{ts,tsx}', '!src/**/*.d.{ts,tsx}'],
  testEnvironment: "jsdom",
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
};