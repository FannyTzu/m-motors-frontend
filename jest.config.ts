import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx,js,jsx}",
    "!<rootDir>/src/**/*.d.ts",
    "!<rootDir>/src/**/__tests__/**",
    "!<rootDir>/src/**/?(*.)+(spec|test).{ts,tsx,js,jsx}",
    "!<rootDir>/src/**/__mocks__/**",
  ],
};

export default createJestConfig(customJestConfig);
