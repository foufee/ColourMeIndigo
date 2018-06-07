import React,{Component} from 'react';
import {Image,View,Easing,TouchableOpacity,TouchableWithoutFeedback,Text , PanResponder, Animated, Dimensions} from 'react-native'

const COLORS = ['RED','ALL','VIOLET','BLUE','GREEN','YELLOW','ORANGE']
const numberOfColors = COLORS.length
const angle = 360.0/numberOfColors
const TOP_LEFT = 'tl';
const TOP_RIGHT = 'tr'
const BOTTOM_LEFT = 'bl'
const BOTTOM_RIGHT = 'br'
// UV = Unit vector

class FilterWheel extends Component {
    rotateWheel = new Animated.Value(0);

    state = {
        selectedColor:0,
        startGestureUV:undefined,
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

        let initial_touch_distance_dx = wx - this.state.layout.widget_centerPoint[0] ;
        let initial_touch_distance_dy = this.state.layout.widget_centerPoint[1] - wy;

        let touch_vector_length = Math.sqrt((initial_touch_distance_dx*initial_touch_distance_dx) + (initial_touch_distance_dy*initial_touch_distance_dy));

        return [initial_touch_distance_dx / touch_vector_length, initial_touch_distance_dy / touch_vector_length]
    }

    angleBetweenPoints = (p1,p2) => {
        let startAngle = ((Math.PI/2) - Math.atan2(p1[1], p1[0]))* (180/Math.PI);
        let endAngle = ((Math.PI/2) - Math.atan2(p2[1], p2[0]))* (180/Math.PI);

        let quad_p1 = this.uvToQuad(p1);
        switch (quad_p1) {
            case TOP_LEFT:
                startAngle = 360 + startAngle;
        }

        let quad_p2 = this.uvToQuad(p2);
        switch (quad_p2) {
            case TOP_LEFT:
                endAngle = 360 + endAngle;
        }

        let deg = endAngle - startAngle;
        if (deg < 0) {
            deg = 360 + deg;
        }
        return deg;
    }

    uvToQuad = (uv) => {
        let quad = [uv[0] / Math.abs(uv[0]), uv[1] / Math.abs(uv[1])]

        if (quad[0] == -1 && quad[1] == -1 ) {
            return BOTTOM_LEFT
        } else if (quad[0] == 1 && quad[1] == -1 ) {
            return BOTTOM_RIGHT
        } else if (quad[0] == -1 && quad[1] == 1 ) {
            return TOP_LEFT
        } else if (quad[0] == 1 && quad[1] == 1) {
            return TOP_RIGHT
        }
    }

    _handlePanResponderGrant = (e, gestureState) => {
        let startGestureUV = this.widgetCoordToUnitVector([gestureState.x0,gestureState.y0]);
        this.setState({
            startGestureUV:startGestureUV,
        })
        return true;
    }

    directionalRotation = (fromUV, toUV, direction) => {
        let mvAngle = this.angleBetweenPoints(fromUV, toUV, direction);
        let rotAngle = mvAngle;
        return rotAngle;
    }

    _handlePanResponderMove = (e, gestureState) => {
        let currentHitUV = this.widgetCoordToUnitVector([gestureState.moveX,gestureState.moveY])
        let deg = (this.state.selectedColor * angle)  + this.directionalRotation(this.state.startGestureUV, currentHitUV);
        this.rotateWheel.setValue(deg);

    }

    _handlePanResponderEnd = (e, gestureState) => {
        let currentHitUV = this.widgetCoordToUnitVector([gestureState.moveX,gestureState.moveY])
        let deg = (this.state.selectedColor * angle)  + this.directionalRotation(this.state.startGestureUV, currentHitUV);

        let target = Math.floor(deg / angle);
        let r = deg % angle;
        if (r > angle/2.0) {
            target = target + 1;
        }
        this.setState({ selectedColor:Math.abs(target%7) })


        this.props.onPickColor(COLORS[target%7])
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
            selectedColor: COLORS.indexOf(nextProps.selectedColor)
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

export default FilterWheel;