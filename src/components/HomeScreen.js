import React from 'react';
import DeviceList from '../containers/DeviceList'
import { Content,  Container,Button,Icon } from 'native-base'
import { ImageBackground } from 'react-native'
import Header from '../containers/Header'

const HomeScreen = (props) => {
    const {
        navigation
    } = props;

     return (
         <Container>
             <Header navigation={navigation} showIlluminator={false} pageTitle={"Device List"}/>
             <Content contentContainerStyle={{ flexGrow: 1 }}>
                 <ImageBackground
                     source={require('../../public/bg.jpg')}
                     style={{ flex: 1 }}>
                     <DeviceList/>
                 </ImageBackground>
             </Content>
         </Container>
    );
}

export default HomeScreen;