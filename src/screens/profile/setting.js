


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
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    Linking,
    Keyboard,
    TextInput,
    TouchableHighlight,
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
import FetchAPI from '../../common/FetchAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {VerticalBarChart} from '../../components/chart-react-native';
let URL = "";
let sociallogin = 1;
export default class Setting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            total_session: '',
            total_time_spent: '',
            avg_min_day: '',
            picture: '',
            fname: '',
            lname: '',
            age: '',
            premium: 0,
            data: {},
            sub_type: '',
            chart:[],
            topicid:0,
            topicresult:[],
            loading: false,
            givetest:0,
            IntroData:"",
            testdata1:'',
            testimg:'',
            givetest_name:''


        }

    }

    componentDidMount() {
        // this.in2 = this.props.navigation.addListener('focus', async () => {
            this.profile()
        // })
    }

    componentWillUnmount() {
        // this.in2()
    }



    profile = async () => {
        let id = await AsyncStorage.getItem('id')
       

        console.log(URL);
        var Request = {
            security: 1,
            user_id: JSON.parse(id)
        }
        this.setState({ loading: true, topicresult:[] })
        const res = await FetchAPI(API.profile, "POST", Request);
        console.log(JSON.stringify(res));
        if (res.status == "success") {
            this.setState({
                loading: false,
                fname: res.data.first_name,
                lname: res.data.last_name,
                email: res.data.email,
                age: res.data.age,
                picture: res.data.picture,
                avg_min_day: res.data.avg_min_day,
                total_session: res.data.total_session,
                total_time_spent: res.data.total_time_spent,
                premium: res.data.premium,
                sub_type: res.data.sub_type,
                data: res.data,
              
                chart: res.data.chart

            }, ()=> {
                if(this.state.chart && this.state.chart.length > 0){
                    this.setState({topicid: this.state.chart[0].topic_id, topicresult: this.state.chart[0].data, givetest: this.state.chart[0].givetest,
                        testdata1: this.state.chart[0].testdata1,
                        testimg: this.state.chart[0].testimg,
                        IntroData: this.state.chart[0].testdata,
                        givetest_name: this.state.chart[0].givetest_name
                        
                    })
                }
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
                        <Loader loading={this.state.loading} />
                        <KeyboardAwareScrollView>

                            <View
                                style={{ margin: widthPercentageToDP('5%'), position: 'relative', zIndex: 9999 }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Setting', { top: false })} style={{ padding: 5, alignSelf: 'flex-end' }}>
                                    <Image style={{ height: 25, width: 25 }} resizeMode="contain" source={require('../../images/settings.png')} />
                                </TouchableOpacity>
                             

                                {/* <View style={{ flexDirection: 'row', borderWidth: 1, overflow:'hidden', borderColor: checkTheme(theme).light_gray,  borderRadius: 10, marginVertical: 20 }}>

<ImageBackground style={{ height: 105 * widthPercentageToDP('90%') / 506, width: widthPercentageToDP('90%'),  justifyContent:'center' }} source={require('../../images/refer.png')}>
    <TouchableOpacity onPress={()=> this.props.navigation.navigate('Refer')} style={{ flexDirection: 'column', justifyContent: 'center', marginLeft: widthPercentageToDP('33%'),  marginHorizontal: 10, }}>
        <Text style={{ fontFamily: Fonts.Regular, color: checkTheme(theme).primarydark, fontSize: 16, textAlign:'left' }}>{"Unlock Sessions For Free"}</Text>
            <Text style={{ fontFamily: Fonts.Light, color: checkTheme(theme).black, fontSize: 12, textAlign:'left', paddingLeft:5  }}>{"Refer your friends and unlock"}</Text>
    </TouchableOpacity>
</ImageBackground>
</View> */}


                              
                 
                            </View>



                        </KeyboardAwareScrollView>

                        <Image
                            resizeMode={'contain'}
                            style={{ height: 383 * width * .7 / 512, width: width * .7, top: -50, right: 0, position: 'absolute', zIndex: -1 }}
                            source={require('../../images/top.png')} />
                    </SafeAreaView>
                )
            }}

            </ThemeContext.Consumer>
        )
    }


}
