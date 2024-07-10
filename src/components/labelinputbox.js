import React, { PureComponent, useContext } from "react";
import { StyleSheet, TextInput, View, Platform, Image, TouchableOpacity, Text } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Icon } from "native-base";
import PropTypes from 'prop-types';
import Colors from "../common/Colors";
import Fonts from "../common/Fonts";
import { checkTheme } from "../common/checkTheme";
import { ThemeContext } from "./ThemeProvider";

const textInputPadding = Platform.OS === "ios" ? hp('2%') : hp('0.4%');


class LabelInputBox extends PureComponent<props> {
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
        flexDirection: "column",
        marginTop: 15,
        borderRadius: 10,
        width: wp('90%'),
        backgroundColor: checkTheme(this.context.theme).textinput,
        borderBottomWidth: 1,
        borderBottomColor: this.state.borderColor,
        paddingHorizontal: 5,
        paddingVertical: 10
      },
      label: { fontFamily: Fonts.Regular, fontSize: 15, textAlign: 'left', color: checkTheme(this.context.theme).black, paddingLeft: 10, },
      textInput: {
        flex: 0.85,
        fontSize: 16,
        fontFamily: Fonts.Regular,
        color: checkTheme(theme).black,
        paddingVertical: 5
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
      isError ? pageStyle(this.context.theme).errorStyle : null]}>
        <Text style={[pageStyle(this.context.theme).label, {color: editable ? checkTheme(this.context.theme).black : checkTheme(this.context.theme).medium_gray }]}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: "center", paddingVertical: 5, }}>
          {leftimage ? <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <Image
              resizeMode={'contain'}
              style={{ height: 20, width: 20, tintColor: checkTheme(this.context.theme).black }}
              source={leftimage} />

            <View style={{ width: 0.5, minHeight: 25, backgroundColor: '#333', marginLeft: 8, }} />
          </View> : null}
          <TextInput
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            placeholder={placeholder}
            placeholderTextColor={'#666'}
            editable={editable}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            selectionColor={selectionColor}
            style={[pageStyle(this.context.theme).textInput, { minHeight: multiline ? smallmultiline ? 120 : 240 : null, textAlignVertical: multiline ? "top" : null, color: editable ? checkTheme(this.context.theme).black : checkTheme(this.context.theme).medium_gray }, textInputstyle]}
            multiline={multiline}
            maxLength={maxLength}
            value={value}
            allowFontScaling={false}
            returnKeyType={returnKeyType}
            spellCheck={false}
            ref={r => (this.ref = r)}
            {...otherProps}
          />
          {rightimage ?
            <View style={{ flex: 0.15 }}>
              <TouchableOpacity onPress={rightPress}>
                <Image
                  resizeMode={'contain'}
                  style={{ height: 18, width: 18, tintColor: imagecolor ? imagecolor : undefined }}
                  source={rightimage} />
              </TouchableOpacity>
            </View>
            : null}
        </View>
      </View>
    );
  }
}

LabelInputBox.propTypes = {
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

LabelInputBox.defaultProps = {
  returnKeyType: 'next',
  editable: true,
  autoCapitalize: 'none',
  selectionColor: "#c3d3d4",
};
export default LabelInputBox;
