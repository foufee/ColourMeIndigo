import React from 'react';
import { Button,Text, List, ListItem } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const DeviceList = (props) => {
    const {
        devices,
        onConnect
    } = props;


    let deviceItems = []
    devices.forEach( (value) => {
        let name = 'signal-cellular-' + value.get('bars');
        deviceItems.push(
            <ListItem key={value.get('id')}><Icon name={name} size={30} style={{ color:'white' }}/><Button onPress={ () => onConnect(value.get('id'))}><Text>{value.get('name')} ({value.get('rssi')}dB)</Text></Button></ListItem>
        )
    });
    return (
        <List>
            {deviceItems}
        </List>
    );
}

export default DeviceList;

