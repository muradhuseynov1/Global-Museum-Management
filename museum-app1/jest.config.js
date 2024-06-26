import ResizeObserver from 'resize-observer-polyfill';
global.ResizeObserver = ResizeObserver;

module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^firebase$': '<rootDir>/src/__mocks__/firebase.js',
    '^react-leaflet$': '<rootDir>/__mocks__/react-leaflet.js',
    '^leaflet$': '<rootDir>/__mocks__/leaflet.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-leaflet|@react-leaflet|leaflet|react-datepicker)/)',
  ],
  verbose: true,
  transform: {
    "^.+\\.[tj]sx?$": "<rootDir>/babelTransform.js",
    "^.+\\.css$": "<rootDir>/cssTransform.js"
  },
};
