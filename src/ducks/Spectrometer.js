import React from 'react';
import {Map,List} from 'immutable'
import * as ble from './ble'


export const CMI_UUIDS = {
    service:'0a7e2600-cba4-4328-b723-72d4240c1705',
    LED    :'0a7e2601-cba4-4328-b723-72d4240c1705',
    LED_Drv:'0a7e2602-cba4-4328-b723-72d4240c1705',
    gain   :'0a7e2603-cba4-4328-b723-72d4240c1705',
    intTime:'0a7e2604-cba4-4328-b723-72d4240c1705',
    mode   :'0a7e2605-cba4-4328-b723-72d4240c1705',
    channels: {
        violet: '0a7e2606-cba4-4328-b723-72d4240c1705',
        blue: '0a7e2607-cba4-4328-b723-72d4240c1705',
        green: '0a7e2608-cba4-4328-b723-72d4240c1705',
        yellow: '0a7e2609-cba4-4328-b723-72d4240c1705',
        orange: '0a7e260a-cba4-4328-b723-72d4240c1705',
        red: '0a7e260b-cba4-4328-b723-72d4240c1705',
    }
}

const _LED_ON = 'spectrometer/LED_ON';
const _LED_OFF = 'spectrometer/LED_OFF';
const _SAMPLING = 'spectrometer/SAMPLING';
const _SAMPLE = 'spectrometer/SAMPLE';


export const InitialState = new Map( {
    sampling:false,
    illuminated:false,
    drvCurrent:undefined,
    gain:1,
    integrationTime: 255*2.8,
    maxSamples:15,
    data: new Map( {
        violet:new List(),
        blue:new List(),
        green:new List(),
        yellow:new List(),
        orange:new List(),
        red:new List()
    })
})

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

function sampling() {
    return {
        type: _SAMPLING,
        state:true
    }
}

function samplingFinished() {
    return {
        type: _SAMPLING,
        state:false
    }
}

function sampled(expectedCharacteristic, channel) {
    return (service,characteristic, value) => {
        if (service == CMI_UUIDS.service && characteristic == expectedCharacteristic) {
            return {
                type: _SAMPLE,
                channel: channel,
                value: value
            }
        }
    }
}

//External

export function startSampling(color) {
    return (dispatch) => {
        let characteristic = CMI_UUIDS.channels[color];
        console.log("Char", characteristic, color)
        if (!_.isUndefined(characteristic)) {
            dispatch(sampling());
            console.log("Sampling");
            return dispatch(ble.startNotification(CMI_UUIDS.service, characteristic,sampled(characteristic,color)));
        }
    }
}

export function stopSampling() {
    return (dispatch) => {

        Object.keys(CMI_UUIDS.channels).forEach( (c) => {
            console.log("Disabling on ",c)
            dispatch(ble.disableNotification(CMI_UUIDS.service,CMI_UUIDS.channels[c]))
        })
        dispatch(samplingFinished());
    }
}

export function illuminateLED(ledState) {
    return (dispatch,getState) => {
        return dispatch(ble.setCharacteristic(CMI_UUIDS.service, CMI_UUIDS.LED, ledState ? [1] : [0] , 1))
            .then( () => dispatch(ledState ? ledOn() : ledOff()) )
            .then( () => {
                console.log("LED On")
                return new Promise( (resolve, reject) => { resolve(ledState)});
            } )
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
        case _LED_ON:
        case _LED_OFF:
            return state.set('illuminated', action.state)
        case _SAMPLING:
            return state.set('sampling', action.state)
        case _SAMPLE:
            let data = state.getIn(['data',action.channel], new List())
            data = data.push(action.value);
            if (data.count() > state.get("maxSamples")) {
                data = data.shift();
            }
            return state.setIn(['data',action.channel],data)
    }
    return state;
}



