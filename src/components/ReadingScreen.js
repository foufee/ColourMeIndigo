import React from 'react';
import DeviceList from '../containers/DeviceList'
import { Content,Card,CardItem,Header, Left, Right, Body, Title, Container,Button,Text,Icon,Picker } from 'native-base'
import { ImageBackground } from 'react-native'
import FilterWheel from '../widgets/filterWheel'
import Slider from '../widgets/slider'

const ReadingScreen = (props) => {
    const {
        navigation
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
                        <Icon name="menu" />
                    </Button>
                </Left>
                <Body>
                <Title>Take Sample</Title>
                </Body>
                <Right />
            </Header>
            <Content>
                <FilterWheel/>

                <Text>Hello</Text>
            </Content>
        </Container>
    );
}

export default ReadingScreen;