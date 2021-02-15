const axios = require('axios');


const { NotFoundError } = require('../../../../utils/coreErrors');
const logger = require('../../../../utils/logger');

const { EVENTS } = require('../../../../utils/constants');
const { NETATMO_VALUES } = require('../constants');

/**
 * @description Change value of an eWeLink device.
 * @param {Object} device - The device to control.
 * @param {Object} deviceFeature - The binary deviceFeature to control.
 * @param {string|number} value - The new value.
 * @example
 * setValue(device, deviceFeature);
 */
async function setValue(device, deviceFeature, value) {

  console.log("coucou.setValue")
  console.log(this.connected)
  if (!this.connected) {
    throw new NotFoundError('Netatmo: Error, not connected');
  }
  let houseId;
  let roomId;
  console.log(device)
  const roomParam = device.params.find(param => param.name === 'House_Room_id_valve');
  console.log(roomParam)
  if (roomParam) {
    [houseId, roomId] = roomParam.value.split(':');
    // roomId = roomParam.value
  }

  console.log(houseId)
  console.log(roomId)

  const external_id = deviceFeature.external_id.split(':');
  console.log(deviceFeature.external_id)
  console.log(external_id)
  console.log(external_id.length)
  switch (device.model) {
    case 'netatmo-NRV':
      try {
          const options = {
            home_id: houseId,
            room_id: roomId,
            mode: 'manual',
            temp: value,
            access_token: this.token,
          };
          const requestHomeStatus = await axios.post(`${this.baseUrl}/api/setroomthermpoint`, options);
          if (requestHomeStatus.data.status === 'ok') {
            const setpointModeValue =
              NETATMO_VALUES.ENERGY.SETPOINT_MODE['MANUAL'];
            try {
              this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
                device_feature_external_id: `${device.external_id}:therm_setpoint_mode`,
                state: setpointModeValue,
              });
              this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
                device_feature_external_id: deviceFeature.external_id,
                state: value,
              });
            } catch (e) {
              logger.error(
                `Netatmo : File netatmo.updateThermostat.js - ${deviceFeature.type} ${deviceFeature.name} - therm setpoint temperature - error : ${e}`,
              );
              throw new NotFoundError(`${deviceFeature.type} ${deviceFeature.name} - therm setpoint temperature - error : ${e}`);
            }
          }
          console.log(requestHomeStatus.data.status === 'ok')
      } catch (err) {
        logger.info(`Error on getHomeStatusData - ${err}`);
      }
      break;
    default:
      logger.warn(`Netatmo: Warning, modele "${deviceFeature.model}" not handled yet!`);
      break;
  }

}

module.exports = {
  setValue,
};
