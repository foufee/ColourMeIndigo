import React from 'react';
import DeviceList from '../containers/DeviceList'
import { Content,Card,CardItem,Header, Left, Right, Body, Title, Container,Button,Text,Icon } from 'native-base'
import { ImageBackground } from 'react-native'

const HomeScreen = (props) => {
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
                             console.log("Trying to nav")
                             navigation.openDrawer();
                         }}>
                         <Icon name="menu" />
                     </Button>
                 </Left>
                 <Body>
                 <Title>ColorMeIndigo</Title>
                 </Body>
                 <Right />
             </Header>
             <Content contentContainerStyle={{ flexGrow: 1 }}>
                 <ImageBackground
                     source={require('../../public/bg.jpg')}
                     style={{ flex: 1 }}>
                                  <Text>Scan</Text>
                     <DeviceList/>
                 </ImageBackground>
             </Content>
         </Container>
    );
}

export default HomeScreen;