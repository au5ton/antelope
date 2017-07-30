require('dotenv').config();
const GazelleAPI = require('gazelle-api');

const gazelle = new GazelleAPI(process.env.APL_USERNAME, process.env.APL_PASSWORD, process.env.APL_HOSTNAME);

gazelle.action('user', {
  id: process.env.APL_USERID
}).then((response) => {
  console.log(response);
});
