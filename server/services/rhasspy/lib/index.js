const { connect } = require('./commands/rhasspy.connect.js');
const { init } = require('./commands/rhasspy.init.js');
const { installRhasspyContainer } = require('./commands/rhasspy.installRhasspyContainer.js');

/**
 * @param {Object} gladys - The gladys object.
 * @param {string} serviceId - Identification of the service.
 * @description Create all device if not exist
 * @example
 * RhasspyManager(gladys, serviceId)
 */
const RhasspyManager = function RhasspyManager(gladys, serviceId) {
  this.gladys = gladys;
  this.serviceId = serviceId;
  this.sensors = {};
  this.devices = {};
  this.connected = false;
  this.rhasspyRunning = false;
  this.configured = false;
};

RhasspyManager.prototype.connect = connect;
RhasspyManager.prototype.init = init;
RhasspyManager.prototype.installRhasspyContainer = installRhasspyContainer;

module.exports = RhasspyManager;
