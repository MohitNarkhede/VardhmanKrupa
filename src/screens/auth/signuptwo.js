
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
    TextInput
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
import  CountryPicker  from "../../components/react-native-country-codes-picker-master/index";
import FetchAPI from '../../common/FetchAPI';

export default class SignupTwo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            check: false,
            email: this.props.route.params.item.email,
            flag:'🇮🇳',
            code:'+91',
            phone: '',
            countryvisible: false
        }

    }

    componentDidMount() {
        // console.log(this.props.route.params.item);
    }


    checkEmailAPI = async () => {

        this.setState({ loading: true });
        var Request = {
          security: 1,
          email: this.state.email,
        }
    
        const res = await FetchAPI(API.check_email, "POST", Request);
        console.log(res);
        if (res.status == "success") {
          this.setState({  })
            this.loginAPI()
        
    
        } else {
            
          this.setState({ loading: false, emailerror: res.message })
        }
    
      }


    loginAPI = async () => {
       
          Keyboard.dismiss()
          this.setState({ loading: true });
          var Request = {
            security: 1,
            code: this.state.code,
            phone: this.state.phone
          }
    
          const res = await FetchAPI(API.check_phone, "POST", Request);
          console.log(res);
          if (res.status == "success") {
            this.setState({loading: false, phoneerror:'Number is already registred'})
          } else {
            this.setState({   })
            let mobile = this.state.code + this.state.phone;
            auth().signInWithPhoneNumber(mobile)
              .then(confirmResult => {
                console.log(confirmResult);
                this.setState({loading: false})
                this.props.navigation.navigate("Verification", { phone: this.state.phone, code: this.state.code, confirmResult: confirmResult, user: this.props.route.params.item, email: this.state.email, ltype:'signup' })
              })
              .catch(error => { 
                  console.log(error.message, error.code);
                  if(error.code == "auth/invalid-phone-number"){
                      this.setState({phoneerror:'Please enter valid phone number'})
                  } else {
                   this.setState({ phoneerror: error.message, loading: false })
                  }
              });
          
          }
    
        
    
    
      }

    verifyAPI = async() => {
        if(!this.validateEmail(this.state.email)){
            this.setState({emailerror: "Please check your email"})
        } else if(!this.state.phone){
            this.setState({phoneerror: "Please enter your phone number"})
        } else if(!this.state.check){
           Toast.show('Please accept terms & conditions')
        } else {
          this.loginAPI()
             
            
        }

    }
    validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    render() {
        let { email, phone } = this.state;
        return (
            <ThemeContext.Consumer>{(context) => {

                const theme = context.theme;
                return (
                    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
                        <StatusBar backgroundColor={checkTheme(theme).white} barStyle="dark-content" />
                        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">

                            <View
                                style={{ margin: widthPercentageToDP('5%') }}>

                                <Text style={{ fontFamily: Fonts.Bold, color: checkTheme(theme).primarydark, fontSize: FontSize.large, marginTop: heightPercentageToDP('3%'), }}>{"Hey There !"}</Text>

                                <Text style={{ fontFamily: Fonts.Regular, color: checkTheme(theme).black, fontSize: FontSize.small, marginBottom: heightPercentageToDP('3%'), }}>{"Fill the following details to create an account."}</Text>


                                <FloatingLabelInput
                                    label="Email*"
                                    value={email}
                                    editable={this.props.route.params.item.email ? false : true}
                                    error={this.state.emailerror}
                                    onChangeText={value => {
                                        this.setState({ email: value, emailerror: null })
                                    }}
                                    rightComponent={
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            {this.validateEmail(this.state.email) &&
                                                <Image style={{ height: 25, width: 25 }} resizeMode="contain" source={require('../../images/check.png')} />
                                            }
                                        </View>
                                    }
                                />
                                <FloatingLabelInput
                                    label="Phone*"
                                    value={phone}
                                    keyboardType="numeric"
                                    maxLength={15}
                                    error={this.state.phoneerror}
                                    onChangeText={value => {
                                        this.setState({ phone: value, phoneerror: null })
                                    }}
                                    leftComponent={

                                        <TouchableOpacity onPress={() => this.setState({ countryvisible: true })} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{  fontSize: 24 }}>{this.state.flag}</Text>
                                            <Image style={{ height: 10, width: 10, marginLeft: 5 }} resizeMode="contain" source={require('../../images/arrowdown.png')} />
                                        </TouchableOpacity>
                                    }

                                />


                              






                            </View>
                           
                        </KeyboardAwareScrollView>
                        <TouchableOpacity onPress={() => {
                                    this.setState({ check: !this.state.check })
                                }} activeOpacity={1} style={{ flexDirection: 'row', width: widthPercentageToDP('90%'), marginTop:heightPercentageToDP('1%'), alignSelf:'center',   alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <View style={{ height: 25, width: 25, backgroundColor: this.state.check ? checkTheme(theme).black : checkTheme(theme).white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: checkTheme(theme).black, borderRadius: 5, marginRight: 10 }}>
                                        <Image style={{ height: 20, width: 20, tintColor: checkTheme(theme).white }} resizeMode="contain" source={require('../../images/check.png')} />
                                    </View>
                                    <Text style={{flex:1, fontFamily: Fonts.Regular, fontSize: 13, flexWrap:'wrap', color: checkTheme(theme).black }}>{"By login, you agree to Two’s "}
                                        <Text onPress={()=> {Linking.openURL('https://www.vardhmankrupa.com/terms-condition')}} style={{ fontFamily: Fonts.Bold, fontSize: 13, color: checkTheme(theme).black, textDecorationLine:'underline' }}>{"Terms And Conditions "}</Text> {"and "}
                                        <Text onPress={()=> {Linking.openURL('https://www.vardhmankrupa.com/privacy-policy')}} style={{ fontFamily: Fonts.Bold, fontSize: 13, color: checkTheme(theme).black, textDecorationLine:'underline' }}>{"Privacy Policy"}</Text></Text>

                                </TouchableOpacity>
                        <Button visible={this.state.loading} disable={!this.validateEmail(this.state.email) || !this.state.phone || !this.state.check ? true : false} text="Continue" onPress={() => {
                            this.verifyAPI()
                        }} />

<CountryPicker
                                show={this.state.countryvisible}
                                pickerButtonOnPress={(item) => {
                                    console.log(item);
                                    this.setState({ countryvisible: false, flag: item.flag, code: item.dial_code })
                                }}
                                style={{
                                    modal: {
                                        height: heightPercentageToDP('50%'),
                                        backgroundColor: checkTheme(theme).white
                                    },
                                    itemsList: {

                                        color: checkTheme(theme).black,
                                    },
                                    textInput: {
                                          height: 50,
                                          color: checkTheme(theme).black,
                                          borderRadius: 0,
                                    },
                                    countryButtonStyles: {
                                          height: 50,
                                    },
                                    searchMessageText: {
                                        color: checkTheme(theme).black,
                                    },
                                    dialCode: {
                                        color: checkTheme(theme).black,
                                    },
                                    countryName: {
                                        color: checkTheme(theme).black,
                                    }
                                }}
                                close={()=> {
                                    this.setState({ countryvisible: false })
                                }}
                            />

                    </SafeAreaView>
                )
            }}

            </ThemeContext.Consumer>
        )
    }


}
