import React from 'react';
import {Map,List} from 'immutable'
import {
    PermissionsAndroid,
    NativeModules,
    NativeEventEmitter,
    Platform
} from 'react-native'

import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const _SCANNING = 'ble/SCANNING';
const _SCANNED = 'ble/SCANNED';
const _DISCOVERED = 'ble/DISCOVERED';
const _CONNECTED = 'ble/CONNECTED';
const _CONNECTING = 'ble/CONNECTING';
const _CONNECTION_FAILED = 'ble/CONNECTION_FAILED';

const CHECK_PERMISSIONS = 'ble/CHECKPERMISSSIONS'

/*
uint8_t colorMeIndigoServiceUUID[]             = {0x0a,0x7e,0x26,0x00,0xcb,0xa4,0x43,0x28,0xb7,0x23,0x72,0xd4,0x24,0x0c,0x17,0x05};
uint8_t colorMeIndigoLEDStateUUID[]            = {0x0a,0x7e,0x26,0x01,0xcb,0xa4,0x43,0x28,0xb7,0x23,0x72,0xd4,0x24,0x0c,0x17,0x05}; // R/W
uint8_t colorMeIndigoLEDDriveCurrentUUID[]     = {0x0a,0x7e,0x26,0x02,0xcb,0xa4,0x43,0x28,0xb7,0x23,0x72,0xd4,0x24,0x0c,0x17,0x05}; // R/W
uint8_t colorMeIndigoGainUUID[]                = {0x0a,0x7e,0x26,0x03,0xcb,0xa4,0x43,0x28,0xb7,0x23,0x72,0xd4,0x24,0x0c,0x17,0x05}; // R/W
uint8_t colorMeIndigoIntTimeUUID[]             = {0x0a,0x7e,0x26,0x04,0xcb,0xa4,0x43,0x28,0xb7,0x23,0x72,0xd4,0x24,0x0c,0x17,0x05}; // R/W
uint8_t colorMeIndigoModeUUID[]                = {0x0a,0x7e,0x26,0x05,0xcb,0xa4,0x43,0x28,0xb7,0x23,0x72,0xd4,0x24,0x0c,0x17,0x05}; // R/W
uint8_t colorMeIndigoCalibVioletUUID[]         = {0x0a,0x7e,0x26,0x06,0xcb,0xa4,0x43,0x28,0xb7,0x23,0x72,0xd4,0x24,0x0c,0x17,0x05}; // R/W
uint8_t colorMeIndigoCalibBlueUUID[]           = {0x0a,0x7e,0x26,0x07,0xcb,0xa4,0x43,0x28,0xb7,0x23,0x72,0xd4,0x24,0x0c,0x17,0x05}; // R/W
uint8_t colorMeIndigoCalibGreenUUID[]          = {0x0a,0x7e,0x26,0x08,0xcb,0xa4,0x43,0x28,0xb7,0x23,0x72,0xd4,0x24,0x0c,0x17,0x05}; // R/W
uint8_t colorMeIndigoCalibYellowUUID[]         = {0x0a,0x7e,0x26,0x09,0xcb,0xa4,0x43,0x28,0xb7,0x23,0x72,0xd4,0x24,0x0c,0x17,0x05}; // R/W
uint8_t colorMeIndigoCalibOrangeUUID[]         = {0x0a,0x7e,0x26,0x0A,0xcb,0xa4,0x43,0x28,0xb7,0x23,0x72,0xd4,0x24,0x0c,0x17,0x05}; // R/W
uint8_t colorMeIndigoCalibRedUUID[]            = {0x0a,0x7e,0x26,0x0B,0xcb,0xa4,0x43,0x28,0xb7,0x23,0x72,0xd4,0x24,0x0c,0x17,0x05}; // R/W
 */
export const InitialState = new Map( {
    scanning:false,
    connectingTo:'',
    connectedTo:'',
    devices:new Map(),
    spectrometer: new Map({
        illuminated:false,
        drvCurrent:undefined,
        gain:1,
        integrationTime:255*2.8,
        })
})

function scanning() {
    return {type:_SCANNING};
}

function scanned() {
    return {type:_SCANNED}
}

function connecting(deviceId) {
    return {type:_CONNECTING, id:deviceId}
}

function connected(deviceId) {
    return {type:_CONNECTED, id:deviceId}
}

function connectionFailed() {
    return {type:_CONNECTION_FAILED}
}

function peripheralDiscovered(peripheral) {
    return {
        type:_DISCOVERED,
       peripheral: peripheral
    }
}

function handleScanFinished(dispatch) {
    return () => {
        dispatch(scanned());
    }
}


function handleDiscoverPeripheral(dispatch, peripheral)
{
    return (peripheral) =>
    {
        if (peripheral.name === "ColourMeIndigo") {
            console.log("Peripheral discovered:")
            console.log(peripheral);
            dispatch(peripheralDiscovered(peripheral));
        }
    }
}

/*************** BLE Management Functions ********************/

export function connectToDevice(deviceId) {
    return function (dispatch) {
        dispatch(connecting(deviceId));
        return BleManager.connect(deviceId)
            .then( () => {
                return dispatch(connected(deviceId));
            })
            .catch( (e) => {
                return dispatch(connectionFailed());
            });
    }
}



export function scan() {
    return (dispatch) => {
        bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
        bleManagerEmitter.removeAllListeners('BleManagerStopScan');

        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral(dispatch) );
        bleManagerEmitter.addListener('BleManagerStopScan', handleScanFinished(dispatch) );
        BleManager.scan([], 3, true)
            .then( (results) => {
                console.log('Scanning...');
                dispatch(scanning());
            })
    }
}


export function checkPermissions() {
    return (dispatch) => {
        dispatch({type: CHECK_PERMISSIONS});
        return BleManager.start({showAlert: true})
            .then(() => {
                if (Platform.OS === 'android' && Platform.Version >= 23) {
                    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            return Promise.resolve();
                        } else {
                            PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                                if (result) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject();
                                }
                            });
                        }
                    });
                }
            })
            .then(() => {
                return dispatch(scan());
            })
    }
}

/*************** Spectrometer Functions **************************/

function sampleChannel(color,v) {

}


export function illuminateLED(state) {

}

export function setGain(gain) {

}

export function setIntergrationTime(time) {

}

export function setLEDCurrent(current) {

}



export default function reducer(state = InitialState, action) {
    switch(action.type) {
        case _SCANNING:
            return state.setIn(['scanning'], true);
        case _SCANNED:
            return state.setIn(['scanning'], false);
        case _DISCOVERED:
            return state.mergeIn(['devices',action.peripheral.id],action.peripheral);
        case _CONNECTING:
            return state.setIn(['connectingTo'], action.id);
        case _CONNECTED:
            return state.setIn(['connectingTo'], '').setIn(['connectedTo'], action.id);
        case _CONNECTION_FAILED:
            return state.setIn(['connectingTo'], '').setIn(['connectedTo'], '');
    }
    return state;
}


