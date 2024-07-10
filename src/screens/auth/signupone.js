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
import CityModal from '../../components/CityModal/CityModal';
import FetchAPI from '../../common/FetchAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StateModal from '../../components/CityModal/StateModal';

export default class SignupOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      cname: '',
      // lname: this.props.route.params.lname,
      // email: this.props.route.params.email,
      // type: this.props.route.params.type,
      // stoken: this.props.route.params.stoken,
      phone: this.props.route.params.phone,
      phoneerror: null,
      age: '',
      city: 'Select City',
      cityid: '',
      cityModal: false,
      cityData: [],
      state: 'Select State',
      stateid: '',
      stateModal: false,
      stateData: [],
      keyboardOpen: false,

      // city: 'Select City',
      // cityid: '',
      // nameerr: null,
      // lnameerr: null,
      // ageerr: null,
      // cityerror: null,
      // gendererror: null,
      // gender: '',
      // disable: false,
      // cityModal: false,
      // cityData: []
    };
  }

  componentDidMount() {
    this.fetchState();

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

  fetchState = async value => {
    var Request = {
      security: 1,
    };
    this.setState({loading: true});

    fetch(API.states, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Request),
    })
      .then(res => res.json())
      .then(res => {
        console.log('state api:::  ', res);
        this.setState({loading: false, stateData: res.data});
      })
      .catch(e => {
        console.log('i', e);
        Toast.show('Something went wrong...', Toast.SHORT);
        this.setState({loading: false});
      });
  };

  fetchCity = async value => {
    var Request = {
      security: 1,
      state: value,
    };
    this.setState({loading: true});

    fetch(API.cities, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Request),
    })
      .then(res => res.json())
      .then(res => {
        console.log('login api:::  ', res);
        this.setState({loading: false, cityData: res.data, cityModal: true});
      })
      .catch(e => {
        console.log('i', e);
        Toast.show('Something went wrong...', Toast.SHORT);
        this.setState({loading: false});
      });
  };

  loginAPI = async () => {
    let token = await AsyncStorage.getItem('token');
    if (!this.state.name) {
      Toast.show('Please enter full name');
    } else if (!this.state.cname) {
      Toast.show('Please enter company name');
    } else if (!this.state.phone || this.state.phone.length < 10) {
      Toast.show('Please enter phone number');
    } else if (!this.state.stateid) {
      Toast.show('Please select your state');
    } else if (!this.state.cityid) {
      Toast.show('Please select your city');
    } else {
      Keyboard.dismiss();
      this.setState({loading: true});
      var Request = {
        security: 1,
        token: JSON.parse(token),
        phone: this.state.phone,
        type: 1,
      };

      const res = await FetchAPI(API.sendotp, 'POST', Request);
      console.log(res);
      if (res.status == 'success') {
        this.setState({loading: false, phoneerror: ''});
        this.props.navigation.navigate('Verification', {
          otp: res.otp,
          phone: this.state.phone,
          type: 1,
          name: this.state.name,
          cname: this.state.cname,
          cityid: this.state.cityid,
          stateid: this.state.stateid,
        });
      } else {
        this.setState({loading: false, phoneerror: res.message});
      }
    }
  };

  render() {
    let {name, phone, cname} = this.state;
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
              <KeyboardAwareScrollView>
                <View style={{margin: widthPercentageToDP('5%')}}>
                  <Text
                    style={{
                      fontFamily: Fonts.Bold,
                      color: checkTheme(theme).primarydark,
                      fontSize: FontSize.large,
                      marginTop: heightPercentageToDP('3%'),
                    }}>
                    {'Signup with details'}
                  </Text>

                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      color: checkTheme(theme).black,
                      fontSize: FontSize.small,
                      marginBottom: heightPercentageToDP('3%'),
                    }}>
                    {'Enter your details and let’s get started'}
                  </Text>

                  <FloatingLabelInput
                    label="Your FULL Name"
                    value={name}
                    error={this.state.nameerr}
                    onChangeText={value => {
                      this.setState({name: value, nameerr: null});
                    }}
                  />
                  <FloatingLabelInput
                    label="Your Company Name"
                    value={cname}
                    error={this.state.cnameerr}
                    onChangeText={value => {
                      this.setState({cname: value, cnameerr: null});
                    }}
                  />
                  <FloatingLabelInput
                    label="Enter Mobile Number"
                    value={phone}
                    maxLength={10}
                    keyboardType="numeric"
                    error={this.state.phoneerror}
                    onChangeText={value => {
                      this.setState({phone: value, phoneerror: null}, () => {
                        if (value.length > 4) {
                          this.setState({disable: false});
                        } else {
                          this.setState({disable: true});
                        }
                      });
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      minHeight: 48,
                      borderWidth: 1,
                      borderColor:
                        this.state.state == 'Select State' ? 'gray' : 'black',
                      marginTop: 10,
                      paddingHorizontal: 10,
                      backgroundColor: '#fff',
                      borderRadius: 10,
                    }}
                    onPress={() => this.onShowState()}>
                    <Text
                      style={{
                        color:
                          this.state.state == 'Select State'
                            ? '#606060'
                            : '#000',
                        fontSize: 14,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        fontFamily: Fonts.Regular,
                        zIndex: 10,
                      }}>
                      {this.state.state}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      minHeight: 48,
                      borderWidth: 1,
                      borderColor:
                        this.state.city == 'Select City' ? 'gray' : 'black',
                      marginTop: 10,
                      paddingHorizontal: 10,
                      backgroundColor: '#fff',
                      borderRadius: 10,
                    }}
                    onPress={() => this.onShowCity()}>
                    <Text
                      style={{
                        color:
                          this.state.city == 'Select City' ? '#606060' : '#000',
                        fontSize: 14,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        fontFamily: Fonts.Regular,
                        zIndex: 10,
                      }}>
                      {this.state.city}
                    </Text>
                  </TouchableOpacity>

                  {/* <View style={{ flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 5, marginBottom: 10 }}>
              <Text style={{ fontFamily: Fonts.Regular, fontSize: 16, color: Colors.black }}>{"By proceeding, I agree to the "}</Text>
              <Text style={{ fontFamily: Fonts.Regular, fontSize: 16, color: Colors.primary }}>{"T&C"}</Text>
            </View> */}
                </View>
              </KeyboardAwareScrollView>

              {!this.state.keyboardOpen && (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginHorizontal: widthPercentageToDP('5%'),
                      marginTop: heightPercentageToDP('1%'),
                      paddingHorizontal: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.Regular,
                        fontSize: 14,
                        color: checkTheme(theme).black,
                      }}>
                      {'By register, you agree to VardhmanKrupa’s '}
                      <Text
                        onPress={() => {
                          Linking.openURL(
                            'https://www.vardhmankrupa.com/terms-condition',
                          );
                        }}
                        style={{
                          fontFamily: Fonts.Bold,
                          fontSize: 14,
                          color: checkTheme(theme).black,
                          textDecorationLine: 'underline',
                        }}>
                        {'Terms And Conditions '}
                      </Text>{' '}
                      {'and '}
                      <Text
                        onPress={() => {
                          Linking.openURL(
                            'https://www.vardhmankrupa.com/privacy-policy',
                          );
                        }}
                        style={{
                          fontFamily: Fonts.Bold,
                          fontSize: 14,
                          color: checkTheme(theme).black,
                          textDecorationLine: 'underline',
                        }}>
                        {'Privacy Policy'}
                      </Text>
                    </Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Button
                      visible={this.state.loading}
                      disable={false}
                      text="Register"
                      onPress={() => {
                        this.loginAPI();
                      }}
                    />
                  </View>
                </>
              )}

              {!this.state.keyboardOpen && (
                <Image
                  style={{
                    height: height * 0.35,
                    width: width,
                    position: 'absolute',
                    bottom: 40,
                    zIndex: -1,
                    right: 0,
                  }}
                  resizeMode="cover"
                  source={require('../../images/back4.png')}
                />
              )}

              <CityModal
                visible={this.state.cityModal}
                onSelect={this.onSelectCity}
                onCancel={this.onCancelCity}
                options={this.state.cityData}
                navigation={this.state.navigation}
              />
              <StateModal
                visible={this.state.stateModal}
                onSelect={this.onSelectState}
                onCancel={this.onCancelState}
                options={this.state.stateData}
                stateid={this.state.stateid}
                navigation={this.state.navigation}
              />
            </SafeAreaView>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
  onShowCity = () => {
    this.setState({cityModal: true});
  };

  onSelectCity = (id, name) => {
    console.log(id, name);
    this.setState({cityid: id, city: name, cityModal: false, cityerror: false});
  };

  onCancelCity = () => {
    this.setState({
      cityModal: false,
    });
  };

  onShowState = () => {
    this.setState({stateModal: true});
  };

  onSelectState = (id, name) => {
    console.log(id, name);
    this.setState(
      {
        stateid: id,
        state: name,
        stateModal: false,
        city: 'Select City',
        cityid: '',
        stateerror: false,
      },
      () => {
        this.fetchCity(id);
        this.onShowCity();
      },
    );
  };

  onCancelState = () => {
    this.setState({
      stateModal: false,
    });
  };
}
