const { expect } = require('chai');
const { spy, assert, fake } = require('sinon');
const logger = require('../../../../../utils/logger');
const { EVENTS, WEBSOCKET_MESSAGE_TYPES } = require('../../../../../utils/constants');

const NetatmoManager = require('../../../../../services/netatmo/lib/index');
const gladys = {
  event: {
    emit: fake.returns(null),
  },
};
describe.only('netatmoManager updateThermostat', () => {
  const netatmoManager = new NetatmoManager(gladys, '/tmp/gladys', 'bdba9c11-8541-40a9-9c1d-82cd9402bcc3');
  it('should success update all features NATherm1 with change value', async () => {
    const device = {
      id: '10',
      type: 'NATherm1',
      features: [
        {
          selector: 'netatmo-10-temperature',
          last_value: 12,
        },
        {
          selector: 'netatmo-10-battery',
          last_value: 12,
        },
        {
          selector: 'netatmo-10-therm-setpoint-temperature',
          last_value: 12,
        },
        {
          selector: 'netatmo-10-therm-setpoint-mode',
          last_value: 1,
        },
        {
          selector: 'netatmo-10-heating-power-request',
          last_value: 0,
        },
      ],
    };
    netatmoManager.devices = {
      '10': {
        id: '10',
        type: 'NATherm1',
        battery_percent: '100',
        measured: {
          temperature: 10,
          setpoint_temp: 10,
        },
        setpoint: {
          setpoint_mode: 'program',
        },
        therm_relay_cmd: 100,
      },
    };
    await netatmoManager.updateThermostat('10', device, 'netatmo-10');
  });

  it('should get error on type NATherm1 - property temperature', async () => {
    const device = {
      id: '11',
      type: 'NATherm1'
    };
    netatmoManager.devices = {
      '11': {
        id: '11',
        type: 'NATherm1',
        setpoint: {
          setpoint_mode: 'program',
        }
      },
    };
    try {
      await netatmoManager.updateThermostat('11', device, 'netatmo-10')
      assert.fail();
    } catch (error) {
      logger.info(error.message)
      expect(error.message).to.include("TypeError: Cannot read property 'temperature' of undefined");
    };
  });

  it('should get error on type NRV - property temperature', async () => {
    const device = {
      id: '11',
      type: 'NRV'
    };
    netatmoManager.devices = {
      '11': {
        id: '11',
        type: 'NRV',
        setpoint: {
          setpoint_mode: 'program',
        },
        therm_relay_cmd: 100,
      },
    };
    try {
      await netatmoManager.updateThermostat('11', device, 'netatmo-11')
      assert.fail();
    } catch (error) {
      logger.info(error.message)
      expect(error.message).to.include("TypeError: Cannot read property 'battery_state' of undefined");
    };
  });

  it('should success update all features NRV with change value', async () => {
    const device = {
      id: '15',
      type: 'NRV',
      features: [
        {
          selector: 'netatmo-12-temperature',
          last_value: 12,
        },
        {
          selector: 'netatmo-12-battery',
          last_value: 12,
        },
        {
          selector: 'netatmo-12-therm-setpoint-temperature',
          last_value: 12,
        },
        {
          selector: 'netatmo-12-therm-setpoint-mode',
          last_value: 1,
        },
        {
          selector: 'netatmo-12-heating-power-request',
          last_value: 0,
        },
        {
          selector: 'netatmo-12-reachable',
          last_value: false,
        },
      ],
    };
    netatmoManager.devices = {
      '15': {
        id: '15',
        type: 'NRV',
        homeStatus: {
          battery_state: 'very_low',
          reachable: true,
        },
        room: {
          therm_measured_temperature: 25,
          therm_setpoint_temperature: 25,
          therm_setpoint_mode: 'program',
          heating_power_request: 100,
        },
      },
    };
    await netatmoManager.updateThermostat('15', device, 'netatmo-12');
    assert.callCount(gladys.event.emit, 21);
  });

  it('should success update all features NRV without change value but only change date value', async () => {
    const device = {
      id: '10',
      type: 'NRV',
      features: [
        {
          selector: 'netatmo-10-temperature',
          last_value: 20.6,
        },
        {
          selector: 'netatmo-10-battery',
          last_value: 50,
        },
        {
          selector: 'netatmo-10-therm-setpoint-temperature',
          last_value: 20.0,
        },
        {
          selector: 'netatmo-10-therm-setpoint-mode',
          last_value: 4,
        },
        {
          selector: 'netatmo-10-heating-power-request',
          last_value: 36,
        },
        {
          selector: 'netatmo-10-reachable',
          last_value: 1,
        },
      ],
    };
    netatmoManager.devices = {
      '10': {
        id: '10',
        type: 'NRV',
        homeStatus: {
          battery_state: 'medium',
          reachable: 1,
        },
        room: {
          therm_measured_temperature: 20.6,
          therm_setpoint_temperature: 20.0,
          therm_setpoint_mode: 'program',
          heating_power_request: 36,
        },
      },
    };
    await netatmoManager.updateThermostat('10', device, 'netatmo-10');
    assert.calledWith(gladys.event.emit, EVENTS.WEBSOCKET.SEND_ALL, {
      type: WEBSOCKET_MESSAGE_TYPES.DEVICE.NEW_STATE_NO_CHANGED,
    });
  });

  it('should get error on type NRV', async () => {
    const device = {
      id: '10',
      type: 'NRV',
      features: [
        {
          selector: 'netatmo-10-temperature',
          last_value: 12,
        },
        {
          selector: 'netatmo-10-battery',
          last_value: 12,
        },
        {
          selector: 'netatmo-10-therm-setpoint-temperature',
          last_value: 12,
        },
        {
          selector: 'netatmo-10-therm-setpoint-mode',
          last_value: 1,
        },
        {
          selector: 'netatmo-10-heating-power-request',
          last_value: 0,
        },
        {
          selector: 'netatmo-10-reachable',
          last_value: false,
        },
      ],
    };
    netatmoManager.devices = {
      '10': {
        id: '10',
        type: 'NRV',
        setpoint: {
          setpoint_mode: 'program',
        },
        therm_relay_cmd: 100,
      },
    };
    await netatmoManager.updateThermostat('10', device, 'netatmo-10');
  });

  it('should say that there is no devices with specific key', async () => {
    const device = {
      id: '',
      type: '',
      features: [
        {
          selector: 'netatmo-10-temperature',
          last_value: 12,
        },
        {
          selector: 'netatmo-10-battery',
          last_value: 12,
        },
        {
          selector: 'netatmo-10-therm-setpoint-temperature',
          last_value: 12,
        },
        {
          selector: 'netatmo-10-therm-setpoint-mode',
          last_value: 1,
        },
        {
          selector: 'netatmo-10-heating-power-request',
          last_value: 0,
        },
        {
          selector: 'netatmo-10-reachable',
          last_value: false,
        },
      ],
    };
    await netatmoManager.updateThermostat('10', device, 'netatmo-10');
  });

  it('should error on each features (get device selector)', async () => {
    const device = {
      id: '10',
      type: 'NRV',
      features: [],
    };
    netatmoManager.devices = {
      '10': {
        id: '10',
        type: 'NRV',
        setpoint: {
          setpoint_mode: 'program',
        },
        therm_relay_cmd: 100,
      },
    };;
    
    try {
      await netatmoManager.updateThermostat('10', device, 'anything')
      assert.fail();
    } catch (error) {
      logger.info(error.message)
      expect(error.message).to.equal("NETATMO : File netatmo.updateThermostat.js - error : TypeError: Cannot read property 'type' of undefined");
    }
  });

  it('should failed on Cannot read property "type" of undefined', async () => {
    const device = {
      id: '10',
      type: 'NRV',
      features: [],
    };
    
    try {
      await netatmoManager.updateThermostat("",device, 'anything');
      assert.fail();
    } catch (error) {
      logger.info(error.message)
      expect(error.message).to.equal("NETATMO : File netatmo.updateThermostat.js - error : TypeError: Cannot read property 'type' of undefined");
    }
  });
});
