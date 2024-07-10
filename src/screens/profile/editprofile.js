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
  Alert,
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
import CountryPicker from '../../components/react-native-country-codes-picker-master/index';
import FetchAPI from '../../common/FetchAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CityModal from '../../components/CityModal/CityModal';
import {countryCodes} from '../../components/react-native-country-codes-picker-master/constants/countryCodes';
import StateModal from '../../components/CityModal/StateModal';

export default class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      check: false,

      phone: '',
      name: '',
      cname: '',
      city: 'Select City',
      cityid: '',
      cityModal: false,
      cityData: [],
      state: 'Select State',
      stateid: '',
      stateModal: false,
      stateData: [],
    };
  }

  componentDidMount() {
    this.profileAPI();
    this.fetchState();
  }

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

  profileAPI = async () => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
      };
    }
    this.setState({loading: true});
    const res = await FetchAPI(API.profile, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({
        name: res.data.name,
        cname: res.data.company_name,
        phone: res.data.phone,
        city: res.data.city ? res.data.city : 'Select City',
        cityid: res.data.city_id,
        state: res.data.state ? res.data.state : 'Select State',
        stateid: res.data.state_id,
        loading: false,
      });
    } else if (res.status == 'failed') {
      AsyncStorage.removeItem('id');
      AsyncStorage.removeItem('user');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
      this.setState({loading: false});
    } else {
      // Toast.show(res.message)
      this.setState({loading: false, orders: []});
    }
  };

  uprofileAPI = async () => {
    if (!this.state.name) {
      Toast.show('Please enter your full name');
    } else if (!this.state.stateid) {
      Toast.show('Please select your state');
    } else if (!this.state.cityid) {
      Toast.show('Please select your city');
    } else {
      let id = await AsyncStorage.getItem('id');
      let token = await AsyncStorage.getItem('token');
      var Request = {
        security: 1,
        token: JSON.parse(token),
        name: this.state.name,
        city: this.state.cityid,
        state: this.state.stateid,
      };
      if (id) {
        Request = {
          security: 0,
          token: JSON.parse(token),
          id: JSON.parse(id),
          name: this.state.name,
          city: this.state.cityid,
          state: this.state.stateid,
        };
      }
      this.setState({loading: true});
      const res = await FetchAPI(API.profile_update, 'POST', Request);
      console.log(res);
      if (res.status == 'success') {
        this.setState({loading: false});
        setTimeout(() => {
          Toast.show(res.message);
        }, 200);
      } else if (res.status == 'failed') {
        AsyncStorage.removeItem('id');
        AsyncStorage.removeItem('user');
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Home'}],
          }),
        );
        this.setState({loading: false});
      } else {
        // Toast.show(res.message)
        this.setState({loading: false, orders: []});
      }
    }
  };

  acdeleteAPI = async () => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      user_id: JSON.parse(id),
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        user_id: JSON.parse(id),
      };
    }
    this.setState({loading: true});
    const res = await FetchAPI(API.account_delete, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({loading: false});
      setTimeout(() => {
        Toast.show(res.message);
      }, 200);
      AsyncStorage.removeItem('id');
      AsyncStorage.removeItem('user');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
    } else if (res.status == 'failed') {
      AsyncStorage.removeItem('id');
      AsyncStorage.removeItem('user');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
      this.setState({loading: false});
    } else {
      // Toast.show(res.message)
      this.setState({loading: false});
    }
  };

  render() {
    let {phone, name, cname} = this.state;
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
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: widthPercentageToDP('2%'),
                    paddingRight: widthPercentageToDP('5%'),
                    paddingTop: Platform.OS == 'ios' ? 15 : 35,
                    paddingBottom: 10,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.goBack()}
                      style={{padding: 5}}>
                      <Image
                        style={{
                          height: 28,
                          width: 28,
                          tintColor: checkTheme(theme).black,
                        }}
                        resizeMode="contain"
                        source={require('../../images/leftarrow.png')}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: Fonts.SemiBold,
                        fontSize: FontSize.medium,
                        color: checkTheme(theme).black,
                      }}>
                      {'Profile'}
                    </Text>
                  </View>
                </View>
                <View style={{margin: widthPercentageToDP('5%')}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontFamily: Fonts.Bold,
                        color: checkTheme(theme).primarydark,
                        fontSize: FontSize.large,
                      }}>
                      {'Hey There !'}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      color: checkTheme(theme).black,
                      fontSize: FontSize.small,
                      marginBottom: heightPercentageToDP('3%'),
                    }}>
                    {'Fill the following details to update your profile.'}
                  </Text>

                  <FloatingLabelInput
                    label="Full Name*"
                    value={name}
                    error={this.state.nameerr}
                    onChangeText={value => {
                      this.setState({name: value, nameerr: null});
                    }}
                  />

                  <FloatingLabelInput
                    label="Phone*"
                    value={phone}
                    keyboardType="numeric"
                    editable={false}
                    error={this.state.phoneerror}
                    onChangeText={value => {
                      this.setState({phone: value, phoneerror: null});
                    }}
                  />

                  <FloatingLabelInput
                    label="Company Name*"
                    value={cname}
                    editable={false}
                    onChangeText={value => {
                      this.setState({cname: value, cnameerr: null});
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
                </View>
              </KeyboardAwareScrollView>
              <View style={{alignItems: 'center'}}>
                <Button
                  visible={this.state.loading}
                  disable={false}
                  text="Submit"
                  onPress={() => {
                    this.uprofileAPI();
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Notice',
                    'Are you sure want to delete your account?',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          this.acdeleteAPI();
                        },
                      },
                    ],
                  );
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  marginBottom: 20,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.Regular,
                    color: checkTheme(theme).red,
                    textDecorationLine: 'underline',
                    fontSize: 14,
                    padding: 10,
                  }}>
                  {'Delete your account'}
                </Text>
              </TouchableOpacity>
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
