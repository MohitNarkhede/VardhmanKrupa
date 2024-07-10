
import React from 'react';
import { Image, Dimensions } from 'react-native';
import { ThemeContext } from './ThemeProvider';
const { width, height } = Dimensions.get('window')

export default class Background extends React.Component {

    static contextType = ThemeContext;
    render() {
        return (
            <>
                <Image
                    resizeMode={'contain'}
                    style={{ height: 383 * width * .7 / 512, width: width * .7, top: 0, right: 0, position: 'absolute', zIndex: -1 }}
                    source={require('../images/top.png')} />
                <Image
                    resizeMode={'contain'}
                    style={{ height: 365 * width * .5 / 512, width: width * .5, bottom: 0, left: 0, position: 'absolute', zIndex: -1 }}
                    source={require('../images/bottom.png')} />
            </>
        )
    }
}