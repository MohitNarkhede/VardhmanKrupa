



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
import { Neomorph } from 'react-native-neomorph-shadows-fixes';

const SLIDER_1_FIRST_ITEM = 0;

export default class OrderDetails extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            scrollheader: false,
            greeting: 'Hello, ',
            loading: false,
            orders:[],
            data:{},
            cart_count:0,
          
        }

    }

    async componentDidMount() {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

        this.ordersAPI();
        let user = await AsyncStorage.getItem('user');
        // console.log(user.first_name);    
        // let first_name = JSON.parse(user).first_name;
        // this.setState({ greeting: this.generateGreetings() })
    }







    ordersAPI = async () => {
        let id = await AsyncStorage.getItem('id')
        let token = await AsyncStorage.getItem('token')
        var Request = {
            security: 1,
            token: JSON.parse(token),
            oid: this.props.route.params.item.id
        }
        if (id) {
            Request = {
                security: 0,
                token: JSON.parse(token),
                id: JSON.parse(id),
                oid: this.props.route.params.item.id
            }
        }
        this.setState({ loading: true })
        const res = await FetchAPI(API.vieworder, "POST", Request);
        console.log(JSON.stringify(res));
        if (res.status == "success") {
            this.setState({ orders: res.data.product, data: res.data, loading: false })
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
            this.setState({ loading: false, orders: [] })
        }
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
                                <Text style={{ fontFamily: Fonts.SemiBold, fontSize: FontSize.medium,  color: checkTheme(theme).black }}>{"Order #" + this.props.route.params.item.orderno}</Text>
                            </View>
                            {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('Search')} style={{ paddingHorizontal: 10 }}>
                                <Image style={{ height: 25, width: 25 }} resizeMode="contain" source={require('../../images/search.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Cart')} style={{ paddingHorizontal: 10 }}>
                                <Image style={{ height: 25, width: 25 }} resizeMode="contain" source={require('../../images/bag.png')} />
                                {this.state.cart_count != 0 &&
                                    <View style={{ top: -5, right: 0, position: 'absolute', height: 20, minWidth: 20, borderRadius: 10, backgroundColor: checkTheme(theme).secondary, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: Fonts.SemiBold, fontSize: 10, paddingHorizontal: 2, color: checkTheme(theme).white }}>{this.state.cart_count}</Text>
                                    </View>
                                }
                            </TouchableOpacity> */}

                        </View>
                        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                        <View style={{
                                        alignSelf: 'center',
                                        marginVertical: 8,
                                        width: '90%',
                                        paddingVertical: 10,
                                        backgroundColor: checkTheme(theme).light_gray,
                                        flexDirection: 'row'
                                    }}>

                                        <View style={{
                                            flexDirection: 'column',
                                            paddingHorizontal: 10,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>

                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: checkTheme(theme).black,
                                                    fontFamily: Fonts.Regular,
                                                    textAlign: 'center'
                                                }}>Ordered on</Text>

                                            <Text style={{
                                                fontFamily: Fonts.Bold,
                                                fontSize: 20, color: checkTheme(theme).primary
                                            }}>{this.state.data.order_date}</Text>

                                          
                                        </View>

                                        <View style={{
                                            height: '100%', width: 1,
                                            marginHorizontal: 6,
                                            backgroundColor: checkTheme(theme).black
                                        }}></View>

<View style={{
     flexDirection:'row',
     paddingHorizontal:10,
     width:'74%',
    // 
     justifyContent:'space-between',
     alignItems:'center'
}}>

    <View style={{
        flexDirection:'column'
    }}>
        
<Text style={{
    fontFamily:Fonts.Regular,
    fontSize:14,
    color:checkTheme(theme).black,
    width:'100%'
}}>
     Order ID: #{this.state.data.orderno}
</Text>
<View style={{ flex:1, flexDirection:'row',justifyContent:'space-between'}}>

<Text
numberOfViews={1}
style={{
    fontSize:14,
    fontFamily:Fonts.Light,
   
    color:checkTheme(theme).black,
}}>
  {this.state.data.weight} gm
</Text>
    <Text
    style={{fontSize:14,color:checkTheme(theme).black,
        paddingHorizontal:8,
    fontFamily:Fonts.Light}}>
    {this.state.data.qty} quantity
</Text>

</View>
<Text style={{
    fontFamily:Fonts.Light,
    fontSize:14,
    paddingTop:2,
    color:checkTheme(theme).black,
    width:'100%'
}}>
     Metal Color: {this.state.data.metal_color_name}
</Text>
<Text style={{
    fontFamily:Fonts.Light,
    fontSize:14,
    paddingTop:2,
    color:checkTheme(theme).black,
    width:'100%'
}}>
     Metal Purity: {this.state.data.purity_name}
