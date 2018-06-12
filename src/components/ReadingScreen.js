import React from 'react';
import DeviceList from '../containers/DeviceList'
import { Content,Card,CardItem,Header, Left, Right, Body, Title, Container,Button,Dimensions } from 'native-base'
import { Col, Row, Grid} from 'react-native-easy-grid'
import { ImageBackground, View , Slider, Switch} from 'react-native'
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
        selectedColor,
        onSelectColor
    } = props;


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
                        onPress={ () => { onToggleIlluminate(!illuminated) }} >
                        <Icon name={ illuminated ? 'lightbulb-on-outline' : 'lightbulb-outline'} size={30} style={ {color:illuminated ? 'white' : 'black'}} />
                    </Button>
                </Right>
            </Header>
            <Content >
                <Grid>
                    <Row>
                        <FilterWheel selectedColor={selectedColor} onPickColor={ (c) => onSelectColor(c)}/>
                    </Row>
                    <Row style={{marginTop:-150, backgroundColor:'white'}}>
                        <LineChart
                            data={{
                                labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                                datasets: [{
                                    data: [
                                        Math.random() * 100,
                                        Math.random() * 100,
                                        Math.random() * 100,
                                        Math.random() * 100,
                                        Math.random() * 100,
                                        Math.random() * 100
                                    ]
                                }]
                            }}
                            width={500} // from react-native
                            height={220}
                            chartConfig={{
                                backgroundColor: '#e26a00',
                                backgroundGradientFrom: '#fb8c00',
                                backgroundGradientTo: '#ffa726',
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
                </Grid>
            </Content>
        </Container>
    );
}

export default ReadingScreen;