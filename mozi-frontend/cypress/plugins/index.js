// const browserify = require('@cypress/browserify-preprocessor');
const cucumber = require('@badeball/cypress-cucumber-preprocessor').default;

module.exports = (on, config) => {
//   const options = {
//     ...browserify.defaultOptions,
//     typescript: require.resolve('typescript'),
//   };

  on('file:preprocessor', cucumber());

};