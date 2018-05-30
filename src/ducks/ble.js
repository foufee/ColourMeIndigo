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

export const InitialState = new Map( {
    scanning:false,
    connectingTo:'',
    connectedTo:'',
    devices:new Map()
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


