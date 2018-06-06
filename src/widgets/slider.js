import React from 'react';

import Svg,{
    Circle,
    Text,
    Polygon,
    Rect
} from 'react-native-svg';

const Slider = (props) => {
    const {
        width,
        min,
        max,
        value,
        fontSize,
        label,
        low,
        mid,
        backgroundColor
    } = props;

    let height = width * .66
    let lowColor = '#FDE47F'
    let midColor = '#7CCCE5'
    let highColor = '#E04644'
    let gaugeBackgroundColor = '#f6f6f6'
    let v = value
    let strokeWidth = 10
    let maskWidth = 15
    let radius = ( width / 2) - (maskWidth)
    let innerRadius = ( width / 4) - (maskWidth)
    let lowFraction = low / (max - min)
    let midFraction = mid / (max - min)

    let circum = 2 * Math.PI * radius
    let circumHalf = circum / 2
    let circumSeg1 = circumHalf * lowFraction
    let circumSeg2 = circumHalf * midFraction
    let reveal = circumHalf - (circumHalf * v / (max - min))

    let innerCircum = 2 * Math.PI * innerRadius
    let innerCircumHalf = innerCircum / 2
    let cx = width / 2
    let cy = width / 2
    let origin = "" + width/2 + "," + width/2
    let labelX = width / 2
    let labelY = (width / 2) - (fontSize)

    let thetaRad = (v/(max-min)) * Math.PI
    let d = 1
    if (v < ( (max-min)/2 )) d = -1
    let npx = cx + (d * (radius ) * Math.abs(Math.cos(thetaRad)))

    let npy = cy - (radius ) * Math.sin(thetaRad)

    let point = (px,py) => px + ',' + py + ' '

    let polyPoints = point(cx-10,cy) + point(npx,npy) + point(cx+10,cy)
    return (
        <Svg width={width} height={height} style={ { backgroundColor:backgroundColor}}>
            <Circle
                origin={origin}
                rotate={180}
                cx={cx}
                cy={cy}
                r={radius}
                stroke={gaugeBackgroundColor}
                strokeWidth={maskWidth}
                strokeDasharray={[circumHalf, circum]}
                fill="none"
            />
            <Circle
                origin={origin}
                rotate={180}
                cx={cx}
                cy={cy}
                r={radius}
                stroke={highColor}
                strokeWidth={strokeWidth}
                strokeDasharray={[circumHalf, circum]}
                fill="none"
            />
            <Circle
                origin={origin}
                rotate={180}
                cx={cx}
                cy={cy}
                r={radius}
                stroke={midColor}
                strokeWidth={strokeWidth}
                strokeDasharray={[circumSeg2, circum]}
                fill="none"
            />
            <Circle
                origin={origin}
                rotate={180}
                cx={cx}
                cy={cy}
                r={radius}
                stroke={lowColor}
                strokeWidth={strokeWidth}
                strokeDasharray={[circumSeg1, circum]}
                fill="none"
            />
            <Circle
                origin={origin}
                rotate={180}
                cx={cx}
                cy={cy}
                r={radius}
                stroke="#f9f9f9"
                strokeWidth={maskWidth}
                strokeDasharray={[2, circumHalf - 2]}
                fill="none"
            />
            <Circle
                origin={origin}
                rotate={180}
                cx={cx}
                cy={cy}
                r={radius}
                stroke={gaugeBackgroundColor}
                strokeWidth={strokeWidth}
                strokeDasharray={[0, circumHalf - reveal, reveal, circum]}
                fill="none"
                strokeOpacity="1"
            />

            <Polygon
                points={polyPoints}
                fill="black"
                stroke={gaugeBackgroundColor}
                strokeWidth="1"
            />

            <Circle
                origin={origin}
                rotate={180}
                cx={cx}
                cy={cy}
                r={innerRadius}
                stroke={gaugeBackgroundColor}
                strokeWidth={2}
                strokeDasharray={[innerCircumHalf, innerCircum]}
                fill={backgroundColor}
            />
            <Rect
                x='0'
                y={cy}
                width={width}
                height={height-cy}
                strokeWidth={0}
                fill={backgroundColor}
            />

            <Text
                fill={midColor}
                fontSize="20"
                fontWeight="bold"
                x={labelX}
                y={labelY}
                textAnchor="middle"
            >{label}</Text>


        </Svg>
    )
}

export default Slider;