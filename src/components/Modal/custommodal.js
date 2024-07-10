import React, { PureComponent } from "react";
import { StyleSheet, View, Platform, TouchableOpacity, Text, Modal, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import PropTypes from 'prop-types';
import Colors from "../../common/Colors";
import Fonts from "../../common/Fonts";
const styles = StyleSheet.create({
  titleView: {      
  
   flexDirection:'row',
   marginVertical:hp('1%'),
  },
  centeredView: {
    flex: 1,
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    width: wp('90%'),
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
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    flex:1,
    fontFamily: Fonts.SemiBold,
    fontSize:20,
    textAlign: "center"
  },
  subtitle:{
    marginTop:10,
    fontFamily: Fonts.Regular,
    fontSize:16,
    color: Colors.black,
    textAlign: "center"
  },
  desc:{
    fontFamily: Fonts.Regular,
    fontSize:16,
    color: Colors.dark_gray,
    textAlign: "center",
    marginVertical:10,
  }

});


class CustomModal extends PureComponent<props> {
  state = {
   
  };

  render() {
        
    const {
      visible,
      containerStyle,
      subtitle,
      desc,
      onClose,
      btntext,
      onPress,
      yesbtntext,
      nobtntext,
      YesPress,
      NoPress,
      multiButton,
      child,
      mainStyle,
      centerView,
      ...otherProps
    } = this.props;

    return (
            <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={onClose}
        >
          <View style={[styles.centeredView, centerView]}>
            <View style={[styles.modalView, mainStyle]}>
           
            {child}
    
            </View>
          </View>
        </Modal>
    );
  }
}

CustomModal.propTypes = {
  containerStyle:PropTypes.any,
  child: PropTypes.any
  
};

CustomModal.defaultProps = {
  visible: false,
  multiButton: false
  
};
export default CustomModal;
