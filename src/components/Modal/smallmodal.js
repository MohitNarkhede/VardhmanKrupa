import React, { PureComponent } from "react";
import { StyleSheet, View, Platform, TouchableOpacity, Text, Modal, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import PropTypes from 'prop-types';
import Colors from "../../common/Colors";
import Fonts from "../../common/Fonts";
import SmallButton from './smallbutton';
import { ThemeContext } from "../ThemeProvider";
import { checkTheme } from "../../common/checkTheme";



class SmallModal extends PureComponent<props> {
  state = {
   
  };

  static contextType = ThemeContext;


  render() {

    const styles = (theme) => StyleSheet.create({
      titleView: {      
      
       flexDirection:'row',
       marginVertical:hp('1%'),
      },
      centeredView: {
        flex: 1,
        backgroundColor:'rgba(0,0,0,0.5)',
        justifyContent: "center",
        alignItems: "center",
      
      },
      modalView: {
        margin: 20,
        backgroundColor:checkTheme(theme).white,
        borderRadius: 10,
        padding: 10,
        width: wp('80%'),
        minHeight: hp('20%'),
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: checkTheme(theme).white,
        fontWeight: Fonts.SemiBold,
        textAlign: "center"
      },
      modalText: {
        fontFamily: Fonts.SemiBold,
        fontSize:20,
        color: checkTheme(theme).primary,
        textAlign: "center"
      },
      subtitle:{
        marginTop:10,
        fontFamily: Fonts.Regular,
        fontSize:16,
        color: checkTheme(theme).black,
        textAlign: "center"
      },
      desc:{
        fontFamily: Fonts.Regular,
        fontSize:16,
        color: checkTheme(theme).dark_gray,
        textAlign: "center",
        marginVertical:10,
      }
    
    });

        
    const {
      visible,
      containerStyle,
      subtitle,
      desc,
      title,
      onClose,
      btntext,
      onPress,
      yesbtntext,
      nobtntext,
      YesPress,
      NoPress,
      multiButton,
      ...otherProps
    } = this.props;

    return (
            <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={onClose}
        >
          <View style={styles(this.context.theme).centeredView}>
            <View style={styles(this.context.theme).modalView}>
            <View style={styles(this.context.theme).titleView}>
            <View style={{flex:1, flexDirection:'column', marginRight:-18,}}>
              <Text style={styles(this.context.theme).modalText}>{title}</Text>
              {/* <View style={{height:3.5, width: wp('25%'),  backgroundColor: Colors.medium_gray, borderRadius:10, alignSelf:'center'}} /> */}
              </View>
              <TouchableOpacity onPress={onClose} style={{height:35, width:35, marginHorizontal:10}}>
                  <Image style={{height:30, width:30, tintColor: checkTheme(this.context.theme).primary}} source={require('../../images/Close.png')} />
              </TouchableOpacity>
              </View>

              <View style={styles(this.context.theme).contentView}>
              {subtitle ?
                  <Text style={styles(this.context.theme).subtitle}>{subtitle}</Text>
                  : null }
                  {desc ? 
                  <Text style={styles(this.context.theme).desc}>{desc}</Text>
                  : null }
              </View>
              {/* <TouchableOpacity
                style={[styles(this.context.theme).button, styles(this.context.theme).buttonClose]}
                onPress={this.props.onClose}
              >
                <Text style={styles(this.context.theme).textStyle}>Hide Model</Text>
              </TouchableOpacity> */}
              {multiButton ? 
              <View style={{ width: wp('80%'),  flexDirection:'row', justifyContent:'center'}}>
               
              
            <TouchableOpacity activeOpacity={1} onPress={NoPress} style={{
                 borderRadius:5,
                 flexDirection:'row',
                 shadowColor: "#878787",
                 borderWidth:1,
                 borderColor: checkTheme(this.context.theme).medium_gray,
                 shadowOffset: {
                   width: 0,
                   height: 2
                 },

                 marginRight:5,
                 shadowOpacity: 0.2,
                 shadowRadius: 2.0,
                 elevation: 2,
                 marginVertical: hp('2%'),
                 backgroundColor:checkTheme(this.context.theme).white,
                 alignItems:'center',
                 padding: hp("1%"),
                 width: wp('35%')
               }} >
                <Text style={{
                  fontFamily:Fonts.SemiBold,
                  fontSize:18,
                  flex:1, 
                  textAlign:'center',
                  color:checkTheme(this.context.theme).black
                }}>
                  {nobtntext}
                </Text>
            </TouchableOpacity>
             
            <TouchableOpacity activeOpacity={1} onPress={YesPress} style={{
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
                 backgroundColor:checkTheme(this.context.theme).primary,
                 alignItems:'center',
                 padding: hp("1%"),
                 width: wp('35%')
               }}  >
                <Text style={{
                  fontFamily:Fonts.SemiBold,
                  fontSize:18,
                  flex:1, 
                  textAlign:'center',
                  color:checkTheme(this.context.theme).white
                }}>
                  {yesbtntext}
                </Text>
            </TouchableOpacity>
              </View>
              : 
              <SmallButton text={btntext} onPress={onPress}/>
   }
            </View>
          </View>
        </Modal>
    );
  }
}

SmallModal.propTypes = {
  containerStyle:PropTypes.any,
  
};

SmallModal.defaultProps = {
  visible: false,
  multiButton: false,
  title:'Alert'
  
};
export default SmallModal;
