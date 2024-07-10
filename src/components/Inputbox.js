import React, { PureComponent, useContext } from "react";
import { StyleSheet, TextInput, View, Platform, Image, TouchableOpacity, Text } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Icon } from "native-base";
import PropTypes from 'prop-types';
import Colors from "../common/Colors";
import Fonts from "../common/Fonts";
import { checkTheme } from "../common/checkTheme";
import { ThemeContext } from "./ThemeProvider";

const textInputPadding = Platform.OS === "ios" ? hp('2%') : hp('0.4%');


class InputBox extends PureComponent<props> {
  state = {
    isFocused: false,
    isError: false,
    textColor: checkTheme(this.context.theme).black,
    borderColor: checkTheme(this.context.theme).textinput
  };

  static contextType = ThemeContext;


  handleFocus = event => {
    this.setState({ isFocused: true, textColor: checkTheme(this.context.theme).primary,  borderColor: checkTheme(this.context.theme).primary });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleBlur = event => {
    this.setState({ isFocused: false, textColor: checkTheme(this.context.theme).black, isError: false,  borderColor: checkTheme(this.context.theme).textinput });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  getInnerRef = () => this.ref;
  static contextType = ThemeContext;
  render() {

    const { isFocused, isError } = this.state;

    const {
      leftIcon,
      containerStyle,
      containerFinalStyle,
      returnKeyType,
      leftimage,
      autoCapitalize,
      selectionColor,
      placeholderTextColor,
      multiline,
      textInputstyle,
      rightPress,
      rightimage,
      imagecolor,
      value,
      editable,
      label,
      secureTextEntry,
      maxLength,
      placeholder,
      theme,
      smallmultiline = false,
      ...otherProps
    } = this.props;




    const pageStyle = (theme) => StyleSheet.create({
      container: {
        flexDirection: "row",
        marginTop: 5,
        borderRadius: 10,
        width: wp('90%'),
        alignSelf:'center',
        backgroundColor: checkTheme(this.context.theme).textinput,
        borderBottomWidth: 1,
        alignItems:'center',
        // justifyContent:'center',
        borderBottomColor: this.state.borderColor,
        paddingHorizontal: 5,
        paddingVertical: 8
      },
      label: { fontFamily: Fonts.Regular, width: widthPercentageToDP('25%'), fontSize: 14, textAlign: 'left', color: checkTheme(this.context.theme).black, paddingLeft: 5, },
      textInput: {
        width: wp('60%'),
        fontSize: 14,
        fontFamily: Fonts.Regular,
        color: checkTheme(theme).black,
        padding: 3,
        paddingLeft:10,
      },
      focusStyle: {

      },
      errorStyle: {
        borderColor: checkTheme(theme).error,
        borderWidth: 1,
      },

    });


    return (
      <View style={[pageStyle(this.context.theme).container, isFocused ? pageStyle(this.context.theme).focusStyle : null, !editable ? containerStyle : null,
      isError ? pageStyle(this.context.theme).errorStyle : null, containerFinalStyle]}>
        <Text style={[pageStyle(this.context.theme).label, {color: editable ? checkTheme(this.context.theme).black : checkTheme(this.context.theme).medium_gray }]}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: "center", paddingVertical: 4, }}>
     
          <TextInput
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor ? placeholderTextColor :'#666'}
            editable={editable}
            selection={this.state.isFocused ? undefined : { start: 0 }}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            selectionColor={selectionColor}
            style={[pageStyle(this.context.theme).textInput, { minHeight: multiline ? smallmultiline ? 60 : 240 : null, textAlignVertical: multiline ? "top" : null, color: editable ? checkTheme(this.context.theme).black : checkTheme(this.context.theme).medium_gray }, textInputstyle]}
            multiline={multiline}
            maxLength={maxLength}
            allowFontScaling={false}
            value={value}
            returnKeyType={returnKeyType}
            spellCheck={false}
            ref={r => (this.ref = r)}
            {...otherProps}
          />
        
        </View>
      </View>
    );
  }
}

InputBox.propTypes = {
  containerStyle: PropTypes.any,
  textInputstyle: PropTypes.object,
  leftimage: PropTypes.any,
  multiline: PropTypes.bool,
  returnKeyType: PropTypes.string,
  autoCapitalize: PropTypes.string,
  selectionColor: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  rightPress: PropTypes.func,
  rightimage: PropTypes.any,
  value: PropTypes.any,
  imagecolor: PropTypes.string,
  placeholder: PropTypes.string
};

InputBox.defaultProps = {
  returnKeyType: 'next',
  editable: true,
  autoCapitalize: 'none',
  selectionColor: "#c3d3d4",
};
export default InputBox;
