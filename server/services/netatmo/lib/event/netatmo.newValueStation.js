const logger = require('../../../../utils/logger');
const {
  DEVICE_FEATURE_CATEGORIES,
  DEVICE_FEATURE_TYPES,
  DEVICE_FEATURE_UNITS,
} = require('../../../../utils/constants');

/**
 * @description New value stations received.
 * @param {Object} data - Data received.
 * @example
 * newValueStation(122324, {
 * });
 */
function newValueStation(data) {
  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  const sid = data._id;
  logger.debug(`Netatmo : New station, sid = ${sid}`);
  const unitTemperature = DEVICE_FEATURE_UNITS.CELSIUS;
  const minTemperatureIndoor = 0;
  const maxTemperatureIndoor = 50;
  const minTemperatureOutdoor = -40;
  const maxTemperatureOutdoor = 65;
  const unitWind = DEVICE_FEATURE_UNITS.KILOMETER_HOUR;
  const minWind = 0;
  const maxWind = 160;
  const unitRain = DEVICE_FEATURE_UNITS.MILLIMETER;
  const minRain = 0;
  const maxRain = 150;
  const unitRainFall = DEVICE_FEATURE_UNITS.MILLIMETER_HOUR;
  const minRainFall = 0;
  const maxRainFall = 150;
  const unitPressure = DEVICE_FEATURE_UNITS.MILLIBAR;
  const minPressure = 260;
  const maxPressure = 1260;

  const newSensor = {
    service_id: this.serviceId,
    name: data.station_name,
    selector: `netatmo:${sid}`,
    external_id: `netatmo:${sid}`,
    model: 'netatmo-station',
    should_poll: false,
    features: [
      {
        name: `Temperature - ${data.station_name}`,
        selector: `netatmo:${sid}:temperature`,
        external_id: `netatmo:${sid}:temperature`,
        category: DEVICE_FEATURE_CATEGORIES.TEMPERATURE_SENSOR,
        type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
        unit: unitTemperature,
        read_only: true,
        keep_history: true,
        has_feedback: true,
        min: minTemperatureIndoor,
        max: maxTemperatureIndoor,
      },
      {
        name: `Humidity - ${data.station_name}`,
        selector: `netatmo:${sid}:humidity`,
        external_id: `netatmo:${sid}:humidity`,
        category: DEVICE_FEATURE_CATEGORIES.HUMIDITY_SENSOR,
        type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
        unit: DEVICE_FEATURE_UNITS.PERCENT,
        read_only: true,
        keep_history: true,
        has_feedback: true,
        min: 0,
        max: 100,
      },
      {
        name: `CO2 - ${data.station_name}`,
        selector: `netatmo:${sid}:co2`,
        external_id: `netatmo:${sid}:co2`,
        category: DEVICE_FEATURE_CATEGORIES.CO2_SENSOR,
        type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
        unit: DEVICE_FEATURE_UNITS.PPM,
        read_only: true,
        keep_history: true,
        has_feedback: true,
        min: 0,
        max: 5000,
      },
      {
        name: `Pressure - ${data.station_name}`,
        selector: `netatmo:${sid}:pressure`,
        external_id: `netatmo:${sid}:pressure`,
        category: DEVICE_FEATURE_CATEGORIES.PRESSURE_SENSOR,
        type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
        unit: unitPressure,
        read_only: true,
        keep_history: true,
        has_feedback: true,
        min: minPressure,
        max: maxPressure,
      },
      {
        name: `Pressure absolue - ${data.station_name}`,
        selector: `netatmo:${sid}:absolutePressure`,
        external_id: `netatmo:${sid}:absolutePressure`,
        category: DEVICE_FEATURE_CATEGORIES.PRESSURE_SENSOR,
        type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
        unit: unitPressure,
        read_only: true,
        keep_history: true,
        has_feedback: true,
        min: minPressure,
        max: maxPressure,
      },
      {
        name: `Noise - ${data.station_name}`,
        selector: `netatmo:${sid}:noise`,
        external_id: `netatmo:${sid}:noise`,
        category: DEVICE_FEATURE_CATEGORIES.NOISE_SENSOR,
        type: DEVICE_FEATURE_TYPES.SENSOR.INTEGER,
        unit: DEVICE_FEATURE_UNITS.DECIBEL,
        read_only: true,
        keep_history: true,
        has_feedback: true,
        min: 35,
        max: 110,
      },
      {
        name: `Temperature mini - ${data.station_name}`,
        selector: `netatmo:${sid}:min_temp`,
        external_id: `netatmo:${sid}:min_temp`,
        category: DEVICE_FEATURE_CATEGORIES.TEMPERATURE_SENSOR,
        type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
        unit: unitTemperature,
        read_only: true,
        keep_history: true,
        has_feedback: true,
        min: minTemperatureIndoor,
        max: maxTemperatureIndoor,
      },
      {
        name: `Temperature maxi - ${data.station_name}`,
        selector: `netatmo:${sid}:max_temp`,
        external_id: `netatmo:${sid}:max_temp`,
        category: DEVICE_FEATURE_CATEGORIES.TEMPERATURE_SENSOR,
        type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
        unit: unitTemperature,
        read_only: true,
        keep_history: true,
        has_feedback: true,
        min: minTemperatureIndoor,
        max: maxTemperatureIndoor,
      },
      {
        name: `Reachable (WiFi or Power) - ${data.station_name}`,
        selector: `netatmo:${sid}:reachable`,
        external_id: `netatmo:${sid}:reachable`,
        category: DEVICE_FEATURE_CATEGORIES.SWITCH,
        type: DEVICE_FEATURE_TYPES.SWITCH.BINARY,
        read_only: true,
        keep_history: true,
        has_feedback: true,
        min: 0,
        max: 1,
      },
    ],
  };

  data.modules.forEach((module) => {
    const sidModule = module._id;
    const moduleName = module.module_name;
    logger.debug(`Netatmo : New Module station, sid = ${sidModule}`);
    // this.devices[sidModule] = module;
    let newSensor2;
    if (module.data_type[0] === 'Wind') {
      newSensor2 = {
        service_id: this.serviceId,
        name: moduleName,
        selector: `netatmo:${sidModule}`,
        external_id: `netatmo:${sidModule}`,
        model: 'netatmo-station-wind',
        should_poll: false,
        features: [
          {
            name: `Wind strength - ${moduleName}`,
            selector: `netatmo:${sidModule}:WindStrength`,
            external_id: `netatmo:${sidModule}:WindStrength`,
            category: DEVICE_FEATURE_CATEGORIES.WINDSPEED_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
            unit: unitWind,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: minWind,
            max: maxWind,
          },
          {
            name: `Wind angle - ${moduleName}`,
            selector: `netatmo:${sidModule}:WindAngle`,
            external_id: `netatmo:${sidModule}:WindAngle`,
            category: DEVICE_FEATURE_CATEGORIES.ANGLE_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.STRING,
            unit: DEVICE_FEATURE_UNITS.DEGREE,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: 0,
            max: 360,
          },
          {
            name: `Gust strength - ${moduleName}`,
            selector: `netatmo:${sidModule}:GustStrength`,
            external_id: `netatmo:${sidModule}:GustStrength`,
            category: DEVICE_FEATURE_CATEGORIES.WINDSPEED_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
            unit: unitWind,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: minWind,
            max: maxWind,
          },
          {
            name: `Gust angle - ${moduleName}`,
            selector: `netatmo:${sidModule}:GustAngle`,
            external_id: `netatmo:${sidModule}:GustAngle`,
            category: DEVICE_FEATURE_CATEGORIES.ANGLE_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.STRING,
            unit: DEVICE_FEATURE_UNITS.DEGREE,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: 0,
            max: 360,
          },
          {
            name: `Max wind strength day - ${moduleName}`,
            selector: `netatmo:${sidModule}:max_wind_str`,
            external_id: `netatmo:${sidModule}:max_wind_str`,
            category: DEVICE_FEATURE_CATEGORIES.WINDSPEED_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
            unit: unitWind,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: minWind,
            max: maxWind,
          },
          {
            name: `Max wind angle day - ${moduleName}`,
            selector: `netatmo:${sidModule}:max_wind_angle`,
            external_id: `netatmo:${sidModule}:max_wind_angle`,
            category: DEVICE_FEATURE_CATEGORIES.ANGLE_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.STRING,
            unit: DEVICE_FEATURE_UNITS.DEGREE,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: 0,
            max: 360,
          },
          {
            name: `Battery - ${moduleName}`,
            selector: `netatmo:${sidModule}:battery`,
            external_id: `netatmo:${sidModule}:battery`,
            category: DEVICE_FEATURE_CATEGORIES.BATTERY,
            type: DEVICE_FEATURE_TYPES.BATTERY.INTEGER,
            unit: DEVICE_FEATURE_UNITS.PERCENT,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: 0,
            max: 100,
          },
          {
            name: `Reachable (WiFi or Power) - ${moduleName}`,
            selector: `netatmo:${sidModule}:reachable`,
            external_id: `netatmo:${sidModule}:reachable`,
            category: DEVICE_FEATURE_CATEGORIES.SWITCH,
            type: DEVICE_FEATURE_TYPES.SWITCH.BINARY,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: 0,
            max: 1,
          },
        ],
      };
    }
    if (module.data_type[0] === 'Rain') {
      newSensor2 = {
        service_id: this.serviceId,
        name: moduleName,
        selector: `netatmo:${sidModule}`,
        external_id: `netatmo:${sidModule}`,
        model: 'netatmo-station-rain',
        should_poll: false,
        features: [
          {
            name: `Rain - ${moduleName}`,
            selector: `netatmo:${sidModule}:rain`,
            external_id: `netatmo:${sidModule}:rain`,
            category: DEVICE_FEATURE_CATEGORIES.RAINFALL_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
            unit: unitRainFall,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: minRainFall,
            max: maxRainFall,
          },
          {
            name: `Sum Rain last 1 hour - ${moduleName}`,
            selector: `netatmo:${sidModule}:sum_rain_1`,
            external_id: `netatmo:${sidModule}:sum_rain_1`,
            category: DEVICE_FEATURE_CATEGORIES.RAINFALL_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
            unit: unitRain,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: minRain,
            max: maxRain,
          },
          {
            name: `Sum Rain last 24 hours - ${moduleName}`,
            selector: `netatmo:${sidModule}:sum_rain_24`,
            external_id: `netatmo:${sidModule}:sum_rain_24`,
            category: DEVICE_FEATURE_CATEGORIES.RAINFALL_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
            unit: unitRain,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: minRain,
            max: maxRain,
          },
          {
            name: `Battery - ${moduleName}`,
            selector: `netatmo:${sidModule}:battery`,
            external_id: `netatmo:${sidModule}:battery`,
            category: DEVICE_FEATURE_CATEGORIES.BATTERY,
            type: DEVICE_FEATURE_TYPES.BATTERY.INTEGER,
            unit: DEVICE_FEATURE_UNITS.PERCENT,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: 0,
            max: 100,
          },
          {
            name: `Reachable (WiFi or Power) - ${moduleName}`,
            selector: `netatmo:${sidModule}:reachable`,
            external_id: `netatmo:${sidModule}:reachable`,
            category: DEVICE_FEATURE_CATEGORIES.SWITCH,
            type: DEVICE_FEATURE_TYPES.SWITCH.BINARY,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: 0,
            max: 1,
          },
        ],
      };
    }
    if (module.data_type[0] !== 'Rain' && module.data_type[0] !== 'Wind') {
      if (module.data_type.length === 2) {
        newSensor2 = {
          service_id: this.serviceId,
          name: moduleName,
          selector: `netatmo:${sidModule}`,
          external_id: `netatmo:${sidModule}`,
          model: 'netatmo-station-outdoor',
          should_poll: false,
          features: [
            {
              name: `Temperature - ${moduleName}`,
              selector: `netatmo:${sidModule}:temperature`,
              external_id: `netatmo:${sidModule}:temperature`,
              category: DEVICE_FEATURE_CATEGORIES.TEMPERATURE_SENSOR,
              type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
              unit: unitTemperature,
              read_only: true,
              keep_history: true,
              has_feedback: true,
              min: minTemperatureOutdoor,
              max: maxTemperatureOutdoor,
            },
            {
              name: `Humidity - ${moduleName}`,
              selector: `netatmo:${sidModule}:humidity`,
              external_id: `netatmo:${sidModule}:humidity`,
              category: DEVICE_FEATURE_CATEGORIES.HUMIDITY_SENSOR,
              type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
              unit: DEVICE_FEATURE_UNITS.PERCENT,
              read_only: true,
              keep_history: true,
              has_feedback: true,
              min: 0,
              max: 100,
            },
            {
              name: `Temperature mini- ${moduleName}`,
              selector: `netatmo:${sidModule}:min_temp`,
              external_id: `netatmo:${sidModule}:min_temp`,
              category: DEVICE_FEATURE_CATEGORIES.TEMPERATURE_SENSOR,
              type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
              unit: unitTemperature,
              read_only: true,
              keep_history: true,
              has_feedback: true,
              min: minTemperatureOutdoor,
              max: maxTemperatureOutdoor,
            },
            {
              name: `Temperature maxi - ${moduleName}`,
              selector: `netatmo:${sidModule}:max_temp`,
              external_id: `netatmo:${sidModule}:max_temp`,
              category: DEVICE_FEATURE_CATEGORIES.TEMPERATURE_SENSOR,
              type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
              unit: unitTemperature,
              read_only: true,
              keep_history: true,
              has_feedback: true,
              min: minTemperatureOutdoor,
              max: maxTemperatureOutdoor,
            },
            {
              name: `Battery - ${moduleName}`,
              selector: `netatmo:${sidModule}:battery`,
              external_id: `netatmo:${sidModule}:battery`,
              category: DEVICE_FEATURE_CATEGORIES.BATTERY,
              type: DEVICE_FEATURE_TYPES.BATTERY.INTEGER,
              unit: DEVICE_FEATURE_UNITS.PERCENT,
              read_only: true,
              keep_history: true,
              has_feedback: true,
              min: 0,
              max: 100,
            },
            {
              name: `Reachable (WiFi or Power) - ${moduleName}`,
              selector: `netatmo:${sidModule}:reachable`,
              external_id: `netatmo:${sidModule}:reachable`,
              category: DEVICE_FEATURE_CATEGORIES.SWITCH,
              type: DEVICE_FEATURE_TYPES.SWITCH.BINARY,
              read_only: true,
              keep_history: true,
              has_feedback: true,
              min: 0,
              max: 1,
            },
          ],
        };
      }
    }
    if (module.data_type.length === 3) {
      newSensor2 = {
        service_id: this.serviceId,
        name: module.module_name,
        selector: `netatmo:${sidModule}`,
        external_id: `netatmo:${sidModule}`,
        model: 'netatmo-station-indoor',
        should_poll: false,
        features: [
          {
            name: `Temperature - ${moduleName}`,
            selector: `netatmo:${sidModule}:temperature`,
            external_id: `netatmo:${sidModule}:temperature`,
            category: DEVICE_FEATURE_CATEGORIES.TEMPERATURE_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
            unit: unitTemperature,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: minTemperatureIndoor,
            max: maxTemperatureIndoor,
          },
          {
            name: `Humidity - ${moduleName}`,
            selector: `netatmo:${sidModule}:humidity`,
            external_id: `netatmo:${sidModule}:humidity`,
            category: DEVICE_FEATURE_CATEGORIES.HUMIDITY_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
            unit: DEVICE_FEATURE_UNITS.PERCENT,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: 0,
            max: 100,
          },
          {
            name: `CO2 - ${moduleName}`,
            selector: `netatmo:${sidModule}:co2`,
            external_id: `netatmo:${sidModule}:co2`,
            category: DEVICE_FEATURE_CATEGORIES.CO2_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
            unit: DEVICE_FEATURE_UNITS.PPM,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: 0,
            max: 5000,
          },
          {
            name: `Temperature mini - ${moduleName}`,
            selector: `netatmo:${sidModule}:min_temp`,
            external_id: `netatmo:${sidModule}:min_temp`,
            category: DEVICE_FEATURE_CATEGORIES.TEMPERATURE_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
            unit: unitTemperature,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: minTemperatureIndoor,
            max: maxTemperatureIndoor,
          },
          {
            name: `Temperature maxi - ${moduleName}`,
            selector: `netatmo:${sidModule}:max_temp`,
            external_id: `netatmo:${sidModule}:max_temp`,
            category: DEVICE_FEATURE_CATEGORIES.TEMPERATURE_SENSOR,
            type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
            unit: unitTemperature,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: minTemperatureIndoor,
            max: maxTemperatureIndoor,
          },
          {
            name: `Battery - ${moduleName}`,
            selector: `netatmo:${sidModule}:battery`,
            external_id: `netatmo:${sidModule}:battery`,
            category: DEVICE_FEATURE_CATEGORIES.BATTERY,
            type: DEVICE_FEATURE_TYPES.BATTERY.INTEGER,
            unit: DEVICE_FEATURE_UNITS.PERCENT,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: 0,
            max: 100,
          },
          {
            name: `Reachable (WiFi or Power) - ${moduleName}`,
            selector: `netatmo:${sidModule}:reachable`,
            external_id: `netatmo:${sidModule}:reachable`,
            category: DEVICE_FEATURE_CATEGORIES.SWITCH,
            type: DEVICE_FEATURE_TYPES.SWITCH.BINARY,
            read_only: true,
            keep_history: true,
            has_feedback: true,
            min: 0,
            max: 1,
          },
        ],
      };
    }
    this.addSensor(sidModule, newSensor2);
  });
  this.addSensor(sid, newSensor);
}

module.exports = {
  newValueStation,
};
