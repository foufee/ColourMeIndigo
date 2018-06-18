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
const _DISCONNECTED = 'ble/DISCONNECTED'
const _RSSI = 'ble/RSSI'
const _ASSOCIATEDEMITTERANDCHARACTERISTIC = 'ble/ASSOCIATEEMITTERANDCHARACTERISTIC'
const _DISASSOCIATEDEMITTERANDCHARACTERISTIC = 'ble/DISASSOCIATEEMITTERANDCHARACTERISTIC'

export const InitialState = new Map( {
    scanning:false,
    connectingTo:'',
    connectedTo:'',
    devices:new Map(),
    notifications:new Map()
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

function rssiUpdated(peripheralId, rssi) {
    return {
        type: _RSSI,
        peripheralId:peripheralId,
        rssi:rssi
    }
}
function handleScanFinished(dispatch) {
    return () => {
        dispatch(scanned());
    }
}

function disconnected() {
    return {
        type: _DISCONNECTED
    }
}

function addEmitterForCharacteristic(characteristic, emitter) {
    return {
        type: _ASSOCIATEDEMITTERANDCHARACTERISTIC,
        emitter: emitter,
        characteristic: characteristic
    }
}

function removeEmitterForCharacteristic(characteristic, emitter) {
    return {
        type: _DISASSOCIATEDEMITTERANDCHARACTERISTIC,
        emitter: emitter,
        characteristic: characteristic
    }
}

function handleDiscoverPeripheral(dispatch, name, forceConnected = false)
{
    return (peripheral) =>
    {
        if (peripheral.name === name) {
            console.log("Peripheral discovered:")
            console.log(peripheral);
            dispatch(peripheralDiscovered(peripheral));
            if (forceConnected) {
                bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDeviceStateChange(dispatch) );
                dispatch(connected(peripheral.id))
                BleManager.readRSSI(peripheral.id)
                    .then( (rssi) => dispatch(rssiUpdated(peripheral.id, rssi)))
            }
        }
    }
}

function handleCharacteristicNotified(dispatch,actionGenerator)
{
    return (d) => {
        console.log("Not")
        var buf = new ArrayBuffer(4);
        var view = new DataView(buf);

        d.value.forEach(function (b, i) {
            view.setUint8(3-i, b);
        });
        let num = view.getFloat32(0);
        dispatch(actionGenerator(d.service, d.characteristic, num))
    }
}


function handleDeviceStateChange(dispatch, state)
{
    return (state) =>
    {
        console.log(state);
    }
}
/*************** BLE Management Functions ********************/

export function detectAlreadyConnectedDevices(name) {
    return function (dispatch) {
        BleManager.getConnectedPeripherals([])
            .then((peripheralsArray) => {
                peripheralsArray.forEach((v) => {
                    return BleManager.connect(v.id)
                        .then( () => BleManager.retrieveServices(v.id))
                        .then( (pInfo) => handleDiscoverPeripheral(dispatch, name, true)(pInfo))
                })
            });
    }

}

export function connectToDevice(deviceId) {
    return function (dispatch) {
        dispatch(connecting(deviceId));
        bleManagerEmitter.removeAllListeners('BleManagerDisconnectPeripheral');
        return BleManager.connect(deviceId)
            .then( () => BleManager.retrieveServices(deviceId) )
            .then( (peripheralInfo) => {
                console.log(peripheralInfo);
                return dispatch(connected(deviceId))
            } )
            .then( () => {
                console.log("Adding listener")
                bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDeviceStateChange(dispatch) );
            })
            .catch( (e) => dispatch(connectionFailed() ));
    }
}

export function disconnect(deviceId) {
    return function (dispatch) {
        console.log("Disconnecting from " + deviceId)
        return BleManager.disconnect(deviceId)
            .then( () => {
                console.log("Disconnected from " + deviceId)
                bleManagerEmitter.removeAllListeners('BleManagerDisconnectPeripheral');
                bleManagerEmitter.removeAllListeners('BleManagerDidUpdateValueForCharacteristic');

                dispatch(disconnected(deviceId))
            })
            .catch( (e) => console.warn(e) );
    }

}

export function scan(name) {
    return (dispatch) => {
        bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
        bleManagerEmitter.removeAllListeners('BleManagerStopScan');
        bleManagerEmitter.removeAllListeners('BleManagerDisconnectPeripheral');

        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral(dispatch,name) );
        bleManagerEmitter.addListener('BleManagerStopScan', handleScanFinished(dispatch) );

        BleManager.scan([], 3, true)
            .then( (results) => {
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
    }
}


export function setCharacteristic(service, characteristic, value, size) {
    return (dispatch, getState) => {
        return BleManager.write(getState().getIn(['ble','connectedTo']), service, characteristic, value , size);
    }
}

export function startNotification(service, characteristic,actionGenerator) {
    return (dispatch, getState) => {
        let emitter = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleCharacteristicNotified(dispatch, actionGenerator) );
        dispatch(addEmitterForCharacteristic(characteristic, emitter))
        return BleManager.startNotification(getState().getIn(['ble', 'connectedTo']), service, characteristic)
    }
}

export function disableNotification(service, characteristic) {
    return (dispatch, getState) => {
        console.log("DisNob")
        let emitter = getState().getIn(['ble','notifications',characteristic],undefined)
        if (!_.isUndefined(emitter)) {
            return BleManager.stopNotification(getState().getIn(['ble', 'connectedTo']), service, characteristic)
                .then( () => {
                    bleManagerEmitter.removeSubscription(emitter);
                    dispatch(removeEmitterForCharacteristic(characteristic, emitter));
                })
        }
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
        case _DISCONNECTED:
            return state.setIn(['connectingTo'], '').setIn(['connectedTo'], '');
        case _ASSOCIATEDEMITTERANDCHARACTERISTIC:
            return state.setIn(['notifications',action.characteristic], action.emitter)
        case _DISASSOCIATEDEMITTERANDCHARACTERISTIC:
            return state.deleteIn(['notifications',action.characteristic])
    }
    return state;
}


