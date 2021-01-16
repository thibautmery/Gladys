const axios = require('axios');
const logger = require('../../../../utils/logger');
/**
 * @description Get Healthy HomeCoachs.
 * @example
 * getHealthyHomeCoachData();
 */
async function getHealthyHomeCoachData() {
  // we get the les homeCoachs
  try {
    const response = await axios.get(`${this.baseUrl}/api/gethomecoachsdata?access_token=${this.token}`);
    response.data.body.devices.forEach((homecoach) => {
      this.newValueHomeCoach(homecoach); // , response.data.body.user);
    });
  } catch (err) {
    logger.info(`Error on gethomecoachsdata - ${err}`);
  }
}

module.exports = {
  getHealthyHomeCoachData,
};