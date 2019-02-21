import React from "react";
import { AppRegistry, Image, ScrollView,SafeAreaView,StyleSheet} from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";

const SideBar = (props) => {
    const {
        navigation,
        routes,
        connectedTo,
        onDisconnect
    } = props;

    let disconnectItem = undefined
    if (connectedTo.length != 0) {
        disconnectItem = <List>
            <ListItem
                button
                onPress={ () => onDisconnect(connectedTo) }>
                <Text>Disconnect</Text>
            </ListItem>
        </List>
    }

    console.log(routes)
    console.log(navigation.getScreenProps("Home"))

    return (
        <ScrollView style={{flex:1, flexDirection:'column'}}>
            <Image
                source={require('../../public/drawer_bg.jpeg')}
                style={{
                    width:undefined,
                    height: 60,
                    alignItems: "center",
                }}>
            </Image>
            <Text style={{
                color:'white',
                marginTop:-30,
                height:20
            }}>
            ColourMeIndigio
            </Text>
            <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
                <List
                    dataArray={routes}
                    renderRow={data => {
                        return (
                            <ListItem
                                button
                                onPress={() => navigation.navigate(data)}>
                                <Text>{data}</Text>
                            </ListItem>
                        );
                    }}
                />
                {disconnectItem}


            </SafeAreaView>
        </ScrollView>


)   ;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default SideBar;