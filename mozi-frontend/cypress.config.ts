import { defineConfig } from "cypress";
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const browserify = require("@badeball/cypress-cucumber-preprocessor/browserify");

async function setupNodeEvents(on,config){
  await preprocessor.addCucumberPreprocessorPlugin(on,config)
  on("file:preprocessor",browserify.default(config))
  return config
}

module.exports = defineConfig({
  e2e:{
    baseUrl:"http://localhost:3000",
    specPattern:"cypress/e2e/**/*.feature",
    setupNodeEvents,
  }
})