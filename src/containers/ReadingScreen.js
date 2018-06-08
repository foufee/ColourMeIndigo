import {List} from 'immutable'

import {connectWithLifecycle} from "react-lifecycle-component";
import ReadingScreenComponent from '../components/ReadingScreen'
import * as filterWheelActions from "../ducks/filterWheel";
import * as ble from '../ducks/ble'

const mapStateToProps = (state, ownprops) => {
    var props = {
        selectedColor: state.getIn(['filterWheel','selectedColor']),
        illuminated: state.getIn(['ble','spectrometer','illuminated'], false)
    }

    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {
        componentDidMount: () => {
        },
        onSelectColor: (c) => {
            dispatch(filterWheelActions.selectColor(c))
        },
        onToggleIlluminate: (prevState) => {
            dispatch(ble.illuminateLED(!prevState));
        }
    };
};

export const ReadingScreen = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps
)(ReadingScreenComponent );

export default ReadingScreen;