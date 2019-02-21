import React from 'react';
import { Content, Container } from 'native-base'
import { Row, Grid} from 'react-native-easy-grid'
import { Text, Dimensions,StyleSheet} from 'react-native'

import FilterWheel from '../widgets/filterWheel'
import Header from '../containers/Header'
import Gauge from "../widgets/gauge";

const ReadingScreen = (props) => {
    const {
        navigation,
        data,
        illuminated,
        selectedColor,
        onSelectColor
    } = props;

    let sample = 'No sample';
    let sampleValue = 0

    return (
        <Container>
            <Header navigation={navigation} pageTitle={"Take Sample"}/>
            <Content>
                <Grid>
                    <Row>
                        <FilterWheel selectedColor={selectedColor} onPickColor={ (c) => onSelectColor(c,illuminated)}/>
                    </Row>
                    <Row style={{marginTop:-150, backgroundColor:'white'}}>
                        <Gauge
                            width={Dimensions.get('window').width}
                            min={0}
                            max={8000}
                            value={sampleValue}
                            fontSize={13}
                            label={"µW/cm2"}
                            low={1000}
                            mid={5000}
                            backgroundColor='white'
                        />
                    </Row>
                    <Row style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={styles.titleText}>{sample}</Text>
                    </Row>
                </Grid>
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    baseText: {
        fontFamily: 'Cochin',
    },
    titleText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
});

export default ReadingScreen;