
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
    FlatList,
    TouchableHighlight
} from 'react-native';
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
import FetchAPI from '../../common/FetchAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default class Success extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            plans:[{}, {}],
            loading: false,
            selected:'',
            data:[{name:''}, {name:""}, {name:''}]


        }

    }

    componentDidMount() {
        // this.in2 = this.props.navigation.addListener('focus', async () => {
        // })
    }

    componentWillUnmount(){
        // this.in2()
    }



    plansAPI = async () => {
        let id = await AsyncStorage.getItem('id')
        let user = await AsyncStorage.getItem('user')
console.log(user);
        var Request = {
            security: 1,
            user_id: JSON.parse(id),
            currency: JSON.parse(user).currency
        }
        this.setState({ loading: true })
        const res = await FetchAPI(API.plans, "POST", Request);
        console.log(res);
        if (res.status == "success") {
            this.setState({
                loading: false,
                plans: res.data,
                data: res.data1,
               

            })

        } else {
            Toast.show(res.message)
            this.setState({ loading: false, })
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
                        {/* <Loader loading={this.state.loading} /> */}
                        <KeyboardAwareScrollView>

                            <View
                                style={{ margin: widthPercentageToDP('5%'), position: 'relative', zIndex: 9999 }}>
                                <TouchableOpacity onPress={() => {
                                     this.props.navigation.dispatch(
                                        CommonActions.reset({
                                          index: 0,
                                          routes: [{ name: "Home" }],
                                        })
                                      );
                                }} style={{ padding: 5, alignSelf: 'flex-end' }}>
                                    <Image style={{ height: 25, width: 25 }} resizeMode="contain" source={require('../../images/close.png')} />
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems:'center' }}>
                                <Image
                            resizeMode={'contain'}
                            style={{ height: heightPercentageToDP('45%'), width: widthPercentageToDP('95%'), marginTop: -10, alignSelf:'center' }}
                            source={require('../../images/success.jpg')} />

                                    <Text style={{ fontFamily: Fonts.Bold, color: checkTheme(theme).primarydark, fontSize: 25, marginTop:25 }}>{"Order Successful !"}</Text>
                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                                    <Text style={{  width: widthPercentageToDP('80%'), textAlign:'center', fontFamily: Fonts.Regular, color: checkTheme(theme).black, fontSize: FontSize.medium,  }}>Your order number is<Text style={{textAlign:'center', color: checkTheme(theme).primary, fontSize:16, fontFamily: Fonts.Bold}}> #{this.props.route.params.orderno}</Text></Text>

                                        <Text style={{  width: widthPercentageToDP('65%'), marginTop:10,  textAlign:'center', fontFamily: Fonts.Regular, color: checkTheme(theme).dark_gray, fontSize: FontSize.medium,  }}>{"We'll reach out to you shortly with your order."}</Text>
            
                                    </View>
{/*                                   
<Text style={{textAlign:'left', color: checkTheme(theme).black, fontSize:18, marginTop:20, fontFamily: Fonts.Light}}>Bank Details Of Vardhman Krupa</Text>
{this.props.route.params.bank ? 
<View style={{flex:1, flexDirection:'column', marginTop:10, backgroundColor: checkTheme(theme).background, width: widthPercentageToDP('90%') }}>
  <View style={{flex:1, flexDirection:'row', borderColor: checkTheme(theme).dark_gray, borderBottomWidth:1, padding:10,}}>
  <Text style={{textAlign:'center', color: checkTheme(theme).black, fontSize:16, fontFamily: Fonts.Regular, }}>Name - </Text>
  <Text style={{flex:1, textAlign:'center', color: checkTheme(theme).black, fontSize:16, fontFamily: Fonts.SemiBold, }}>{"this.props.route.params.bank.name"}</Text>
  </View>
  <View style={{flex:1, flexDirection:'row', borderColor: checkTheme(theme).dark_gray, borderBottomWidth:1, padding:10,}}>
  <Text style={{textAlign:'center', color: checkTheme(theme).black, fontSize:16, fontFamily: Fonts.Regular, }}>Branch - </Text>
  <Text style={{flex:1, textAlign:'center', color: checkTheme(theme).black, fontSize:16, fontFamily: Fonts.SemiBold, }}>{"this.props.route.params.bank.branch"}</Text>
  </View>
  <View style={{flex:1, flexDirection:'row', borderColor: checkTheme(theme).dark_gray, borderBottomWidth:1, padding:10,}}>
  <Text style={{textAlign:'center', color: checkTheme(theme).black, fontSize:16, fontFamily: Fonts.Regular, }}>A/C Type - </Text>
  <Text style={{flex:1, textAlign:'center', color: checkTheme(theme).black, fontSize:16, fontFamily: Fonts.SemiBold, }}>{"this.props.route.params.bank.actype"}</Text>
  </View>
  <View style={{flex:1, flexDirection:'row', borderColor: checkTheme(theme).dark_gray, borderBottomWidth:1, padding:10,}}>
  <Text style={{textAlign:'center', color: checkTheme(theme).black, fontSize:16, fontFamily: Fonts.Regular, }}>A/C No. - </Text>
  <Text style={{flex:1, textAlign:'center', color: checkTheme(theme).black, fontSize:16, fontFamily: Fonts.SemiBold, }}>{"this.props.route.params.bank.acno"}</Text>
  </View>
  <View style={{flex:1, flexDirection:'row', borderColor: checkTheme(theme).dark_gray, borderBottomWidth:1, padding:10,}}>
  <Text style={{textAlign:'center', color: checkTheme(theme).black, fontSize:16, fontFamily: Fonts.Regular, }}>IFSC Code - </Text>
  <Text style={{flex:1, textAlign:'center', color: checkTheme(theme).black, fontSize:16, fontFamily: Fonts.SemiBold, }}>{"this.props.route.params.bank.ifsc"}</Text>
  </View>
</View>
: null } */}
                                </View>

                               
                               

                               


                            </View>



                        </KeyboardAwareScrollView>
                        {/* <TouchableOpacity >
                        <Text style={{ fontFamily: Fonts.Regular, color: checkTheme(theme).dark_gray, textAlign:'center', fontSize: FontSize.medium, marginVertical: 15 }}>{"Download Receipt"}</Text>
                        </TouchableOpacity> */}
                        <View style={{alignItems:'center', justifyContent:'center'}}>
                        <Button  visible={this.state.loading} disable={false} text="Continue" onPress={() => {
                 this.props.navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: "Home" }],
                    })
                  );
                }} />
                       </View>
                    </SafeAreaView>
                )
            }}

            </ThemeContext.Consumer>
        )
    }


}
