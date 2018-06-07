import {connectWithLifecycle} from "react-lifecycle-component";
import SettingsScreenComponent from '../components/Settings'

const mapStateToProps = (state, ownprops) => {
    var props = {
        illuminated:true
    }

    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {
        componentDidMount: () => {
        }
    };
};

export const SettingsScreen = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps
)(SettingsScreenComponent );

export default SettingsScreen;