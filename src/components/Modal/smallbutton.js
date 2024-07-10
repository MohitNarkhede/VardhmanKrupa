import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity,ActivityIndicator,
  View, Image,
  Text
} from 'react-native';
import PropTypes from 'prop-types';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Fonts from '../../common/Fonts';
import Colors from '../../common/Colors';

const pageStyle = StyleSheet.create({
  containerStyle:{
    borderRadius:5,
    flexDirection:'row',
    shadowColor: "#878787",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.0,
    elevation: 2,
    marginVertical: hp('2%'),
    backgroundColor:Colors.primary,
    alignItems:'center',
    padding: hp("1%"),
    width: wp('60%')
  },
  textBtn:{
    fontFamily:Fonts.SemiBold,
    fontSize:18,
    flex:1, 
    textAlign:'center',
    color:Colors.white
  },
});


class SmallButton extends PureComponent {

  render() {
    const { onPress, text, containerStyle,String,visible } = this.props;
    return (
      <TouchableOpacity style={{}} activeOpacity={visible ?1:1} onPress={visible ?null:onPress}>
      <View style={pageStyle.containerStyle,containerStyle}>
           {visible ?
            <ActivityIndicator
            size="small"          
            color={'white'}
          />:
          <Text style={pageStyle.textBtn}>
            {text}
           </Text>}
              
      </View>
     </TouchableOpacity>
    );
  }

}


SmallButton.propTypes = {
  containerStyle: PropTypes.object,
  onPress: PropTypes.func,
  String:PropTypes.any
};

SmallButton.defaultProps = {
  containerStyle: pageStyle.containerStyle
};


export default SmallButton;
