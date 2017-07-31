require('dotenv').config();
const fs = require('fs');
const GazelleAPI = require('gazelle-api');
const schedule = require('node-schedule');
const logger = require('au5ton-logger');

const gazelle = new GazelleAPI(process.env.APL_USERNAME, process.env.APL_PASSWORD, process.env.APL_HOSTNAME);

//0 */6 * * *

let do_stat_entry = (USER_ID) => {
    return new Promise((resolve, reject) => {
        gazelle.action('user', {
          id: USER_ID
        }).then((response) => {
            if(response.body.status === 'success') {
                let user = response.body.response;
            }
            else {
                logger.error('Reponse failed.');
                reject(response);
            }
        }).catch((err) => {
            reject(err);
        });
    });
};

//adjust the frequency to whatever you want
let job = schedule.scheduleJob('0 */6 * * *', () => {
    do_stat_entry().then((user) => {
        //add row to SQL
    }).catch((some_problem) => {
        //try again
        the_job();
    })
});






logger.log('APL-Stats');
logger.log('=========\n');
logger.log('Performing startup checks...');
logger.ind().log('Necessary environment variables present?');
let flag = false;
if(process.env.APL_USERNAME === undefined) {
    logger.ind().error('APL_USERNAME not defined');
    flag = true;
}
if(process.env.APL_PASSWORD === undefined) {
    logger.ind().error('APL_PASSWORD not defined');
    flag = true;
}
if(process.env.APL_HOSTNAME === undefined) {
    logger.ind().error('APL_HOSTNAME not defined');
    flag = true;
}
if(process.env.APL_USERS === undefined) {
    logger.ind().error('APL_USERS not defined');
    flag = true;
}
if(flag) {
    logger.ind().error('Please fix these errors. Edit your .env file.');
    process.exit();
}
else {
    logger.ind().success('Environment variables good.');
}
logger.ind().log('APL_USERS valid?');
let APL_USERS_ARRAY;
if(process.env.APL_USERS.includes('#')) {
    try {
        APL_USERS_ARRAY = JSON.parse(process.env.APL_USERS.split('#')[0]);
    }
    catch(err) {
        logger.ind().error('Failed to parse APL_USERS (contained #)');
        logger.ind().error('APL_USERS must be a JSON array of integers');
        process.exit();
    }
}
else {
    try {
        APL_USERS_ARRAY = JSON.parse(process.env.APL_USERS)
    }
    catch(err) {
        logger.ind().error('Failed to parse APL_USERS (without #)');
        logger.ind().error('APL_USERS must be a JSON array of integers');
        logger.ind().error('More info: ',err)
        process.exit();
    }
}
if(Array.isArray(APL_USERS_ARRAY)) {
    for(let i = APL_USERS_ARRAY.length-1; i >= 0; i--) {
        if(typeof APL_USERS_ARRAY[i] !== 'number') {
            logger.ind().warn('APL_USERS index ',i,' is not a number. Ignoring: ',APL_USERS_ARRAY[i]);
            APL_USERS_ARRAY.splice(i,1); //removes whatever is in index i
        }
    }
    if(APL_USERS_ARRAY.length === 0) {
        logger.ind().error('APL_USERS parsed as JSON, and is an Array, but every single index isn\'t a number.');
        logger.ind().error('what are you doing?')
        logger.ind().error('APL_USERS must be a JSON array of integers');
        process.exit()
    }
}
else {
    logger.ind().error('APL_USERS parsed as JSON, but is not an array.');
    logger.ind().error('APL_USERS must be a JSON array of integers');
    process.exit()
}
logger.ind().success('APL_USERS seems to be good.')
logger.ind().log('APL login credentials valid?');
gazelle.action('user', {
  id: 1 //this isn't a bad practice, right?
}).then((response) => {
    if(response.body.status === 'success') {
        logger.ind().success('reponse was a: ', response.body.status);
        logger.log('Best of luck.');
    }
    else {
        logger.error(response)
        logger.error('reponse was a: ', response.body.status);
        process.exit()
    }
}).catch((err) => {
    logger.ind().error('Problem checking APL credentials: ',err);
    process.exit()
});
