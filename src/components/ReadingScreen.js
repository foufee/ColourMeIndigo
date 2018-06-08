import React from 'react';
import DeviceList from '../containers/DeviceList'
import { Content,Card,CardItem,Header, Left, Right, Body, Title, Container,Button,Text,Picker } from 'native-base'
import { Col, Row, Grid} from 'react-native-easy-grid'
import { ImageBackground, View , Slider, Switch} from 'react-native'
import FilterWheel from '../widgets/filterWheel'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

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
                        <Text>Reading goes here</Text>
                    </Row>
                </Grid>
            </Content>
        </Container>
    );
}

export default ReadingScreen;