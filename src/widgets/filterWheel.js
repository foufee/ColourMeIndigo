import React from 'react';
import {Spring,animated} from 'react-spring/dist/native'
import {Image,View,Easing,TouchableOpacity,TouchableWithoutFeedback } from 'react-native'
import {connectWithLifecycle} from "react-lifecycle-component";
import * as filterWheelActions from "../ducks/filterWheel";

const FilterWheelComponent = (props) => {
    const {
        selectedColor,
        start,
        end,
        onClick
    } = props;

    const AnimatedView = animated(Image)

    return (
        <View style={{flex:1, flexDirection:'row',justifyContent: 'center'}} >
            <TouchableWithoutFeedback onPress={ (evt) => {
                console.log(evt.nativeEvent)
                //var comp = ReactNativeComponentTree.getInstanceFromNode(evt.nativeEvent.target)._currentElement;
                //console.log(comp)

                onClick()
            } }>
                <View style={{justifyContent:'center'}}>
                    <Spring native from={{rotate:start+'deg'}} to={{rotate:end+'deg'}} reset={end == 0}>
                        { styles => {
                            return (
                                <AnimatedView source={require('../../public/filterWheel.png')} style={{transform: [{rotate:styles.rotate}]}}/>
                            )}
                        }
                    </Spring>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )

}

const mapStateToProps = (state, ownprops) => {
    var props = {
        start: (state.getIn(['filterWheel','selectedColor'])-1)*(360/7.0),
        end: state.getIn(['filterWheel','selectedColor'])*(360/7.0)
    }
    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClick: () => dispatch(filterWheelActions.right())
    };
};

export const FilterWheel = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps
)(FilterWheelComponent );

export default FilterWheel;