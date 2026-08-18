/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext',
          moduleResolution: 'bundler'
        }
      }
    ]
  },
  testMatch: ['**/src/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['./src/__tests__/setup.ts'],
  forceExit: true,
  detectOpenHandles: true
};
