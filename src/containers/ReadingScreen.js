import {List} from 'immutable'

import {connectWithLifecycle} from "react-lifecycle-component";
import ReadingScreenComponent from '../components/ReadingScreen'
import * as filterWheelActions from "../ducks/filterWheel";
import * as ble from '../ducks/ble'
import * as spectrometer from '../ducks/Spectrometer'
const mapStateToProps = (state, ownprops) => {
    let selectedChannel = state.getIn(['filterWheel','selectedColor']);
    let data = state.getIn(['spectrometer','data',selectedChannel], new List([Math.random(),Math.random(),Math.random(),Math.random(),Math.random()])).toJS();
    var props = {
        selectedColor: selectedChannel,
        illuminated: state.getIn(['spectrometer','illuminated'], false),
        data: data
    }

    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {
        componentDidMount: () => {
        },
        onSelectColor: (c,ledState) => {
            if (ledState) dispatch(spectrometer.stopSampling())
            dispatch(filterWheelActions.selectColor(c))
            if (ledState) dispatch(spectrometer.startSampling(selectedColor))
        },
        onToggleIlluminate: (state,selectedColor) => {
            dispatch(spectrometer.illuminateLED(state))
                .then( (ledState) => {
                    if (ledState) {
                        dispatch(spectrometer.startSampling(selectedColor))
                            .then( () => console.log("Notifications enabled"))
                    }  else {
                        dispatch(spectrometer.stopSampling());
                        console.log("Notifications disabled")
                    }})
        }
    };
};

export const ReadingScreen = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps
)(ReadingScreenComponent );

export default ReadingScreen;