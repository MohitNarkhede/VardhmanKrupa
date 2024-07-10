import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity,ActivityIndicator,
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
import { Neomorph } from 'react-native-neomorph-shadows-fixes';



class Button extends PureComponent {

  static contextType = ThemeContext;

  render() {

    const pageStyle = (theme) => StyleSheet.create({
      containerStyle:{
        borderRadius:10,
        flexDirection:'row',
        marginVertical: hp('2%'),
        backgroundColor: this.props.disable ? "#4d4e4e" : "#4d4e4e",
        alignItems:'center',
        padding: 5,
        height: heightPercentageToDP('6%'),
        width: wp('90%'),
        alignSelf:'center',
        justifyContent:'center'
      },
      textBtn:{
        fontFamily:Fonts.Regular,
        fontSize:FontSize.medium,
        textAlign:'center',
        color:checkTheme(theme).white
      },
    });
    

    const { onPress, text, containerStyle,String,visible } = this.props;
    return (
      <TouchableOpacity style={{}} activeOpacity={visible ?1:0.8} onPress={visible ?null:onPress}>
     <View
  // inner // <- enable shadow inside of neomorph
  // swapShadows // <- change zIndex of each shadow color
  style={[pageStyle(this.context.theme).containerStyle, containerStyle, {
    shadowRadius: 5,
   
  }]}
>
      
           <View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
           {visible ?
            <ActivityIndicator
            size="small"  
            // style={{left: widthPercentageToDP('38%'), position:'absolute',  opacity:0.7}}
            style={{flex:1,  }}        
            color={'white'}
          />
          :  
          <Text style={pageStyle(this.context.theme).textBtn}>
            {text}
           </Text>
  }
           </View>
      </View>
     </TouchableOpacity>
    );
  }

}


Button.propTypes = {
  containerStyle: PropTypes.object,
  onPress: PropTypes.func,
  String:PropTypes.any
};

Button.defaultProps = {
  // containerStyle: pageStyle.containerStyle
};


export default Button;
