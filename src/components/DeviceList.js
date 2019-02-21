import React from 'react';
import { Button,Text, List, ListItem } from 'native-base'
import {StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const DeviceList = (props) => {
    const {
        devices,
        onConnect,
        onDisconnect
    } = props;


    let deviceItems = []
    devices.forEach( (value) => {
        let name = 'signal-cellular-' + value.get('bars');
        clickMethod = onConnect
        let connectedIcon = undefined

        if (value.get('connected', false)) {
            clickMethod = onDisconnect
            connectedIcon = <Icon name="bluetooth-connect" size={30} style={{color:'white'}}/>
        }

        deviceItems.push(
            <ListItem key={value.get('id')}>
                {connectedIcon}
                <Icon name={name} size={30} style={styles.icons}/>
                <Button onPress={ () => clickMethod(value.get('id'))}>
                    <Text>{value.get('name')} ({value.get('rssi')}dB)</Text>
                </Button>
            </ListItem>
        )
    });
    return (
        <List>
            {deviceItems}
        </List>
    );
}

const styles = StyleSheet.create({
    icons: {
        color: 'white'
    }
});

export default DeviceList;

