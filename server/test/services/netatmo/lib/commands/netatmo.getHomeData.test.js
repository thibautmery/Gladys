const nock = require('nock');
const { expect } = require('chai');
const { assert, fake } = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const jsonHomeData = require('../../data/getHomeData.json');

const NetatmoManager = proxyquire('../../../../../services/netatmo/lib/index', {});

const gladys = {
  event: {
    emit: fake.returns(null),
  },
};

describe('netatmoManager getHomeData success', () => {
  it('should get all devices of NOC and first NACamera and nothing on the 2nd NACamera', async () => {
    const netatmoManager = new NetatmoManager(gladys, 'bdba9c11-8541-40a9-9c1d-82cd9402bcc3');
    nock(`${netatmoManager.baseUrl}`)
      .post('/api/gethomedata')
      .reply(200, jsonHomeData);
    await netatmoManager.getHomeData();
    const sensors = await netatmoManager.getSensors();

    sensors.forEach((sensorDevice) => {
      expect(sensorDevice).to.have.property('name');
      expect(sensorDevice).to.have.property('selector');
      expect(sensorDevice).to.have.property('external_id');
      expect(sensorDevice).to.have.property('features');
      sensorDevice.features.forEach((sensorFeature) => {
        expect(sensorFeature).to.have.property('name');
        expect(sensorFeature).to.have.property('selector');
      });
      if (sensorDevice.model === 'netatmo-NACamera' || sensorDevice.model === 'netatmo-NOC') {
        sensorDevice.params.forEach((sensorParam) => {
          expect(sensorParam).to.have.property('name');
          expect(sensorParam.name).to.deep.equal(`CAMERA_URL - ${sensorDevice.name}`);
          expect(sensorParam).to.have.property('value');
        });
        expect(sensorDevice.cameraUrl).to.have.property('name');
        expect(sensorDevice.cameraUrl.name).to.deep.equal(`CAMERA_URL - ${sensorDevice.name}`);
        expect(sensorDevice.cameraUrl).to.have.property('value');
      }
    });
  });
});

