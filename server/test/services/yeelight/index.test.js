const { fake } = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const YeelightApi = require('./yeelight.mock.test');

const YeelightService = proxyquire('../../../services/yeelight/index', {
  'yeelight-awesome': YeelightApi,
});

const gladys = {
  device: { get: fake.resolves([]) },
  stateManager: { get: fake.resolves(undefined) },
};

describe('YeelightService', () => {
  const yeelightService = YeelightService(gladys, 'a810b8db-6d04-4697-bed3-c4b72c996279');

  it('should start service', async () => {
    await yeelightService.start();
  });
  it('should stop service', async () => {
    await yeelightService.stop();
  });
});
