import React from 'react';
import DeviceList from '../containers/DeviceList'
import { Content,Card,CardItem,Header, Left, Right, Body, Title, Container,Button } from 'native-base'
import { Col, Row, Grid} from 'react-native-easy-grid'
import { ImageBackground, View , Text, Slider, Switch,Dimensions,StyleSheet} from 'react-native'
import FilterWheel from '../widgets/filterWheel'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph
} from 'react-native-chart-kit'

const ReadingScreen = (props) => {
    const {
        navigation,
        onToggleIlluminate,
        illuminated,
        data,
        selectedColor,
        onSelectColor
    } = props;

    let sample = 'No sample';
    let steps = ['','']
    if (data.length != 0) {
        sample = (Math.round(data[data.length - 1] * 100) / 100) + "µW/cm2"
        let maxSamples = data.length
        steps = Array.from(new Array(maxSamples), (x,i) => maxSamples - i)
    }


    return (
        <Container>
            <Header>
                <Left>
                    <Button
                        transparent
                        onPress={() => {
                            navigation.openDrawer();
                        }}>
                        <Icon name="menu" size={30}/>
                    </Button>
                </Left>
                <Body>
                <Title>Take Sample</Title>
                </Body>
                <Right>
                    <Button
                        transparent
                        onPress={ () => { onToggleIlluminate(!illuminated, selectedColor) }} >
                        <Icon name={ illuminated ? 'lightbulb-on-outline' : 'lightbulb-outline'} size={30} style={ {color:illuminated ? 'white' : 'black'}} />
                    </Button>
                </Right>
            </Header>
            <Content >
                <Grid>
                    <Row>
                        <FilterWheel selectedColor={selectedColor} onPickColor={ (c) => onSelectColor(c,illuminated)}/>
                    </Row>
                    <Row style={{marginTop:-150, backgroundColor:'white'}}>
                        <LineChart
                            data={{
                                labels: steps,
                                datasets: [{
                                    data: data
                                }]
                            }}
                            width={Dimensions.get('window').width}
                            height={220}
                            chartConfig={{
                                backgroundColor: '#c5bae2',
                                backgroundGradientFrom: '#ba72fb',
                                backgroundGradientTo: '#ffcdd3',
                                color: (opacity = 1) => `rgba(0, 0, 0,1)`,
                                style: {
                                    borderRadius: 16
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16
                            }}
                        />
                    </Row>
                    <Row style={{flex:1,justifyContent:'center',alignItems:'center'}}>

                        <Text style={styles.titleText}>{sample}</Text>
                    </Row>
                </Grid>
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    baseText: {
        fontFamily: 'Cochin',
    },
    titleText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
});

export default ReadingScreen;