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
const _LED_ON = 'ble/LED_ON';
const _LED_OFF = 'ble/LED_OFF';
const CHECK_PERMISSIONS = 'ble/CHECKPERMISSSIONS'
const _DISCONNECTED = 'ble/DISCONNECTED'

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

const CMI_UUIDS = {
    service:'0a7e2600-cba4-4328-b723-72d4240c1705',
    LED    :'0a7e2601-cba4-4328-b723-72d4240c1705',
    LED_Drv:'0a7e2602-cba4-4328-b723-72d4240c1705',
    gain   :'0a7e2603-cba4-4328-b723-72d4240c1705',
    intTime:'0a7e2604-cba4-4328-b723-72d4240c1705',
    mode   :'0a7e2605-cba4-4328-b723-72d4240c1705',
    violet :'0a7e2606-cba4-4328-b723-72d4240c1705',
    blue   :'0a7e2607-cba4-4328-b723-72d4240c1705',
    green  :'0a7e2608-cba4-4328-b723-72d4240c1705',
    yellow :'0a7e2609-cba4-4328-b723-72d4240c1705',
    orange :'0a7e260a-cba4-4328-b723-72d4240c1705',
    red    :'0a7e260b-cba4-4328-b723-72d4240c1705',
}

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

function ledOn() {
    return {
        type: _LED_ON,
        state:true
    }
}

function ledOff() {
    return {
        type: _LED_OFF,
        state:false
    }
}

function disconnected() {
    return {
        type: _DISCONNECTED
    }
}


function handleDiscoverPeripheral(dispatch, forceConnected = false)
{
    return (peripheral) =>
    {
        if (peripheral.name === "ColourMeIndigo") {
            console.log("Peripheral discovered:")
            console.log(peripheral);
            dispatch(peripheralDiscovered(peripheral));
            if (forceConnected) {
                bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDeviceStateChange(dispatch) );
                bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleCharacteristicNotified(dispatch) );
                dispatch(connected(peripheral.id))
                BleManager.readRSSI(peripheral.id)
                    .then( (rssi) => {
                        console.log("RSSI:",peripheral.id,rssi)
                    })
            }
        }
    }
}

function handleCharacteristicNotified(dispatch)
{
    return (d) => {
        var buf = new ArrayBuffer(4);
        var view = new DataView(buf);

        d.value.forEach(function (b, i) {
            console.log(i,b)
            view.setUint8(3-i, b);
        });

// Read the bits as a float; note that by doing this, we're implicitly
// converting it from a 32-bit float into JavaScript's native 64-bit double
        let num = view.getFloat32(0);
// Done
        console.log("Char Notified", num,d.peripheral,d.characteristic,d.service)
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

export function detectAlreadyConnectedDevices() {
    return function (dispatch) {
        BleManager.getConnectedPeripherals([CMI_UUIDS.service])
            .then((peripheralsArray) => {
                peripheralsArray.forEach((v) => {
                    console.log("Scanning already connected devices")
                    return BleManager.connect(v.id)
                        .then( () => BleManager.retrieveServices(v.id))
                        .then( (pInfo) => handleDiscoverPeripheral(dispatch, true)(pInfo))
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
                bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleCharacteristicNotified(dispatch) );
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

export function scan() {
    return (dispatch) => {
        bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
        bleManagerEmitter.removeAllListeners('BleManagerStopScan');
        bleManagerEmitter.removeAllListeners('BleManagerDisconnectPeripheral');

        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral(dispatch) );
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
            .then(() => {
                return dispatch(scan());
            })
    }
}

/*************** Spectrometer Functions **************************/

function sampleChannel(color,v) {

}


export function illuminateLED(ledState) {
    return (dispatch,getState) => {
        console.log("Illuminating")
        return BleManager.write(getState().getIn(['ble','connectedTo']), CMI_UUIDS.service, CMI_UUIDS.LED, ledState ? [1] : [0] , 1)
            .then( () => dispatch(ledState ? ledOn() : ledOff()) )
            .then( () => {
                let state = getState();
                if (ledState) {
                    BleManager.startNotification(getState().getIn(['ble','connectedTo']), CMI_UUIDS.service, CMI_UUIDS.blue)
                        .then( () => console.log("Notifications enabled"))
                }
                console.log("Can now take readings")
            })
            .catch( (e) => { console.warn(e) })
    }
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
        case _DISCONNECTED:
            return state.setIn(['connectingTo'], '').setIn(['connectedTo'], '');
        case _LED_ON:
        case _LED_OFF:
            return state.setIn(['spectrometer','illuminated'], action.state)
    }
    return state;
}


