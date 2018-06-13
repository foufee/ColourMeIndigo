import {List} from 'immutable'

import {connectWithLifecycle} from "react-lifecycle-component";
import DeviceListComponent from '../components/DeviceList'

import * as ble from '../ducks/ble'

const mapStateToProps = (state, ownprops) => {
    var MIN_RSSI = -100;
    var MAX_RSSI = -55;

    let calcSignalLevel = (rssi, bars) => {
        if (rssi < MIN_RSSI) {
            return 0;
        } else if (rssi >= MAX_RSSI) {
            return bars - 1;
        } else {
            var inputRange = (MAX_RSSI - MIN_RSSI);
            var outputRange = bars - 1.0;
            return Math.round((rssi - MIN_RSSI) * outputRange / inputRange);
        }
    }

    var props = {
        devices: state.getIn(['ble','devices'], new Map()).map( (value,key) => {
            return value.set('bars', calcSignalLevel(value.get('rssi'),4))
        })
    }
    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {
        componentDidMount: () => {
            dispatch(ble.checkPermissions())
                .then( ()=> dispatch(ble.detectAlreadyConnectedDevices()))
                .catch( (e) => console.log("No BLE") )
        },
        onConnect: (deviceId) => {
            dispatch(ble.connectToDevice(deviceId))
                .then( () => console.log('Yay') )
                .catch( (e) => console.log("Oh well") );
        }
    };
};

export const DeviceList = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps
)(DeviceListComponent );

export let internals = {mapStateToProps, mapDispatchToProps};
export default DeviceList;