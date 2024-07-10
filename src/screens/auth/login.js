
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
  ScrollView,
  Platform
} from 'react-native';
import Colors from '../../common/Colors';
import { CommonActions } from "@react-navigation/native";
import NetInfo from '@react-native-community/netinfo';
import API from '../../common/Api';
import Loader from '../../common/Loader';
import timeout from '../../common/timeout';
import Toast from 'react-native-simple-toast';
import Fonts from '../../common/Fonts';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Button from '../../components/button';
const { width, height } = Dimensions.get('window')
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FloatingLabelInput } from '../../components/floatinglabel';
import Background from '../../components/background';
import { checkTheme } from '../../common/checkTheme';
import { ThemeContext } from '../../components/ThemeProvider';
import FontSize from '../../common/FontSize';
import CountryPicker from "../../components/react-native-country-codes-picker-master/index";
import FetchAPI from '../../common/FetchAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Neomorph } from 'react-native-neomorph-shadows-fixes';
import * as Animatable from 'react-native-animatable';

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      user: null,
      phone: '',
      flag: '🇮🇳',
      code: '+91',
      phoneerror: null,
      disable: true,
      loading: false,
      loading1: false,
      countryvisible: false,
      copyright: '',
      sociallogin: 1,
      credentialStateForUser: -1,
      keyboardOpen: false,
    }
    this.authCredentialListener = null;
    this.user = null;

  }

  componentDidMount() {
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
    this.setState({ keyboardOpen: true });
  };

  _keyboardDidHide = () => {
    this.setState({ keyboardOpen: false });
  };

  componentWillUnmount() {
  }





  loginAPI = async () => {
    if(!this.state.phone || this.state.phone.length < 10){
      // this.setState({phoneerror :'Please enter phone number'})
      Toast.show('Please enter phone number')
    } else {
      Keyboard.dismiss()
      this.setState({ loading: true });
      var Request = {
        security: 1,
        phone: this.state.phone,
        type:2
      }

      const res = await FetchAPI(API.sendotp, "POST", Request);
      console.log(res);
      if (res.status == "success") {
        this.setState({ loading: false, phoneerror: "" })
        this.props.navigation.navigate("Verification", {otp: res.otp, phone: this.state.phone, type:2})
      } else {
        this.setState({ loading: false, phoneerror: res.message }, ()=> {
          if(res.type == 1){
            this.props.navigation.navigate('SignupOne', { type: 2, fname: '', lname: '', email: '', stoken: '', phone: this.state.phone }) 
          }
        })
      }

    }


  }


  render() {
    let { phone } = this.state;
    const theme = "light"
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white", }}>
        <StatusBar backgroundColor={checkTheme(theme).white} barStyle="dark-content" />
        <Loader loading={this.state.loading1} />
        {/* <KeyboardAwareScrollView keyboardShouldPersistTaps="handled"> */}
        <ScrollView>
          <View style={{ flex: 1 }}>
            {/* <TouchableOpacity onPress={()=> {
              this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                }),
            );
            }} style={{alignItems:'flex-end', padding:10}}>
            <Text style={{ fontFamily: Fonts.Light, color: checkTheme(theme).black, fontSize: FontSize.small,  paddingTop:5  }}>{"Skip"}</Text>

            </TouchableOpacity> */}
            <View
              style={{ margin: widthPercentageToDP('5%'), position: 'relative', zIndex: 9999 }}>

              <Animatable.View animation={"fadeInLeft"} delay={200} style={{ flexDirection: 'column', marginTop: heightPercentageToDP('2%'), }}>

                <Image
                  resizeMode={'contain'}
                  style={{ height: height * .18, width: height * .18 }}
                  source={require('../../images/logoicon.png')} />
              </Animatable.View>
              <Text style={{ fontFamily: Fonts.Bold, color: checkTheme(theme).black, fontSize: FontSize.large, marginTop: 10 }}>{"Welcome to Vardhman Krupa"}</Text>
              <Text style={{ fontFamily: Fonts.Regular, color: checkTheme(theme).black, fontSize: FontSize.small, marginBottom: heightPercentageToDP('3%'), paddingLeft: 5, paddingTop: 2, }}>{"Sign in to continue"}</Text>

              <FloatingLabelInput
                label="Enter Mobile Number"
                value={phone}
                maxLength={10}
                keyboardType="numeric"
                error={this.state.phoneerror}
                onChangeText={value => {
                  this.setState({ phone: value, phoneerror: null }, () => {
                    if (value.length > 4) {
                      this.setState({ disable: false })
                    } else {
                      this.setState({ disable: true })
                    }
                  })
                }}


              />





              <Button visible={this.state.loading} disable={this.state.disable} text="Login" onPress={() => {
                this.loginAPI()
              }} />




            </View>



            <View style={{ alignSelf: 'baseline', flexDirection: 'row', marginHorizontal: widthPercentageToDP('5%'), paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: Fonts.Regular, fontSize: 14, color: checkTheme(theme).black }}>{"By signin, you agree to VardhmanKrupa's "}
                <Text onPress={() => { Linking.openURL('https://www.vardhmankrupa.com/terms-condition') }} style={{ fontFamily: Fonts.Bold, fontSize: 14, color: checkTheme(theme).black, textDecorationLine: 'underline' }}>{"Terms And Conditions "}</Text> {"and "}
                <Text onPress={() => { Linking.openURL('https://www.vardhmankrupa.com/privacy-policy') }} style={{ fontFamily: Fonts.Bold, fontSize: 14, color: checkTheme(theme).black, textDecorationLine: 'underline' }}>{"Privacy Policy"}</Text></Text>
            </View>




          </View>
        </ScrollView>

        {
          !this.state.keyboardOpen && (
        
        <View style={{ marginHorizontal: widthPercentageToDP('5%'), alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: heightPercentageToDP('6%'), marginBottom: heightPercentageToDP('4%') }}>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('SignupOne', { type: 2, fname: '', lname: '', email: '', stoken: '', phone:'' }) }} style={{ flex: 1, marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
            <Text style={{
              fontFamily: Fonts.Regular,
              fontSize: FontSize.lmedium,
              textAlign: 'left',
              color: checkTheme(theme).dark_gray
            }}>
              Don’t have an account?
            </Text>
            <Text style={{
              fontFamily: Fonts.Bold,
              fontSize: FontSize.lmedium,
              textAlign: 'center',
              marginLeft: 5,
              color: checkTheme(theme).black
            }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
          )}

        {/* </KeyboardAwareScrollView> */}

        {/* <Background /> */}
        {
          !this.state.keyboardOpen && (
        <Image style={{ height: height * .35, width: width, position: 'absolute', bottom: 0, zIndex: -1, right: 0 }}
          resizeMode="cover" source={require('../../images/back4.png')} />
          )}

      </SafeAreaView>

    )
  }


}