describe('netatmoManager getHomeData with errors', () => {
  it('should get NACamera but with module unknown', async () => {
    const netatmoManager = new NetatmoManager(gladys, 'bdba9c11-8541-40a9-9c1d-82cd9402bcc3');
    const jsonDevice = {
      body: {
        homes: [
          {
            cameras: [
              {
                id: '19:cc:50:67:aa:00',
                type: 'NACamera',
                status: 'on',
                vpn_url: 'https://test.com',
                is_local: true,
                sd_status: 'on',
                alim_status: 'on',
                name: 'Caméra n°3 Salle Maison',
                use_pin_code: true,
                last_setup: 1605543861,
                modules: [
                  {
                    id: '18:cc:50:67:aa:01',
                    type: 'NewNADetector',
                    name: 'Test',
                    battery_percent: 98,
                    room: '2812958323',
                    rf: 85,
                    status: 'no_news',
                    last_activity: 1608752718,
                  },
                ],
              },
            ],
          },
        ],
      },
    };
    nock(`${netatmoManager.baseUrl}`)
      .post('/api/gethomedata')
      .reply(200, jsonDevice);
    await netatmoManager.getHomeData();
    assert.called(gladys.event.emit);
    const sensors = await netatmoManager.getSensors();

    sensors.forEach((sensorDevice) => {
      expect(sensorDevice).to.have.property('name');
      expect(sensorDevice).to.have.property('selector');
      expect(sensorDevice).to.have.property('external_id');
      expect(sensorDevice).to.have.property('features');
      sensorDevice.features.forEach((sensorFeature) => {
        expect(sensorFeature).to.have.property('name');
        expect(sensorFeature).to.have.property('selector');
      });
      if (sensorDevice.model === 'netatmo-NACamera') {
        sensorDevice.params.forEach((sensorParam) => {
          expect(sensorParam).to.have.property('name');
          expect(sensorParam.name).to.deep.equal(`CAMERA_URL - ${sensorDevice.name}`);
          expect(sensorParam).to.have.property('value');
        });
        expect(sensorDevice.cameraUrl).to.have.property('name');
        expect(sensorDevice.cameraUrl.name).to.deep.equal(`CAMERA_URL - ${sensorDevice.name}`);
        expect(sensorDevice.cameraUrl).to.have.property('value');
      }
    });
  });

  it('should get NACamera without module', async () => {
    const netatmoManager = new NetatmoManager(gladys, 'bdba9c11-8541-40a9-9c1d-82cd9402bcc3');
    const jsonDevice = {
      body: {
        homes: [
          {
            cameras: [
              {
                id: '18:cc:50:67:aa:00',
                type: 'NACamera',
                status: 'on',
                vpn_url: 'https://test.com',
                is_local: true,
                sd_status: 'on',
                alim_status: 'on',
                name: 'Caméra n°2 Salle Maison',
                use_pin_code: true,
                last_setup: 1605543861,
              },
            ],
          },
        ],
      },
    };
    nock(`${netatmoManager.baseUrl}`)
      .post('/api/gethomedata')
      .reply(200, jsonDevice);
    await netatmoManager.getHomeData();
    assert.called(gladys.event.emit);
    const sensors = await netatmoManager.getSensors();

    sensors.forEach((sensorDevice) => {
      expect(sensorDevice).to.have.property('name');
      expect(sensorDevice).to.have.property('selector');
      expect(sensorDevice).to.have.property('external_id');
      expect(sensorDevice).to.have.property('features');
      sensorDevice.features.forEach((sensorFeature) => {
        expect(sensorFeature).to.have.property('name');
        expect(sensorFeature).to.have.property('selector');
      });
      sensorDevice.params.forEach((sensorParam) => {
        expect(sensorParam).to.have.property('name');
        expect(sensorParam.name).to.deep.equal(`CAMERA_URL - ${sensorDevice.name}`);
        expect(sensorParam).to.have.property('value');
      });
      expect(sensorDevice.cameraUrl).to.have.property('name');
      expect(sensorDevice.cameraUrl.name).to.deep.equal(`CAMERA_URL - ${sensorDevice.name}`);
      expect(sensorDevice.cameraUrl).to.have.property('value');
    });
  });

  it('should get error on device unknown', async () => {
    const netatmoManager = new NetatmoManager(gladys, 'bdba9c11-8541-40a9-9c1d-82cd9402bcc3');
    const jsonDevice = {
      body: {
        homes: [
          {
            cameras: [
              {
                id: '17:cc:50:67:aa:06',
                type: 'NDB',
                status: 'disconnected',
                websocket_connected: false,
                sd_status: 'on',
                alim_status: 'on',
                name: 'Sonnette Vidéo Intelligente',
                last_setup: 1608051497,
                quick_display_zone: 50,
                max_peers_reached: false,
              },
            ],
          },
        ],
      },
    };
    nock(`${netatmoManager.baseUrl}`)
      .post('/api/gethomedata')
      .reply(200, jsonDevice);
    await netatmoManager.getHomeData();
    assert.called(gladys.event.emit);
    const sensors = await netatmoManager.getSensors();
    expect(sensors).to.deep.equal([]);
  });

  it('should return nothing devices', async () => {
    const netatmoManager = new NetatmoManager(gladys, 'bdba9c11-8541-40a9-9c1d-82cd9402bcc3');
    const jsonDeviceNothing = {
      body: {},
    };
    nock(`${netatmoManager.baseUrl}`)
      .post(`/api/gethomedata`)
      .reply(200, jsonDeviceNothing);
    await netatmoManager.getHomeData();
    assert.called(gladys.event.emit);
    const sensors = await netatmoManager.getSensors();
    expect(sensors).to.deep.equal([]);
  });

  it('should failed getHomeData', async () => {
    const netatmoManager = new NetatmoManager(gladys, 'bdba9c11-8541-40a9-9c1d-82cd9402bcc3');
    nock(`${netatmoManager.baseUrl}`)
      .post('/api/gethomedata')
      .reply(400, { data: { body: 'Problem' } });
    await netatmoManager.getHomeData();
  });
});
