import React from 'react';
import { Button,Text, List, ListItem } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const DeviceList = (props) => {
    const {
        devices,
        onConnect,
        onDisconnect
    } = props;


    let deviceItems = []
    devices.forEach( (value) => {
        console.log(value.toJS())
        let name = 'signal-cellular-' + value.get('bars');
        let clickMethod = () => {}
        let connectedIcon = undefined
        if (value.get('connected', false)) {
            clickMethod = onDisconnect
            connectedIcon = <Icon name="bluetooth-connect" size={30} style={{color:'white'}}/>
        } else {
            clickMethod = onConnect
        }
        deviceItems.push(
            <ListItem key={value.get('id')}>{connectedIcon}<Icon name={name} size={30} style={{ color:'white' }}/><Button onPress={ () => clickMethod(value.get('id'))}><Text>{value.get('name')} ({value.get('rssi')}dB)</Text></Button></ListItem>
        )
    });
    return (
        <List>
            {deviceItems}
        </List>
    );
}

export default DeviceList;

