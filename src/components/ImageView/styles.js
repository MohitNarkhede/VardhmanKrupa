import {StyleSheet} from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

const HEADER_HEIGHT = 60;

export default function createStyles({screenWidth, screenHeight}) {
    return StyleSheet.create({
        underlay: {

            width: widthPercentageToDP('100%'),
            height: heightPercentageToDP('75%'),
                        
        },
        container: {
            flex:1,
            zIndex:9
        },
        header: {
            // position: 'absolute',
            // top: 0,
            // left: 0,
            // zIndex: 100,
            height: HEADER_HEIGHT,
            width: widthPercentageToDP('100%'),
        },
        imageContainer: {
            width: '100%',
            height: '100%',
            // overflow: 'hidden',
            zIndex:9,
        },
        loading: {
            position: 'absolute',
            top: heightPercentageToDP('75%') / 2 - 20,
            alignSelf: 'center',
        },
        footer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
        },
    });
}
