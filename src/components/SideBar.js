import React from "react";
import { AppRegistry, Image, StatusBar } from "react-native";
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

    return (
        <Container>
            <Content>
                <Image
                    source={{
                        uri: "https://github.com/GeekyAnts/NativeBase-KitchenSink/raw/react-navigation/img/drawer-cover.png"
                    }}
                    style={{
                        height: 120,
                        alignSelf: "stretch",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                </Image>
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

            </Content>
        </Container>
)   ;
}

export default SideBar;