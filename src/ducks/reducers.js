import { combineReducers } from 'redux-immutable'
import ble from './ble'
import filterWheel from './filterWheel'

const rootReducer = combineReducers( {
    ble: ble,
    filterWheel: filterWheel
});

export default rootReducer
