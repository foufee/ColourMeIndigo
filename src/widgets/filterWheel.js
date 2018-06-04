import React,{Component} from 'react';
import {Image,View,Easing,TouchableOpacity,TouchableWithoutFeedback,Text , PanResponder, Animated, Dimensions} from 'react-native'
import {connectWithLifecycle} from "react-lifecycle-component";
import * as filterWheelActions from "../ducks/filterWheel";

const numberOfColors = 7
const angle = 360.0/numberOfColors

class FilterWheelComponent extends Component {
    rotateWheel = new Animated.Value(0);

    state = {
        selectedColor:0,
        direction:'ccw',
        startGesture:undefined,
        hit:[]
    }
    ;
    constructor(props) {
        super(props);

        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: this._handlePanResponderGrant,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease:  this._handlePanResponderEnd
        });
    }

    widgetCoordToUnitVector = (v) => {
        let wx = v[0] - this.state.layout.px;
        let wy = v[1] - this.state.layout.py;

        console.log(wx, wy,this.state.layout.widget_centerPoint);

        let initial_touch_distance_dx = wx - this.state.layout.widget_centerPoint[0] ;
        let initial_touch_distance_dy = this.state.layout.widget_centerPoint[1] - wy;

        let touch_vector_length = Math.sqrt((initial_touch_distance_dx*initial_touch_distance_dx) + (initial_touch_distance_dy*initial_touch_distance_dy));

        return [initial_touch_distance_dx / touch_vector_length, initial_touch_distance_dy / touch_vector_length]
    }

    angleBetweenPoints = (p1,p2) => {
        let vp = [p1[0]-p2[0],p1[1]-p2[1]]
        let angle = 2 * Math.atan2(p2[1]-p1[1], p2[0]-p1[0]);
        return angle

    }

    _handlePanResponderGrant = (e, gestureState) => {
        console.log(gestureState,this.state)
        let sgVp = this.widgetCoordToUnitVector([gestureState.x0,gestureState.y0]);
        console.log(sgVp)
        let hitX = sgVp[0] / Math.abs(sgVp[0])
        let hitY = sgVp[1] / Math.abs(sgVp[1])
        this.setState({
            startGesture:sgVp,
            hit:[hitX,hitY]
        })
        return true;
    }

    gestureStateToAngle = (gestureState) => {
        let curLocUV = this.widgetCoordToUnitVector([gestureState.moveX,gestureState.moveY])
        console.log(curLocUV, this.state.startGesture)
        let mvAngle = this.angleBetweenPoints(this.state.startGesture, curLocUV);
        let rotAngle = mvAngle * 180/Math.PI;
        console.log("RotAngle:",rotAngle)
        console.log("RotAngleOther",360-rotAngle)
        return rotAngle;
    }

    _handlePanResponderMove = (e, gestureState) => {
        let curLocUV = this.widgetCoordToUnitVector([gestureState.moveX,gestureState.moveY])
        let cur = [curLocUV[0] / Math.abs(curLocUV[0]), curLocUV[1] / Math.abs(curLocUV[1])]
        console.log("Quad:",cur, this.state.hit)
        let direction = this.state.direction;
        if (cur[0] === this.state.hit[0] && cur[1] === this.state.hit[1]) {
            if (cur[0] == -1 && cur[1] == -1 ) {
                // Bottom Left
                if (curLocUV[0] < this.state.startGesture[0]) {
                    direction = 'cw'
                } else {
                    direction = 'ccw'
                }
            } else if (cur[0] == 1 && cur[1] == -1 ) {
                // Bottom Right
                if (curLocUV[0] > this.state.startGesture[0]) {
                    direction = 'ccw'
                } else {
                    direction = 'cw'
                }
            } else if (cur[0] == -1 && cur[1] == 1 ) {
                // Top Left
                if (curLocUV[0] < this.state.startGesture[0]) {
                    direction = 'ccw'
                } else {
                    direction = 'cw'
                }
            } else if (cur[0] == 1 && cur[1] == 1) {
                // Top Right
                if (curLocUV[0] > this.state.startGesture[0]) {
                    direction = 'cw'
                } else {
                    direction = 'ccw'
                }
            }
        }
        console.log("Direction:",direction)
        console.log("Move:",this.state)
        this.setState({
            direction: direction
        })
        this.rotateWheel.setValue(((this.state.selectedColor + 1) * angle) - this.gestureStateToAngle(gestureState));

    }

    _handlePanResponderEnd = (e, gestureState) => {
        let directionMulti = 1;
        if (this.state.direction == 'cw') {
            directionMulti = 1
        } else {
            directionMulti = -1;
        }

        let deg = Math.abs(((this.state.selectedColor + 1) * angle) + (this.gestureStateToAngle(gestureState) * directionMulti);
        let target = Math.floor(deg / angle);
        let r = deg % angle;
        console.log(deg,target,r)
        if (r > angle/2.0) {
            console.log("Jumping")
            target = target + 1;
        }
        console.log("Target",target,target%7)
        this.setState({ selectedColor:target%7 })
        this.props.onPickColor(target%7)
        Animated.spring(this.rotateWheel, {
            toValue: target * angle,
            duration: 1000,
            bounciness: 10,
            useNativeDriver:true
        }).start();
    }

    measureView = (event) => {
        this.imageComponent.getNode().measure( (fx, fy, width, height, px, py) => {
            this.setState({
                layout:{
                    w:width,
                    h:height,
                    fx:fx,
                    fy:fy,
                    px:px,
                    py:py,
                    widget_centerPoint:[width / 2,height/2]
                }
            })
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState( {
            selectedColor:nextProps.selectedColor
        });
    }

    render () {
        const spin = this.rotateWheel.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg']
        })
        return (
            <View  style={{flex: 1, flexDirection: 'row', justifyContent: 'center', }} >
                <Animated.Image ref={component => { this.imageComponent = component ; }} onLayout={this.measureView} source={require('../../public/filterWheel_debug.png')}
                              style={{transform: [{rotate: spin}]}} {...this._panResponder.panHandlers}/>
            </View>
        )
    }

}

const mapStateToProps = (state, ownprops) => {
    var props = {
        selectedColor: (state.getIn(['filterWheel','selectedColor']))
    }

    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onPickColor: (colorIdx) => {
            dispatch(filterWheelActions.selectColor(colorIdx))
        },
    };
};

export const FilterWheel = connectWithLifecycle(
    mapStateToProps,
    mapDispatchToProps
)(FilterWheelComponent );

export default FilterWheel;