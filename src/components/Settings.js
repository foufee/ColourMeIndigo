import React from 'react';
import DeviceList from '../containers/DeviceList'
import { ContentHead, Content, Left, Right, Body, Title, Container,Button,Text,Picker } from 'native-base'
import { Col, Row, Grid} from 'react-native-easy-grid'
import { ImageBackground, View , Slider, Switch} from 'react-native'
import Header from '../containers/Header'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const SettingScreen = (props) => {
    const {
        navigation,
        onSelectColor,
    } = props;


    return (
        <Container>
            <Header navigation={navigation} pageTitle={"Settings"} showIlluminator={false}/>
            <Content >
                <Grid>
                    <Row>
                        <Text style={{flex:1}}>Hello</Text>
                    </Row>
                    <Row>
                        <Col>
                            <Text style={ {textAlignVertical:'center', textAlign:'right'}}>Brightness</Text>
                        </Col>
                        <Col>
                            <Picker
                                style={{flex:1}}
                                iosHeader="Select one"
                                mode="dropdown"
                                selectedValue={"1x"}
                            >
                                <Picker.Item label="Dim" value="0" />
                                <Picker.Item label="Bright" value="1" />
                                <Picker.Item label="Brighter" value="2" />
                                <Picker.Item label="Brightest" value="4" />
                            </Picker>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Text style={ {textAlignVertical:'center', textAlign:'right'}}>Gain</Text>
                        </Col>
                        <Col>
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
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Text style={ {textAlignVertical:'center', textAlign:'right'}}>Integration Time</Text>
                        </Col>
                        <Col>
                            <Row>
                                <Slider
                                    style={{flex:1}}
                                    maximumValue={255*2.8}
                                    step={2.8}
                                    minimumValue={0}
                                />
                            </Row>
                            <Row>
                                <Text >16ms</Text>
                            </Row>
                        </Col>
                    </Row>
                </Grid>
            </Content>
        </Container>
    );
}

export default SettingScreen;