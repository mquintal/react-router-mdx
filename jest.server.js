export default {
  extensionsToTreatAsEsm: [".ts"],
  verbose: true,
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.server.json",
      },
    ],
  },
};
