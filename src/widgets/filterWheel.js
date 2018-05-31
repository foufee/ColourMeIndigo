import React,{Component} from 'react';
import {Image,View,Easing,TouchableOpacity,TouchableWithoutFeedback,Text , PanResponder, Animated, Dimensions} from 'react-native'
import {connectWithLifecycle} from "react-lifecycle-component";
import * as filterWheelActions from "../ducks/filterWheel";

const angle = 360.0/7.0

class FilterWheelComponent extends Component {
    rotateWheel = new Animated.Value(0);

    state = {
        start:360-angle,
        end:360,
    }
    ;
    constructor(props) {
        super(props);
        console.log("In COns",props)

        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease:  this._handlePanResponderEnd
        });
    }



    _handlePanResponderMove = (e, gestureState) => {
        console.log("Move")
        // Just allow a little bit
        var deg = (Math.atan(gestureState.dx/200)) * 180/Math.PI;
        var target = deg;
        console.log(deg, this.state)
        if (this.state.end == 360 && gestureState.dx > 0) {
            target = deg;
        } else if (this.state.start == 0 && gestureState.dx < 0) {
            target = 360 + angle + deg;
        } else {
            target = this.state.end + deg;
        }

        console.log("Setting target to:", target)
        this.rotateWheel.setValue(target);
    }

    _handlePanResponderEnd = (e, gestureState) => {
        const screenWidth = Dimensions.get("window").width;

        if (Math.abs(gestureState.vx) >= 0.5 || Math.abs(gestureState.dx) >= 0.33 * screenWidth) {
            if (gestureState.dx<0) this.props.onLeft()
            else this.props.onRight()
        } else {
            Animated.spring(this.rotateWheel, {
                toValue: this.state.end,
                duration: 1000,
                bounciness: 10
            }).start();
        }



    }

    componentWillReceiveProps(nextProps) {

        console.log("CWRP", nextProps, this.state)
        this.setState( {
            start:nextProps.start,
            end:nextProps.end
        });

        Animated.spring(this.rotateWheel, {
            toValue: nextProps.end,
            duration: 1000,
            bounciness: 10
        }).start();
    }

    render () {
        const spin = this.rotateWheel.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg']
        })
        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}} >
                <Animated.Image  source={require('../../public/filterWheel.png')}
                              style={{transform: [{rotate: spin}]}} {...this._panResponder.panHandlers}/>
            </View>
        )
    }

}

const mapStateToProps = (state, ownprops) => {
    let pc = state.getIn(['filterWheel','previousColor']);
    let c = state.getIn(['filterWheel','selectedColor']);

    var props = {
        start: (state.getIn(['filterWheel','selectedColor']))*(360/7.0),
        end: (state.getIn(['filterWheel','selectedColor'])+1)*(360/7.0)
    }

    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLeft: () => {
            console.log("Left")
            dispatch(filterWheelActions.left())
        },
        onRight: () => {
            console.log("Right")
            dispatch(filterWheelActions.right())
        }
    };
};

export const FilterWheel = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps
)(FilterWheelComponent );

export default FilterWheel;