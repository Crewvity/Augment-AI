module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ["custom", "next/core-web-vitals"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
}
