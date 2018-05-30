import React,{Component} from 'react';
import {Image,View,Easing,TouchableOpacity,TouchableWithoutFeedback,Text , PanResponder, Animated} from 'react-native'
import {connectWithLifecycle} from "react-lifecycle-component";
import * as filterWheelActions from "../ducks/filterWheel";

class FilterWheelComponent extends Component {
    rotateWheel = new Animated.Value(0);
    state = {
        start:0,
        end:360,
        previousLeft:0,
        previousTop:0
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
        var deg = (Math.atan(gestureState.dx/300)) * 180/Math.PI;
        console.log(deg, this.state)
        this.rotateWheel.setValue(this.state.start + deg);
    }

    _handlePanResponderEnd = (e, gestureState) => {
        console.log("End",this.props)
        if (gestureState.dx<0) this.props.onLeft()
        else this.props.onRight()
    }

    componentWillReceiveProps(nextProps) {
        console.log("CWRP", nextProps, this.state)
        this.setState( {
            start:nextProps.start,
            end:nextProps.end
        });
        Animated.spring(this.rotateWheel, {
            toValue: this.state.end,
            duration:1000,
            bounciness: 10
        }).start();
    }

    render () {
        const spin = this.rotateWheel.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg']
        })
        console.log("Yep it changed",spin, {...this._panResponder})
        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}} >
                <Animated.Image  source={require('../../public/filterWheel.png')}
                              style={{transform: [{rotate: spin}]}} {...this._panResponder.panHandlers}/>
            </View>
        )
    }

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