import {List} from 'immutable'

import {connectWithLifecycle} from "react-lifecycle-component";
import ReadingScreenComponent from '../components/ReadingScreen'
import * as filterWheelActions from "../ducks/filterWheel";

const mapStateToProps = (state, ownprops) => {
    var props = {
        selectedColor: (state.getIn(['filterWheel','selectedColor']))
    }

    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {
        componentDidMount: () => {
        },
        onSelectColor: (c) => {
            filterWheelActions.selectColor(c);
        }
    };
};

export const ReadingScreen = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps
)(ReadingScreenComponent );

export default ReadingScreen;