const debug = require('debug')('job:loka_requests:devices');
const requestPromise = require('request-promise');

module.exports = async (token) => {
  const options = {
    method: 'POST',
    uri: 'https://loka-app.com/api/deviceList',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    json: true,
  };

  try {
    const response = await requestPromise(options);

    return response;
  } catch (error) {
    debug('Failed to get devices from loka api.');
    throw new Error('Failed to get devices from loka api.');
  }
};
