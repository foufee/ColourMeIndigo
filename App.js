import React, {Component} from 'react';
import {
    AppRegistry,
    AsyncStorage,
    Image,
    View,
} from 'react-native';

import { StyleProvider,
    Text,
    Root,
    Container,
    Content,
    Button,List,ListItem,Input,InputGroup,
    Spinner
} from 'native-base';


import { createDrawerNavigator } from 'react-navigation';

import { Provider } from 'react-redux'
import configureStore from './src/ducks/configureStore'
const store = configureStore;

import HomeScreen from './src/components/HomeScreen'
import SideBar from './src/components/SideBar'
import ReadingScreen from "./src/containers/ReadingScreen";


const RootStack = createDrawerNavigator({
    Home: {
        screen: HomeScreen
    },
    Reading: { screen: ReadingScreen }
    },
    {
        contentComponent: props => <SideBar {...props} />
    }
);

export default class App extends React.Component {
    render() {
            return (<Provider store={store}>
                <RootStack />
            </Provider>)
    }
}