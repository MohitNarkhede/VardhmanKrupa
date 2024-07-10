
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
    TouchableHighlight
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
const dimen = Dimensions.get('window');

export default class Refer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }

    }




    render() {
        let { user } = this.state;
        return (
            <ThemeContext.Consumer>{(context) => {

                const theme = context.theme;
                return (
                    <SafeAreaView style={{ flex: 1, backgroundColor: checkTheme(theme).primary, }}>
                        <StatusBar backgroundColor={checkTheme(theme).primary} barStyle="light-content" />
                        <KeyboardAwareScrollView>

                            <View
                                style={{ flex:1, position: 'relative', zIndex: 9999 }}>
                              
                                <ImageBackground
                            resizeMode={'cover'}
                            style={{ height: heightPercentageToDP('60%'), width: width }}
                            source={require('../../images/referearn.png')} >
                                <View style={{flex:1, flexDirection:'column', padding: widthPercentageToDP('4%')}}>
                                    <View style={{flexDirection:'row', justifyContent:'space-between',}}>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ padding: 5,  }}>
                                    <Image style={{ height: 26, width: 26, tintColor: checkTheme(theme).white  }} resizeMode="contain" source={require('../../images/arrowleft.png')} />
                                </TouchableOpacity>
                                  <TouchableOpacity  style={{ padding: 5,  }}>
                                  <Text style={{ fontFamily: Fonts.Regular, color: checkTheme(theme).white, fontSize: 16, }}>{"Joined"}</Text>
                                </TouchableOpacity>
                                </View>
                                <View style={{marginTop: ((dimen.height === 780 || dimen.width === 780)
                                    || (dimen.height === 812 || dimen.width === 812)
                                    || (dimen.height === 844 || dimen.width === 844)
                                    || (dimen.height === 896 || dimen.width === 896)
                                    || (dimen.height === 926 || dimen.width === 926)) ? heightPercentageToDP('55%') - 100 : heightPercentageToDP('60%') - 100 , flexDirection:'column',  marginHorizontal: widthPercentageToDP('5%')}}>
                                <Text style={{fontFamily: Fonts.SemiBold, color: checkTheme(theme).white, fontSize: FontSize.large, }}>{"Refer Friends & Unlock New Sessions"}</Text>
                                <Text style={{fontFamily: Fonts.Light, textAlign:'justify', color: checkTheme(theme).white, fontSize: FontSize.medium, }}>{"When your 4 friends join Two, you will get prompt to unlock next sessions."}</Text>

                                </View>
                                </View>
                                </ImageBackground>

                              

                               


                                <View style={{  marginHorizontal: widthPercentageToDP('5%'), flexDirection: 'row', borderWidth: 1, alignItems: 'center', justifyContent: 'space-between', marginTop: 70, borderColor: checkTheme(theme).white, borderRadius: 10, elevation: 1, padding: 20, backgroundColor: checkTheme(theme).white,  }}>
                                    <Text style={{ flex: 1, fontFamily: Fonts.Light, color: checkTheme(theme).black, fontSize: 16, }}>{"https://www.thrivewell.world"}</Text>
                                    <TouchableOpacity onPress={()=> {}}>
                                    <Text style={{ fontFamily: Fonts.Bold, color: checkTheme(theme).black, fontSize: 16, }}>{"Copy"}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{height:0.8, borderRadius:10, width: widthPercentageToDP('40%'), alignSelf:'center', backgroundColor: checkTheme(theme).white, marginVertical:20}} />
                                
                            <View style={{flex:1, alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                                <TouchableOpacity style={{height:60, width:60, borderRadius:30, alignItems:'center', justifyContent:'center', backgroundColor: checkTheme(theme).white, marginLeft:10}}>
                                    <Image style={{height:30, width:30}} resizeMode="contain" source={require('../../images/whatsapp.png')} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{height:60, width:60, borderRadius:30, alignItems:'center', justifyContent:'center', backgroundColor: checkTheme(theme).white, marginLeft:10}}>
                                    <Image style={{height:30, width:30}} resizeMode="contain" source={require('../../images/mail.png')} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{height:60, width:60, borderRadius:30, alignItems:'center', justifyContent:'center', backgroundColor: checkTheme(theme).white, marginLeft:10}}>
                                    <Image style={{height:30, width:30}} resizeMode="contain" source={require('../../images/share.png')} />
                                </TouchableOpacity>
                            </View>

                            </View>



                        </KeyboardAwareScrollView>

                       
                    </SafeAreaView>
                )
            }}

            </ThemeContext.Consumer>
        )
    }


}
