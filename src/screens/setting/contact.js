
import React from 'react';
import {
    Text,
    View,
    Image,
    StatusBar,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Linking
} from 'react-native';
import API from '../../common/Api';
import Toast from 'react-native-simple-toast';
import Fonts from '../../common/Fonts';
const { width, height } = Dimensions.get('window')
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FloatingLabelInput } from '../../components/floatinglabel';
import { checkTheme } from '../../common/checkTheme';
import { ThemeContext } from '../../components/ThemeProvider';
import FontSize from '../../common/FontSize';
import FetchAPI from '../../common/FetchAPI';
import HTML from "react-native-render-html";
import Loader from '../../common/Loader';
import { widthPercentageToDP } from 'react-native-responsive-screen';
const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });


export default class Contact extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: {},
            addressurl: '',
            loading: true
        }
    }

    componentDidMount() {
        this.contact()
    }

    contact = async () => {

        var Request = {
            security: 1,
        }
        this.setState({ loading: true })
        const res = await FetchAPI(API.contact, "POST", Request);
        console.log(res);
        if (res.status == "success") {
            this.setState({
                loading: false,
                dataSource: res.data,
                addressurl: res.addressurl

            })

        } else {
            Toast.show(res.message)
            this.setState({ loading: false,  })
        }
    }


    render() {
        let { user } = this.state;
        return (
            <ThemeContext.Consumer>{(context) => {
                const theme = context.theme;
                return (
                    <SafeAreaView style={{ flex: 1, backgroundColor: "white", }}>
                        <StatusBar backgroundColor={checkTheme(theme).white} barStyle="dark-content" />
                        <Loader loading={this.state.loading} />
                            <View style={{ position: 'relative', zIndex: 9999 }}>


                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: widthPercentageToDP('2%'), paddingRight: widthPercentageToDP('5%'), paddingTop: Platform.OS == "ios" ? 15 : 35, paddingBottom: 10 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                <TouchableOpacity onPress={()=> this.props.navigation.goBack()} style={{padding:5}}>
                                <Image style={{ height: 28, width: 28, tintColor: checkTheme(theme).black }} resizeMode="contain" source={require('../../images/leftarrow.png')} />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: Fonts.SemiBold, fontSize: FontSize.medium,  color: checkTheme(theme).black }}>{"Contact Us"}</Text>
                            </View>

                        </View>


                                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 10, }}>

                                    <ScrollView>
                                        <View style={{ padding: 5, width: widthPercentageToDP('90%'), alignSelf:'center', paddingBottom:100 }}>
                                        <Image
                  resizeMode={'contain'}
                  style={{ height: 425 * width * .85 / 1600, width: width * .85, alignSelf: 'center' }}
                  source={require('../../images/vkg.png')} />
 <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  flexDirection: 'column', alignItems: 'center',
                  backgroundColor: 'white', elevation: 2, marginTop: 8,
                  width: '90%', alignSelf: 'center',
                  alignItems: 'center', paddingVertical: 8
                }}
                onPress={() => {
                  Linking.openURL(this.state.addressurl)
                }}>
                <Image source={require('../../images/map.png')}
                  style={{ height: 30, width: 30, tintColor: checkTheme(theme).primary }}
                />
                <Text style={{ fontFamily: Fonts.SemiBold, color: checkTheme(theme).black, fontSize: 14, marginTop: 5, textAlign: 'center', width: '80%', alignSelf: 'center' }}>
                  {this.state.dataSource.address ? this.state.dataSource.address : '-'}</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  borderTopLeftRadius:20,
                  flexDirection: 'column', alignItems: 'center',
                  backgroundColor: 'white', elevation: 2, marginTop: 8,
                  width: '90%', alignSelf: 'center',
                  alignItems: 'center', paddingVertical: 8
                }}
                onPress={() => {
                  Linking.openURL('mailto:' + this.state.dataSource.email)
                }}>
                <Image source={require('../../images/user.png')}
                  style={{ height: 30, width: 30, tintColor: checkTheme(theme).primary }}
                />
                <Text style={{ fontFamily: Fonts.SemiBold, color: checkTheme(theme).black, fontSize: 14, marginTop: 5, textAlign: 'center', width: '80%', alignSelf: 'center' }}>
                  {this.state.dataSource.email ? this.state.dataSource.email : '-'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  justifyContent: 'center',borderBottomRightRadius:20,
                  flexDirection: 'column', alignItems: 'center',
                  backgroundColor: 'white', elevation: 2, marginTop: 8,
                  width: '90%', alignSelf: 'center',
                  alignItems: 'center', paddingVertical: 8
                }}
                onPress={() => {
                  Linking.openURL('https://wa.me/91' + this.state.dataSource.wpnumber)
                }}>
                <Image source={require('../../images/whatsapp.png')}
                  style={{ height: 30, width: 30, tintColor: checkTheme(theme).primary }}
                />
                <Text style={{ fontFamily: Fonts.SemiBold, color: checkTheme(theme).black, fontSize: 14, marginTop: 5, textAlign: 'center', width: '80%', alignSelf: 'center' }}>
                  {this.state.dataSource.wpnumber ? this.state.dataSource.wpnumber : '-'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  flexDirection: 'column', alignItems: 'center',

                  borderTopLeftRadius:20,
                  backgroundColor: 'white', elevation: 2, marginTop: 8,
                  width: '90%', alignSelf: 'center',
                  alignItems: 'center', paddingVertical: 8
                }}
                onPress={() => {
                  Linking.openURL('tel:$:' + this.state.dataSource.mobile)
                }}>
                <Image source={require('../../images/call.png')}
                  style={{ height: 30, width: 30, tintColor: checkTheme(theme).primary }}
                />
                <Text style={{ fontFamily: Fonts.SemiBold, color: checkTheme(theme).black, fontSize: 14, marginTop: 5, textAlign: 'center', width: '80%', alignSelf: 'center' }}>
                  {this.state.dataSource.mobile ? this.state.dataSource.mobile : '-'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  borderBottomRightRadius:20,
                  flexDirection: 'column', alignItems: 'center',
                  backgroundColor: 'white', elevation: 2, marginTop: 8,
                  width: '90%', alignSelf: 'center',
                  alignItems: 'center', paddingVertical: 8
                }}
                onPress={() => {
                  Linking.openURL('tel:$:' + this.state.dataSource.phone)
                }}>
                <Image source={require('../../images/call.png')}
                  style={{ height: 30, width: 30, tintColor: checkTheme(theme).primary }}
                />
                <Text style={{ fontFamily: Fonts.SemiBold, color: checkTheme(theme).black, fontSize: 14, marginTop: 5, textAlign: 'center', width: '80%', alignSelf: 'center' }}>
                  {this.state.dataSource.phone ? this.state.dataSource.phone : '-'}</Text>
              </TouchableOpacity>
              <View style={{flex:1, flexDirection:'row', justifyContent:'space-around', marginVertical:10}}>
              <TouchableOpacity
                style={{
                 
                 alignSelf: 'center',
                  alignItems: 'center', paddingVertical: 8
                }}
                onPress={() => {
                  Linking.openURL(this.state.dataSource.fb)
                }}>
                <Image source={require('../../images/facebook.png')}
                  style={{ height: 40, width: 40, }}
                />
               
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                 
                  alignSelf: 'center',
                  alignItems: 'center', paddingVertical: 8
                }}
                onPress={() => {
                  Linking.openURL(this.state.dataSource.insta)
                }}>
                <Image source={require('../../images/instagram.png')}
                  style={{ height: 40, width: 40, }}
                />
               
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                 
                  alignSelf: 'center',
                  alignItems: 'center', paddingVertical: 8
                }}
                onPress={() => {
                  Linking.openURL(this.state.dataSource.twitter)
                }}>
                <Image source={require('../../images/twitter.png')}
                  style={{ height: 40, width: 40, }}
                />
               
              </TouchableOpacity>
              </View>


                                        </View>
                                        <View style={{ height: 20 }}></View>
                                    </ScrollView>
                                </View>


                            </View>
                            <Image style={{ height: height * .35, width: width, position: 'absolute', bottom: 0, zIndex: -1, right: 0 }}
          resizeMode="cover" source={require('../../images/back4.png')} />

                    </SafeAreaView>
                )
            }}
            </ThemeContext.Consumer>
        )
    }


}
