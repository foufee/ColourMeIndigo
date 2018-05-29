import {List} from 'immutable'

import {connectWithLifecycle} from "react-lifecycle-component";
import ReadingScreenComponent from '../components/ReadingScreen'

const mapStateToProps = (state, ownprops) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        componentDidMount: () => {
        },
    };
};

export const ReadingScreen = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps
)(ReadingScreenComponent );

export default ReadingScreen;