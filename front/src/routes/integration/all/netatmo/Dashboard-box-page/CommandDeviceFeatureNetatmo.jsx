import { Text, Localizer } from 'preact-i18n';
import get from 'get-value';
import { DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } from '../../../../../../../server/utils/constants';
import { NETATMO_VALUES } from '../../../../../../../server/services/netatmo/lib/constants';
import { DeviceFeatureCategoriesIcon } from '../../../../../utils/consts';
import actions from './actions';
import { connect } from 'unistore/preact';
import { Component } from 'preact';

import style from '../style.css';

const RenderCommandGlobal = ({ children, ...props }) => {
  function handleClick(e) {
    e.preventDefault();
    let newValue;
    if (e.target.id === "+"){
      newValue = props.deviceFeature.last_value + 1
    } else if (e.target.id === "-"){
      newValue = props.deviceFeature.last_value - 1
    }
    
    props.updateValue(
      props.x,
      props.y,
      props.device,
      props.deviceFeature,
      props.deviceIndex,
      props.deviceFeatureIndex,
      newValue
    );
    // props.updateSetpoint(e)
  }
  return (
    <Localizer>
      <tr class={props.styleTest} title={props.title}>
        <td class="align-self-center">
          <i
            class={`mr-2 fe fe-${get(
              DeviceFeatureCategoriesIcon,
              `${props.deviceFeature.category}.${props.deviceFeature.type}`
            )}`}
          />
        </td>
        <td class="align-self-center">{props.deviceFeature.name}</td>
        {props.deviceFeature.category === DEVICE_FEATURE_CATEGORIES.LIGHT &&
          props.deviceFeature.type === DEVICE_FEATURE_TYPES.LIGHT.STRING && (
            <td class="align-self-center">
              <div class="form-group">
                <Localizer>
                  <select
                    style={{ minWidth: '80px' }}
                    onChange={''}
                    class="form-control"
                    title={<Text id="integration.netatmo.box.noCommand" />}
                  >
                    {props.netatmoSecurityLight.map(light => (
                      <Localizer>
                        <option
                          selected={light === props.deviceFeature.last_value}
                          value={light}
                          disabled
                          title={<Text id="integration.netatmo.box.noCommand" />}
                        >
                          {<Text id={`integration.netatmo.DeviceFeatureValues.security.light.${light}`} />}
                        </option>
                      </Localizer>
                    ))}
                  </select>
                </Localizer>
              </div>
            </td>
          )}
        {props.deviceFeature.category === DEVICE_FEATURE_CATEGORIES.SETPOINT &&
          props.deviceFeature.type === DEVICE_FEATURE_TYPES.SETPOINT.DECIMAL && (
          <td class=" text-right rext-nowrap" style="padding-bottom: 0px">
            <div class="row input-group mb-3">
              <div class="form-group">
                <button id="-" class="btn btn-outline-primary btn" type="button"onClick={handleClick} style={style.buttonSetPointTemp}>-</button>
              </div>
                <input readonly = "readonly" class="form-control text-center" value={`${props.deviceFeature.last_value} °C`}  style={{paddingTop:'0px', paddingBottom:'0px', minHeight: '30px', maxHeight: '30px', minWidth: '60px', maxWidth: '60px' }}/>
              <div class="form-group">
                <button id="+" class="btn btn-outline-primary" type="button" onClick={handleClick} style={style.buttonSetPointTemp}>+</button>
              </div>
            </div>
          </td>
        )}
      </tr>
    </Localizer>
  );
};

@connect('session,httpClient,user', actions)
class CommandDeviceFeature extends Component {
  async getNetatmoConnect(netatmoIsConnect) {
    netatmoIsConnect = await this.props.httpClient.get('/api/v1/service/netatmo/variable/NETATMO_IS_CONNECT');
    this.setState({ netatmoIsConnect }, () => {
      netatmoIsConnect;
    });
  }
  componentWillMount() {
    this.getNetatmoConnect();
  }

  render({ children, ...props }, { netatmoIsConnect }) {
    const netatmoSecurityLight = [];
    Object.keys(NETATMO_VALUES.SECURITY.LIGHT).forEach(key => {
      netatmoSecurityLight.push(NETATMO_VALUES.SECURITY.LIGHT[key]);
    });
    if (netatmoIsConnect && netatmoIsConnect.value === 'disconnect') {
      
      return (
        
        <RenderCommandGlobal
          {...props}
          netatmoSecurityLight={netatmoSecurityLight}
          netatmoIsConnect={netatmoIsConnect}
          styleTest={style.opacityLegerdisconnect}
          title={<Text id={`integration.netatmo.box.disconnect`} />}
          
        />
      );
    }
    return (
      <RenderCommandGlobal {...props} netatmoSecurityLight={netatmoSecurityLight} netatmoIsConnect={netatmoIsConnect} />
    );
  }
}

export default CommandDeviceFeature;
