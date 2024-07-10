import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity, ActivityIndicator,
  View, Image,
  Text,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';
import { heightPercentageToDP, heightPercentageToDP as hp, widthPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Fonts from '../common/Fonts';
import Colors from '../common/Colors';
import { ThemeContext } from './ThemeProvider';
import { checkTheme } from '../common/checkTheme';
import FontSize from '../common/FontSize';



class SmallButton extends PureComponent {

  static contextType = ThemeContext;

  render() {

    const pageStyle = (theme) => StyleSheet.create({
      containerStyle: {
        borderRadius: 10,
        flexDirection: 'row',
        marginVertical: 5,
        backgroundColor: this.props.disable ? "#7C7C80" : "#4d4e4e",
        alignItems: 'center',
        padding: 5,
        height: heightPercentageToDP('5%'),
        width: wp('22%'),
        alignSelf: 'center',
        shadowRadius: 2,
        justifyContent: 'center'
      },
      textBtn: {
        fontFamily: Fonts.Regular,
        fontSize: 12,
        textAlign: 'center',
        color: checkTheme(theme).white
      },
    });


    const { onPress, text, containerStyle, String, visible, disable } = this.props;
    return (
      <TouchableOpacity style={[pageStyle(this.context.theme).containerStyle, containerStyle]} activeOpacity={disable ? 1 : 0.8} onPress={disable ? null : visible ? null : onPress}>
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {visible ?
            <ActivityIndicator
              size="small"
              // style={{left: widthPercentageToDP('38%'), position:'absolute',  opacity:0.7}}
              style={{ flex: 1, }}
              color={'white'}
            />
            :
            <Text style={pageStyle(this.context.theme).textBtn}>
              {text}
            </Text>
          }
        </View>
      </TouchableOpacity>
    );
  }

}


SmallButton.propTypes = {
  containerStyle: PropTypes.object,
  onPress: PropTypes.func,
  String: PropTypes.any
};

SmallButton.defaultProps = {
  // containerStyle: pageStyle.containerStyle
};


export default SmallButton;
