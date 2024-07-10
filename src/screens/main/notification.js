
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
    FlatList,
    LogBox,
    Platform
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
import moment from 'moment';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Carousel from 'react-native-snap-carousel';
import SmallButton from '../../components/smallbutton';
const SLIDER_1_FIRST_ITEM = 0;
import ImageView from "react-native-image-viewing";
var images1 = [];

export default class Notification extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            scrollheader: false,
            greeting: 'Hello, ',
            loading: false,
            notification:[],
            cart_count:0,
            refresh: false,
            isImageViewVisible: false,
            imageIndex:0
        }

    }

    async componentDidMount() {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

        this.notificationAPI()
      
      
    }

  

   

    notificationAPI = async () => {
        let id = await AsyncStorage.getItem('id')
        let token = await AsyncStorage.getItem('token')
        var Request = {
            security: 1,
            token: JSON.parse(token)
        }
        if (id) {
            Request = {
                security: 0,
                token: JSON.parse(token),
                id: JSON.parse(id)
            }
        }
        this.setState({ loading: true })
        const res = await FetchAPI(API.notification, "POST", Request);
        console.log(res);
        if (res.status == "success") {
            this.setState({ notification: res.data, loading: false })
        } else if (res.status == "failed") {
            AsyncStorage.removeItem('id');
            AsyncStorage.removeItem('user');
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                }),
            );
            this.setState({ loading: false, })
        } else {
            // Toast.show(res.message)
            this.setState({ loading: false, notification: [], msg: res.message })
        }
    }


    imageLoop = (data) => {
        images1 = [];
        
          var data1 = {};
          data1 = { uri: data };
          images1.push(data1);
        console.log(images1);
        this.setState({
          imageIndex: 0,
          isImageViewVisible: true,
        });
      }

    render() {
        let { user } = this.state;
        return (
            <ThemeContext.Consumer>{(context) => {

                const theme = context.theme;
                return (
                    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2", }}>
                        <StatusBar backgroundColor={checkTheme(theme).light_gray} barStyle="dark-content" />
                        <Loader loading={this.state.loading} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: widthPercentageToDP('2%'), paddingRight: widthPercentageToDP('5%'), paddingTop: Platform.OS == "ios" ? 15 : 35, paddingBottom: 10 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                <TouchableOpacity onPress={()=> this.props.navigation.goBack()} style={{padding:5}}>
                                <Image style={{ height: 28, width: 28, tintColor: checkTheme(theme).black }} resizeMode="contain" source={require('../../images/leftarrow.png')} />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: Fonts.SemiBold, fontSize: FontSize.medium,  color: checkTheme(theme).black }}>{"Notification"}</Text>
                            </View>
                       
                        </View>
         
                            <FlatList
                                style={{ flex: 1, }}
                                data={this.state.notification}
                                showsVerticalScrollIndicator={false}
                                ListEmptyComponent={
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: this.state.loading ? 0 : heightPercentageToDP('100%') - 150 }}>
                                        <Text style={{ fontFamily: Fonts.SemiBold, fontSize: 14, color: checkTheme(theme).black }}>{this.state.msg}</Text>
                                    </View>
                                }
                                renderItem={({ item, index }) => (
                                    <View style={{
                                        flex: 1,
                                        backgroundColor:'#f2f2f2',
                                        borderBottomWidth:1,
                                        borderBottomColor:checkTheme(theme).white,
                                        paddingVertical:heightPercentageToDP('2%'),
                                        paddingHorizontal:widthPercentageToDP('5%')
                                    }}>
                                    <TouchableOpacity
                                      activeOpacity={1}
                                      style={{
                                        alignItems: "flex-start",
                                      }}
                                      onPress={() => {
                                        if(item.img){
                                          this.imageLoop(item.img)
                                        }
                                        // this.props.onPress(item.cuid);
                                      }}>
                                      <Text  style={{fontFamily:Fonts.SemiBold,fontSize:16,textAlign:'left',color: checkTheme(theme).primary}}>{item.title}</Text>
                                      <Text  style={{fontFamily:Fonts.Regular,fontSize:12,textAlign:'left', paddingTop:2,color: checkTheme(theme).black}}>{item.message}</Text>
                            
                                      <View style={{flexDirection:'row',alignItems:'center',
                                       width:'100%',paddingTop:2,justifyContent:'flex-end'}}>
                                      
                                       <Text style={{fontSize:12, textAlign:'right', fontFamily:Fonts.Light,color:checkTheme(theme).dark_gray}}>{item.datetime}</Text> 
                                 
                                       {/* {item.code ? 
                                       <Text style={{fontSize:Dimens.ExtraMedium,fontFamily:Fonts.Bold,color:checkTheme(theme).white}}>#{item.code}</Text> 
                                      : null } */}
                                      </View>  
                                      {item.img ? 
                                        <Image style={{height:widthPercentageToDP('50%'), marginTop:50, alignSelf:'center', width: widthPercentageToDP('80%')}} resizeMode="contain"
                                        source={{uri: item.img}} />
                                      :null }
                                      </TouchableOpacity>
                                    
                                  </View>
                                )}
                                keyExtractor={(item, index) => String(index)}
                            />
  <ImageView
                                        images={images1}
                                        imageIndex={0}
                                        visible={this.state.isImageViewVisible}
                                        //renderFooter={this.renderFooter}
                                        onRequestClose={() => this.setState({ isImageViewVisible: false })}
                                      />
                    </SafeAreaView>
                )
            }}

            </ThemeContext.Consumer>
        )
    }


}
