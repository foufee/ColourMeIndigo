import React from 'react';
import { Header, Left, Right, Body, Title, Container,Button } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const MyHeader = (props,ownprops) => {
    const {

        navigation,
        pageTitle,
        showIlluminator,
        onToggleIlluminate,
        illuminated,
        selectedColor
    } = props;

    let but = undefined;
    if (showIlluminator) {
        but = <Button transparent onPress={() => {
            onToggleIlluminate(!illuminated, selectedColor)
        }}>
            <Icon name={illuminated ? 'lightbulb-on-outline' : 'lightbulb-outline'} size={30}
                  style={{color: illuminated ? 'white' : 'black'}}/>
        </Button>
    }


    return (
            <Header>
                <Left>
                    <Button
                        transparent
                        onPress={() => {
                            navigation.openDrawer();
                        }}>
                        <Icon name="menu" size={30}/>
                    </Button>
                </Left>
                <Body>
                <Title>{pageTitle}</Title>
                </Body>
                <Right>
                    {but}
                </Right>
            </Header>
    );
}

export default MyHeader;