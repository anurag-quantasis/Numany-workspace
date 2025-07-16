// module.exports = {
//   projects: [
//     '<rootDir>/projects/main-numany/jest.config.js',
//     '<rootDir>/projects/tenant-numany/jest.config.js',
//     '<rootDir>/projects/shared-ui/jest.config.js'
//   ]
// };

module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'], // A single setup file at the root
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/'
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json', // Points to the root tsconfig.spec.json
      stringifyContentPathRegex: '\\.html$',
    },
  },
};