</Text>
    </View>
    
    </View>
    

                                    </View>      
                                    <Text style={{
                                                fontFamily: Fonts.Bold,
                                                marginHorizontal:15,
                                                paddingBottom:5,
                                                fontSize: 15, color: checkTheme(theme).black
                                            }}>Remarks: {this.state.data.remark}</Text>    
                                            <View style={{alignItems:'center'}}>  
                                   <Button visible={false} disable={false} text="Download PDF" onPress={() => {
                                    Linking.openURL(this.props.route.params.item.pdf)
              }} />         
</View>
                            <FlatList
                                style={{ flex: 1, }}
                                data={this.state.orders}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => (
                                    <View style={{
                                        flex:1,
                                         borderRadius: 10,
                                         shadowOffset: { width: 5, height: 10 },
                                         // shadowColor: Colors.light_gray,
                                         shadowOpacity: 0.5,
                                         // elevation:1,
                                         // flex:1,
                                         elevation: 1,
                                         backgroundColor: "#fff",
                                         // height: height * 0.48,
                             
                                         // borderWidth:1,
                                         // borderColor:Colors.light_gray,   
                                         overflow: 'hidden',
                                         marginHorizontal: 10,
                                         marginVertical:5
                             
                                     }}>
                                         <View
                                             style={{
                                                 flex:1,
                                                 flexDirection: 'row', 
                                                 //  paddingBottom: 5,
                                             }}>
                                             <TouchableOpacity
                                                 activeOpacity={1}
                             
                                                 style={{flex:1, flexDirection: 'row', overflow: 'hidden' }} >
                                                 <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                     <Image
                                                     defaultSource={require('../../images/logoplaceholder.png')}
                                                     resizeMode="contain"
                                                         style={{ height: 1280 * ((width * .23)) / 1280, width: (width * .23), margin: 10, borderRadius: 10 }}
                                                         source={{ uri: item.p_img }}
                                                          />
                                                     {/* <TouchableOpacity
                                                             activeOpacity={0.8} onPress={() => {this.favAPI(rowData)}} style={{ alignItems: 'center', justifyContent: 'center',  width: 25, height: 25, borderRadius: 5, backgroundColor: "#fff" }}>
                                                             <Image
                                                                 style={{ height: 16, width: 16, alignSelf: 'center', }}
                                                                 resizeMode="contain"
                                                                 source={ rowData.favorite == 0 ? require('../../images/heart.png') : require('../../images/fillheart.png')} />
                                                         </TouchableOpacity> */}
                                                 </View>
                                                 <View style={{ flex:1, flexDirection: 'column', paddingHorizontal: 4, marginVertical:5  }}>
                             
                                                 <View style={{ flex:1, flexDirection: 'row', justifyContent:'space-between', paddingTop:5  }}>
                             
                                                 <View style={{ flex:1,  flexDirection: 'column', justifyContent:'center'  }}>
                                                     <Text numberOfLines={2} style={{ fontSize: 14, color: "#000", fontFamily: Fonts.SemiBold, textAlign: 'left', paddingHorizontal: 10  }}>{item.p_name}</Text>
                                                     {item.p_remark ? 
                                                     <Text numberOfLines={2} style={{ fontSize: 12, color: "#000", fontFamily: Fonts.Light, textAlign: 'left',  paddingHorizontal: 10}}>Remark: {item.p_remark}</Text>
                                                     : null }

                                                     <View style={{ flexDirection: 'row',  paddingHorizontal: 10 }}>
                                                         <Text numberOfLines={2} style={{ fontSize: 12, color: "#000", fontFamily: Fonts.Light, textAlign: 'left', }}>Weight: {item.p_weight} gm</Text>

                                                     </View>
                                                     <Text numberOfLines={2} style={{ fontSize: 12, color: "#000", paddingLeft:10, fontFamily: Fonts.Light, textAlign: 'left', }}>Quantity: {item.p_quantity} </Text>

                                                     </View>
                                                     
                                                     </View>
                                                    
                                                     
                             
                                                         {/* <SmallButton visible={this.state.loading} disable={rowData.product_in_cart == 0 ? false : true} text={rowData.product_in_cart == 0 ? "Add to Cart" :  "Added"} onPress={() => {
                                                             this.addcartAPI(rowData)
                                                         }} /> */}
                                                     </View>
                                                 
                                             </TouchableOpacity>
                             
                                         </View>
                                     </View>
                                )}
                                keyExtractor={(item, index) => String(index)}
                            />

                        </ScrollView>
                    </SafeAreaView>
                )
            }}

            </ThemeContext.Consumer>
        )
    }


}
const styles = StyleSheet.create({
    Text1: {
      fontFamily: Fonts.Regular,
      color: "black",
      paddingVertical: 1.5,
      fontSize: 12
    },
    Text2: {
      fontFamily: Fonts.Bold,
      color: "black",
      paddingVertical: 1.5,
      fontSize: 14
    }
  });