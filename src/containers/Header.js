import _ from 'underscore'

import {connectWithLifecycle} from "react-lifecycle-component";
import HeaderComponent from '../components/Header'
import * as ble from '../ducks/ble'
import * as spectrometer from '../ducks/Spectrometer'

const mapStateToProps = (state, ownprops) => {
    var props = {
        navigation: ownprops.navigation,
        pageTitle: ownprops.pageTitle,
        showIlluminator: _.isUndefined(ownprops.showIlluminator) ? true : ownprops.showIlluminator ,
        selectedColor: state.getIn(['filterWheel','selectedColor']),
        illuminated: state.getIn(['spectrometer','illuminated'], false),
    }
    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {
        componentDidMount: () => {
        },
        onToggleIlluminate: (state,selectedColor) => {
            dispatch(spectrometer.illuminateLED(state))
                .then( (ledState) => {
                    if (ledState) {
                        dispatch(spectrometer.startSampling(selectedColor))
                            .then( () => console.log("Notifications enabled"))
                    }  else {
                        dispatch(spectrometer.stopSampling());
                    }})
        }
    };
};

export const Header = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps
)(HeaderComponent );

export default Header;