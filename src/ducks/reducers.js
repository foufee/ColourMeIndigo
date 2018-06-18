import { combineReducers } from 'redux-immutable'
import ble from './ble'
import filterWheel from './filterWheel'
import spectrometer from './Spectrometer'

const rootReducer = combineReducers( {
    ble: ble,
    filterWheel: filterWheel,
    spectrometer: spectrometer
});

export default rootReducer
