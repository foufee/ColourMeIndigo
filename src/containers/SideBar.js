import {List} from 'immutable'

import {connectWithLifecycle} from "react-lifecycle-component";
import SideBarComponent from '../components/SideBar'
import * as ble from '../ducks/ble'

const mapStateToProps = (state, ownprops) => {
    var props = {
        routes: ["Home","Reading","Settings"],
        connectedTo: state.getIn(['ble','connectedTo'], '')
    }
    return props;
};

const mapDispatchToProps = (dispatch,getState) => {
    return {
        componentDidMount: () => {
        },
        onDisconnect: (deviceID) => {
            dispatch(ble.disconnect(deviceID));
            console.log("Disconnect")
        },
    };
};

export const SideBar = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps
)(SideBarComponent );

export default SideBar;