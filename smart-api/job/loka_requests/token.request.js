const debug = require('debug')('job:common:token');
const requestPromise = require('request-promise');
const constants = require('../../api/helpers/utils/constants');

// Request que recupera o token da API da LOKA
module.exports = async () => {
  const options = {
    method: 'POST',
    uri: 'https://loka-app.com/api/login',
    headers: {
      'content-type': 'application/json',
    },
    body: {
      username: constants.loka_api.username,
      password: constants.loka_api.password,
    },
    json: true,
  };

  try {
    const token = await requestPromise(options);
    const accessToken = token.access_token;

    return accessToken;
  } catch (error) {
    debug('Failed to get token from loka api.');
    throw new Error('Failed to get token from loka api.', error);
  }
};
