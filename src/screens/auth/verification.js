import React from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Keyboard,
  TextInput,
  Platform,
} from 'react-native';
import Colors from '../../common/Colors';
import {CommonActions} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import API from '../../common/Api';
import Loader from '../../common/Loader';
import timeout from '../../common/timeout';
import Toast from 'react-native-simple-toast';
import Fonts from '../../common/Fonts';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Button from '../../components/button';
const {width, height} = Dimensions.get('window');
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {FloatingLabelInput} from '../../components/floatinglabel';
import Background from '../../components/background';
import {checkTheme} from '../../common/checkTheme';
import {ThemeContext} from '../../components/ThemeProvider';
import FontSize from '../../common/FontSize';
import SmoothPinCodeInput from '../../components/smoothpincodeinput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import FetchAPI from '../../common/FetchAPI';

let apiLevel = '';
let os = '';
let battery = '';
let brand = '';
let carrier = '';
let device = '';
let ip = '';
let mac_address = '';
let manufacturer = '';
let model = '';

export default class Verification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      timer: 59,
      loading: false,
      disable: false,
      errmessage: null,
      phone: this.props.route.params.phone,
      VerifyOtp: this.props.route.params.otp,
      keyboardOpen: false,
    };
    this.setTimer();
  }

  setTimer = () => {
    this.clearTimer();
    this.interval = setInterval(() => {
      if (this.state.timer == 0) {
        this.clearTimer();
      } else {
        this.setState({timer: this.state.timer - 1});
      }
    }, 1000);
    // console.log(this.interval);
    setTimeout(() => {
      this.setState({intervalId: this.interval}, () => {
        // console.log("Hello", this.state.intervalId, this.interval)
      });
    }, 1000);
  };

  clearTimer = () => {
    if (this.state.timer === 0) {
      clearInterval(this.interval);
      this.setState({intervalId: null});
    }
  };

  isValid = () => {
    Keyboard.dismiss();

    console.log(this.state.otp, this.state.VerifyOtp);
    if (this.state.otp == this.state.VerifyOtp) {
      if (this.props.route.params.type == 1) {
        this.registerAPI();
      } else {
        this.loginAPI();
      }
    } else {
      this.setState({loading: false});
      Toast.show('INVALID OTP', Toast.SHORT);
    }
  };

  loginAPI = async () => {
    const {phone} = this.props.route.params;
    let token = await AsyncStorage.getItem('token');
    this.setState({loading: true});
    var Request = {
      security: 1,
      phone: phone,
      token: JSON.parse(token),
      apilevel: apiLevel,
      os: os,
      battery: battery * 100,
      brand: brand,
      carrier: carrier,
      device: device,
      ip: ip,
      mac_address: mac_address,
      manufacturer: manufacturer,
      model: model,
    };
    console.log(Request);
    const res = await FetchAPI(API.login, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({loading: false});
      AsyncStorage.setItem('id', JSON.stringify(res.data.id));
      AsyncStorage.setItem('user', JSON.stringify(res.data));

      if (res?.data?.status == 0) {
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Request',
                params: {
                  title: res.title,
                  desc: res.desc,
                  user_request_status: res.user_request_status,
                },
              },
            ],
          }),
        );
      } else {
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Home'}],
          }),
        );
      }
    } else {
      Toast.show(res.message);
      this.setState({loading: false});
    }
  };

  sendotpAPI = async () => {
    let token = await AsyncStorage.getItem('token');
    Keyboard.dismiss();
    this.setState({loading: true});
    var Request = {
      security: 1,
      phone: this.props.route.params.phone,
      token: JSON.parse(token),
      type: this.props.route.params.type,
    };
    console.log(Request);
    const res = await FetchAPI(API.sendotp, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({loading: false, VerifyOtp: res.otp, timer: 59}, () => {
        this.setTimer();
      });
    } else {
      this.setState({loading: false});
    }
  };

  async componentDidMount() {
    apiLevel = await DeviceInfo.getApiLevel();
    os = await Platform.OS;
    battery = await DeviceInfo.getBatteryLevel();
    brand = await DeviceInfo.getBrand();
    carrier = await DeviceInfo.getCarrier();
    device = await DeviceInfo.getDevice();
    ip = (await NetInfo.fetch()).details.ipAddress;
    mac_address = await DeviceInfo.getMacAddress();
    manufacturer = await DeviceInfo.getManufacturer();
    model = await DeviceInfo.getModel();

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  _keyboardDidShow = () => {
    this.setState({keyboardOpen: true});
  };

  _keyboardDidHide = () => {
    this.setState({keyboardOpen: false});
  };

  registerAPI = async () => {
    const {email, user, phone, name, cname, cityid, stateid} =
      this.props.route.params;
    let token = await AsyncStorage.getItem('token');
    this.setState({loading: true});
    var Request = {
      security: 1,
      phone: phone,
      name: name,
      cname: cname,
      city: cityid,
      state: stateid,
      token: JSON.parse(token),
      apilevel: apiLevel,
      os: os,
      battery: battery * 100,
      brand: brand,
      carrier: carrier,
      device: device,
      ip: ip,
      mac_address: mac_address,
      manufacturer: manufacturer,
      model: model,
    };
    console.log(Request);
    const res = await FetchAPI(API.register, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({loading: false});
      if (res?.data?.status == 0) {
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Request',
                params: {
                  title: res.title,
                  desc: res.desc,
                  user_request_status: res.user_request_status,
                },
              },
            ],
          }),
        );
      } else {
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Home'}],
          }),
        );
      }

      AsyncStorage.setItem('id', JSON.stringify(res.data.id));
      AsyncStorage.setItem('user', JSON.stringify(res.data));
    } else {
      Toast.show(res.message);
      this.setState({loading: false});
    }
  };

  render() {
    let {email, phone} = this.state;
    return (
      <ThemeContext.Consumer>
        {context => {
          const theme = context.theme;
          return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
              <StatusBar
                backgroundColor={checkTheme(theme).white}
                barStyle="dark-content"
              />
              <Loader loading={this.state.loading} />
              <KeyboardAwareScrollView>
                <TouchableOpacity
                  style={{padding: 10}}
                  onPress={() => this.props.navigation.goBack()}>
                  <Image
                    resizeMode="contain"
                    source={require('../../images/arrowleft.png')}
                    style={{width: 28, height: 28}}
                  />
                </TouchableOpacity>

                <View style={{marginHorizontal: widthPercentageToDP('5%')}}>
                  <Image
                    resizeMode="contain"
                    source={require('../../images/otp.jpg')}
                    style={{
                      width: widthPercentageToDP('80%'),
                      alignSelf: 'center',
                      height: widthPercentageToDP('60%'),
                    }}
                  />

                  <Text
                    style={{
                      fontFamily: Fonts.Bold,
                      color: checkTheme(theme).primarydark,
                      fontSize: FontSize.large,
                    }}>
                    {'Enter OTP'}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      color: checkTheme(theme).black,
                      fontSize: FontSize.small,
                      marginBottom: heightPercentageToDP('2%'),
                    }}>
                    {'OTP has been sent to +91 ' +
                      this.state.phone.replace(/\d(?=\d{4})/g, '*') +
                      ' \nnumber.'}
                  </Text>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      marginHorizontal: widthPercentageToDP('1%'),
                    }}>
                    <SmoothPinCodeInput
                      placeholder={''}
                      containerStyle={{
                        zIndex: 999,
                        marginTop: 5,
                        marginBottom: 10,
                        // backgroundColor:'red',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}
                      cellStyle={{
                        height: widthPercentageToDP('14%'),
                        width: widthPercentageToDP('14%'),
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: this.state.errmessage
                          ? '#FF3B3B'
                          : checkTheme(theme).dark_gray,
                      }}
                      cellStyleFocused={{
                        borderWidth: 1,
                        borderColor: this.state.errmessage
                          ? '#FF3B3B'
                          : checkTheme(theme).primary,
                      }}
                      cellSpacing={5}
                      textStyle={{
                        fontSize: 24,
                        color: checkTheme(theme).black,
                      }}
                      textStyleFocused={{
                        color: checkTheme(theme).white,
                      }}
                      codeLength={6}
                      password={false}
                      value={this.state.otp}
                      onTextChange={otp =>
                        this.setState({otp, errmessage: null}, () => {
                          if (this.state.otp.length > 3) {
                            this.setState({disable: false});
                          } else {
                            this.setState({disable: true});
                          }
                          if (this.state.otp.length === 6) {
                            this.isValid();
                          }
                        })
                      }
                    />

                    {this.state.errmessage && (
                      <Text
                        style={{
                          color: '#FF3B3B',
                          fontFamily: Fonts.Regular,
                          fontSize: 12,
                          textAlign: 'left',
                          paddingHorizontal: 5,
                        }}>
                        {this.state.errmessage}
                      </Text>
                    )}
                  </View>
                </View>
              </KeyboardAwareScrollView>
              {/* <Button visible={this.state.loading} disable={this.state.disable} text="Continue" onPress={() => {
                            this.loginAPI()
                        }} /> */}

              {!this.state.keyboardOpen && (
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      fontSize: 16,
                      color: checkTheme(theme).dark_gray,
                      textAlign: 'left',
                    }}>
                    Didn’t receive OTP?
                  </Text>
                  <TouchableOpacity
                    activeOpacity={this.state.intervalId ? 1 : 0.6}
                    style={{}}
                    onPress={() => {
                      if (this.state.intervalId) {
                      } else {
                        let mobile = this.state.code + this.state.phone;
                        auth()
                          .signInWithPhoneNumber(mobile)
                          .then(confirmResult => {
                            console.log(confirmResult);
                            this.setState(
                              {timer: 59, confirmResult: confirmResult},
                              () => {
                                this.setTimer();
                              },
                            );
                          })
                          .catch(error => {
                            console.log(error);
                            this.setState({
                              phoneerror: `Sign In With Phone Number Error: ${error.message}`,
                              loading: false,
                            });
                          });
                        // this.sendOtp()
                      }
                    }}>
                    {this.state.intervalId ? (
                      <Text
                        style={{
                          fontFamily: Fonts.Regular,
                          fontSize: 16,
                          textAlign: 'left',
                          marginLeft: 5,
                          color: checkTheme(theme).black,
                        }}>
                        00:
                        {this.state.timer < 10
                          ? '0' + this.state.timer
                          : this.state.timer}{' '}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontFamily: Fonts.Bold,
                          fontSize: 16,
                          textAlign: 'left',
                          marginLeft: 5,
                          color: checkTheme(theme).black,
                        }}>
                        {'Resend OTP'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {!this.state.keyboardOpen && (
                <Image
                  style={{
                    height: height * 0.35,
                    width: width,
                    position: 'absolute',
                    bottom: 0,
                    zIndex: -1,
                    right: 0,
                  }}
                  resizeMode="cover"
                  source={require('../../images/back4.png')}
                />
              )}
            </SafeAreaView>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
