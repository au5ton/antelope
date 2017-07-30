require('dotenv').config();
const fs = require('fs');
const GazelleAPI = require('gazelle-api');
const schedule = require('node-schedule');
const logger = require('au5ton-logger');

const gazelle = new GazelleAPI(process.env.APL_USERNAME, process.env.APL_PASSWORD, process.env.APL_HOSTNAME);

//0 */6 * * *

let do_stat_entry = () => {
    return new Promise((resolve, reject) => {
        gazelle.action('user', {
          id: process.env.APL_USERID
        }).then((response) => {
            if(response.body.status === 'success') {
                let user = response.body.response;
                logger.log(user.stats);
            }
            else {
                logger.error('Reponse failed.');
                reject(response);
            }
        });
    });
};

//adjust the frequency to whatever you want
let job = schedule.scheduleJob('0 */6 * * *', function(){
  do_stat_entry().then((stats) => {
      //log data to file
  }).catch((some_problem) => {
      //try again
  })
});

fs.appendFile('stats.json', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
