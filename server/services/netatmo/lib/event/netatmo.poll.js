const { EVENTS } = require('../../../../utils/constants');
const { NETATMO_VALUES } = require('../constants');

/**
 * @description Poll value of a Netatmo devices
 * @param {Object} device - The device to control.
 * @example
 * poll(device);
 */
async function poll(device) {
  const axios = require('axios');
  const info = device.external_id.split('netatmo:');
  const sid = info[1];
  this.getDevices();
  if (this.devices[sid].type === 'NRV'){
    RoomID = device.external_id.split('-')[device.external_id.split('-').length];

  }

  // on traite les données des cameras
  if (this.devices[sid].type === 'NACamera' || this.devices[sid].type === 'NOC') {
<<<<<<< HEAD
    axios.get(`${'begel'}`, {responseType: 'arraybuffer'}).then(response => {
      const b64encoded = btoa([].reduce.call(new Uint8Array(response.data), function(p, c){return p+String.fromCharCode(c)}, ''));
      const mimetype="image/jpeg";
      const base64image = "data:"+mimetype+";base64,"+b64encoded;
      this.gladys.device.camera.setImage(device.selector, base64image);
    }); //live/snapshot_720.jpg`
=======
    axios.get(`${this.devices[sid].vpn_url}/live/snapshot_720.jpg`, {responseType: 'arraybuffer'}).then(response => {
      const sharp = require('sharp');
      sharp(response.data)
        .rotate()
        .resize(200)
        .toBuffer()
        .then( data => {
          const b64encoded = btoa([].reduce.call(new Uint8Array(data), function(p, c){return p+String.fromCharCode(c)}, ''));
          const mimetype="image/jpeg";
          const base64image = "data:"+mimetype+";base64,"+b64encoded;
          this.gladys.device.camera.setImage(device.selector, base64image);
        })
    });
>>>>>>> 18ff3746bafe75ab1ffadcb102e0a0eedb66d3d8
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:power`,
      state: NETATMO_VALUES.SECURITY.LIGHT[this.devices[sid].alim_status.toUpperCase()]
    });
    if (this.devices[sid].type === 'NACamera') {
      this.devices[sid].modules.forEach((module) => {
        const sidModule = module.id;
        // on traite les données des sirènes intérieures
        if (this.devices[sidModule].type === 'NIS') {
          this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
            device_feature_external_id: `netatmo:${sidModule}:battery`,
            state: this.devices[sidModule].battery_percent,
          });
          this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
            device_feature_external_id: `netatmo:${sidModule}:siren`,
            state: NETATMO_VALUES.SECURITY.SIREN[this.devices[sidModule].status.toUpperCase()]
          });
        }
        // on traite les données des détecteurs d'ouverture de porte/fenêtre intérieures
        if (this.devices[sidModule].type === 'NACamDoorTag') {
          this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
            device_feature_external_id: `netatmo:${sidModule}:battery`,
            state: this.devices[sidModule].battery_percent,
          });
          this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
            device_feature_external_id: `netatmo:${sidModule}:doorTag`,
            state: NETATMO_VALUES.SECURITY.DOOR_TAG[this.devices[sidModule].status.toUpperCase()]
          });
        }
      });
    }
    if (this.devices[sid].type === 'NOC') {
      this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
        device_feature_external_id: `netatmo:${sid}:light`,
        state: NETATMO_VALUES.SECURITY.LIGHT[this.devices[sid].light_mode_status.toUpperCase()]
      });
      this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
        device_feature_external_id: `netatmo:${sid}:siren`,
        state: NETATMO_VALUES.SECURITY.SIREN[this.devices[sid].siren_status.toUpperCase()]
      });
    }
  }

  // on traite les données des thermostats
  if (this.devices[sid].type === 'NATherm1') {
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:battery`,
      state: this.devices[sid].battery_percent,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:temperature`,
      state: this.devices[sid].measured.temperature,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:setpoint`,
      state: this.devices[sid].measured.setpoint_temp,
    });
  }
  
  // on traite les données des home coach
  if (this.devices[sid].type === 'NHC') {
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:temperature`,
      state: this.devices[sid].dashboard_data.Temperature,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:humidity`,
      state: this.devices[sid].dashboard_data.Humidity,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:co2`,
      state: this.devices[sid].dashboard_data.CO2,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:pressure`,
      state: this.devices[sid].dashboard_data.Pressure,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:absolutePressure`,
      state: this.devices[sid].dashboard_data.AbsolutePressure,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:noise`,
      state: this.devices[sid].dashboard_data.Noise,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:health_idx`,
      state: this.devices[sid].dashboard_data.health_idx,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:reachable`,
      state: this.devices[sid].reachable,
    });
  }
  // on traite les données des stations météo
  if (this.devices[sid].type === 'NAMain') {
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:temperature`,
      state: this.devices[sid].dashboard_data.Temperature,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:humidity`,
      state: this.devices[sid].dashboard_data.Humidity,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:co2`,
      state: this.devices[sid].dashboard_data.CO2,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:pressure`,
      state: this.devices[sid].dashboard_data.Pressure,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:absolutePressure`,
      state: this.devices[sid].dashboard_data.AbsolutePressure,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:noise`,
      state: this.devices[sid].dashboard_data.Noise,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:min_temp`,
      state: this.devices[sid].dashboard_data.min_temp,
    });
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `netatmo:${sid}:max_temp`,
      state: this.devices[sid].dashboard_data.max_temp,
    });
    /* eslint-disable no-restricted-syntax */
    let sidModule;
    for (const module of this.devices[sid].modules) {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
      sidModule = module._id;
      // on traite les données des pluviomètres
      if (module.data_type[0] === 'Rain') {
        this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
          device_feature_external_id: `netatmo:${sidModule}:rain`,
          state: this.devices[sidModule].dashboard_data.Rain,
        });
        this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
          device_feature_external_id: `netatmo:${sidModule}:sum_rain_1`,
          state: this.devices[sidModule].dashboard_data.sum_rain_1,
        });
        this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
          device_feature_external_id: `netatmo:${sidModule}:sum_rain_24`,
          state: this.devices[sidModule].dashboard_data.sum_rain_24,
        });
        this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
          device_feature_external_id: `netatmo:${sidModule}:battery`,
          state: this.devices[sidModule].battery_percent,
        });
      }
      // on traite les données des anémomètres
      if (module.data_type[0] === 'Wind') {
        this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
          device_feature_external_id: `netatmo:${sidModule}:WindStrength`,
          state: this.devices[sidModule].dashboard_data.WindStrength,
        });
        this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
          device_feature_external_id: `netatmo:${sidModule}:WindAngle`,
          state: this.devices[sidModule].dashboard_data.WindAngle,
        });
        this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
          device_feature_external_id: `netatmo:${sidModule}:GustStrength`,
          state: this.devices[sidModule].dashboard_data.GustStrength,
        });
        this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
          device_feature_external_id: `netatmo:${sidModule}:WindAngle`,
          state: this.devices[sidModule].dashboard_data.GustAngle,
        });
        this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
          device_feature_external_id: `netatmo:${sidModule}:max_wind_str`,
          state: this.devices[sidModule].dashboard_data.max_wind_str,
        });
        this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
          device_feature_external_id: `netatmo:${sidModule}:max_wind_angle`,
          state: this.devices[sidModule].dashboard_data.max_wind_angle,
        });
        this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
          device_feature_external_id: `netatmo:${sidModule}:battery`,
          state: this.devices[sidModule].battery_percent,
        });
      }
      if (module.data_type[0] !== 'Rain' && module.data_type[0] !== 'Wind') {
        // on traite les données des hygromètres extérieurs
        if (module.data_type.length === 2) {
          this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
            device_feature_external_id: `netatmo:${sidModule}:temperature`,
            state: this.devices[sidModule].dashboard_data.Temperature,
          });
          this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
            device_feature_external_id: `netatmo:${sidModule}:humidity`,
            state: this.devices[sidModule].dashboard_data.Humidity,
          });
          this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
            device_feature_external_id: `netatmo:${sidModule}:min_temp`,
            state: this.devices[sidModule].dashboard_data.min_temp,
          });
          this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
            device_feature_external_id: `netatmo:${sidModule}:max_temp`,
            state: this.devices[sidModule].dashboard_data.max_temp,
          });
          this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
            device_feature_external_id: `netatmo:${sidModule}:battery`,
            state: this.devices[sidModule].battery_percent,
          });
          // on traite les données des hygromètres intérieurs
        } else if (module.data_type.length === 3) {
          this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
            device_feature_external_id: `netatmo:${sidModule}:temperature`,
            state: this.devices[sidModule].dashboard_data.Temperature,
          });
          this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
            device_feature_external_id: `netatmo:${sidModule}:humidity`,
            state: this.devices[sidModule].dashboard_data.Humidity,
          });
          this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
            device_feature_external_id: `netatmo:${sidModule}:co2`,
            state: this.devices[sidModule].dashboard_data.CO2,
          });
          this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
            device_feature_external_id: `netatmo:${sidModule}:min_temp`,
            state: this.devices[sidModule].dashboard_data.min_temp,
          });
          this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
            device_feature_external_id: `netatmo:${sidModule}:max_temp`,
            state: this.devices[sidModule].dashboard_data.max_temp,
          });
          this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
            device_feature_external_id: `netatmo:${sidModule}:battery`,
            state: this.devices[sidModule].battery_percent,
          });
        }
      }
    }
  }
}

module.exports = {
  poll,
};
