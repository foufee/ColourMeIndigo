import React from 'react';
import DeviceList from '../containers/DeviceList'
import { Content,Card,CardItem,Header, Left, Right, Body, Title, Container,Button,Text,Icon,Picker } from 'native-base'
import { ImageBackground, View , Slider} from 'react-native'
import FilterWheel from '../widgets/filterWheel'

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
            <Content style={ {flex:1}}>
                <FilterWheel style={ {flex:1}}/>
                <View style={{marginTop:-150, backgroundColor:'white'}}>
                <View style={ {flex:2, flexGrow:2}}>
                    <Text style={{flex:1}}>Hello</Text>
                </View>
                <View style={ {flex:1, flexDirection:'row'}}>
                    <Text style={ {flex:1, textAlignVertical:'center', textAlign:'right'}}>LED</Text>
                    <Picker
                        style={{flex:1}}
                        iosHeader="Select one"
                        mode="dropdown"
                        selectedValue={"1x"}
                    >
                        <Picker.Item label="Off" value="1x" />
                        <Picker.Item label="Dim" value="3.7x" />
                        <Picker.Item label="Bright" value="16x" />
                        <Picker.Item label="Brighter" value="16x" />
                        <Picker.Item label="Brightest" value="64x" />
                    </Picker>
                </View>
                <View style={ {flex:1, flexDirection:'row'}}>
                    <Text style={ {flex:1, textAlignVertical:'center', textAlign:'right'}}>Gain</Text>
                    <Picker
                        style={{flex:1}}
                        iosHeader="Select one"
                        mode="dropdown"
                        selectedValue={"1x"}
                    >
                        <Picker.Item label="1x" value="1x" />
                        <Picker.Item label="3.7x" value="3.7x" />
                        <Picker.Item label="16x" value="16x" />
                        <Picker.Item label="64x" value="64x" />
                    </Picker>
                </View>
                <View style={ {flex:1, flexDirection:'row'}}>
                    <Text style={ {flex:1, textAlignVertical:'center', textAlign:'right'}}>Integration Time</Text>
                    <View style={ {flex:1}}>
                    <Slider
                        style={{flex:1}}
                        maximumValue={255*2.8}
                        step={2.8}
                        minimumValue={0}
                    />
                        <Text >16ms</Text>
                    </View>
                </View>
                </View>
            </Content>
        </Container>
    );
}

export default ReadingScreen;