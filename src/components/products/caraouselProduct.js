import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  Alert,
  Platform
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange,
    removeOrientationListener,
    widthPercentageToDP,
    heightPercentageToDP,
} from "react-native-responsive-screen";
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import { checkTheme } from "../../common/checkTheme";
import Fonts from "../../common/Fonts";
import { FloatingLabelInput } from "../floatinglabel";
import SmallButton from "../smallbutton";
import API from "../../common/Api";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FetchAPI from "../../common/FetchAPI";
import { CommonActions } from "@react-navigation/native";
import ImageZoom from 'react-native-image-pan-zoom';
import ViewShot, { captureRef } from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  root: {
    width: '43%',
    borderRadius: 10,
    marginLeft: 13,
    paddingBottom: 10,
    
    backgroundColor: "#fff",
    margin: 10,
   
  }
});

export default class CaraouselProduct extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      refresh: false,
      qty: parseInt(props?.item?.quantity),
      remark: '',
      index: parseInt(props.index) + 1,
      finalindex: parseInt(props.index),
      img:'',
      modalVisible: false,
            previewSource: null,
            error: null,
            res: null,
            value: {
                format: "jpg",
                quality: 0.9,
            }
    };
  }
  componentDidMount() {
    if (this.props.item.remark) {
      this.setState({remark: this.props.item.remark});
    }
  }

  componentDidUpdate() {
    if ((parseInt(this.props.item.quantity) != parseInt(this.state.quantity)) && this.props.item.product_in_cart == 1) {
        this.setState({ qty: parseInt(this.props.item.quantity) })
    } else if (this.props.item.quantity != this.state.quantity) {
        this.setState({ qty: parseInt(this.props.item.quantity) ? parseInt(this.props.item.quantity) : 1 })
    }
}

  addcartAPI = async (item) => {
    let id = await AsyncStorage.getItem('id')
    let token = await AsyncStorage.getItem('token')
    var Request = {
        security: 1,
        token: JSON.parse(token),
        product_id: item.id,
        quantity: this.state.qty,
        weight: item.weight,
        remark: this.state.remark
    }
    if (id) {
        Request = {
            security: 0,
            token: JSON.parse(token),
            id: JSON.parse(id),
            product_id: item.id,
            quantity: this.state.qty,
            weight: item.weight,
            remark: this.state.remark
        }
    }
    console.log(JSON.stringify(Request));
    this.setState({ loading: true })
    const res = await FetchAPI(API.add_cart, "POST", Request);
    console.log(res);
    if (res.status == "success") {
        this.props.onAddCart(this.state.remark, res.cart_id)
        item.cart_id = res.cart_id;
        if(item.product_in_cart == 1){
            this.props.item.product_in_cart = 0;
        } else {
            this.props.item.product_in_cart = 1;
        }
        this.setState({ loading: false })
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
        if(item.product_in_cart == 1){
            this.props.item.product_in_cart = 0;
        } else {
            this.props.item.product_in_cart = 1;
        }
        this.setState({ loading: false })
    }
}



favAPI = async (item) => {
    let id = await AsyncStorage.getItem('id')
    let token = await AsyncStorage.getItem('token')
    var Request = {
        security: 1,
        token: JSON.parse(token),
        product_id: item.id,
        type: item.favorite == 1 ? 2 : 1
    }
    if (id) {
        Request = {
            security: 0,
            token: JSON.parse(token),
            id: JSON.parse(id),
            product_id: item.id,
            type: item.favorite == 1 ? 2 : 1
        }
    }
    console.log(JSON.stringify(Request));
    this.setState({ loading1: true })
    const res = await FetchAPI(API.add_remove_wishlist, "POST", Request);
    console.log(res);
    if (res.status == "success") {
        if(item.favorite == 1){
            this.props.item.favorite = 0;
        } else {
            this.props.item.favorite = 1;
        }
        this.setState({ loading1: false })
    } else if (res.status == "failed") {
        AsyncStorage.removeItem('id');
        AsyncStorage.removeItem('user');
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            }),
        );
        this.setState({ loading1: false, })
    } else {
        // Toast.show(res.message)
        if(item.favorite == 1){
            this.props.item.favorite = 0;
        } else {
            this.props.item.favorite = 1;
        }
        this.setState({ loading1: false })
    }
}


removeAPI = async (item) => {
    let id = await AsyncStorage.getItem('id')
    let token = await AsyncStorage.getItem('token')
    var Request = {
        security: 1,
        token: JSON.parse(token),
        cart_id: item.cart_id,
    }
    if (id) {
        Request = {
            security: 0,
            token: JSON.parse(token),
            id: JSON.parse(id),
            cart_id: item.cart_id,
        }
    }
    console.log(JSON.stringify(Request));
    this.setState({ loading1: true })
    const res = await FetchAPI(API.remove_cart, "POST", Request);
    console.log(res);
    if (res.status == "success") {
        this.props.onRemoveCart()
        item.product_in_cart = 0 
        setTimeout(() => {
            Toast.show(res.message)
        }, 100);
        this.setState({ loading1: false })
    } else if (res.status == "failed") {
        AsyncStorage.removeItem('id');
        AsyncStorage.removeItem('user');
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            }),
        );
        this.setState({ loading1: false, })
    } else {
        Toast.show(res.message)
       
        this.setState({ loading1: false })
    }
}


updateQtyAPI = async (item) => {
    console.log(item);
    item.quantity = this.state.qty;
    let id = await AsyncStorage.getItem('id')
    let token = await AsyncStorage.getItem('token')
    var Request = {
        security: 1,
        token: JSON.parse(token),
        product_id: item.id,
        quantity: this.state.qty
    }
    if (id) {
        Request = {
            security: 0,
            token: JSON.parse(token),
            id: JSON.parse(id),
            product_id: item.id,
            quantity: this.state.qty
        }
    }
    console.log(JSON.stringify(Request));
    // this.setState({ loading1: true })
    const res = await FetchAPI(API.update_quantity, "POST", Request);
    console.log(res);
    if (res.status == "success") {
        // setTimeout(() => {
        //     Toast.show(res.message)
        // }, 100);
        this.props.UpdateQty(item, this.state.qty);
        this.setState({ loading1: false })
    } else if (res.status == "failed") {
        AsyncStorage.removeItem('id');
        AsyncStorage.removeItem('user');
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            }),
        );
        this.setState({ loading1: false, })
    } else {
          setTimeout(() => {
            Toast.show(res.message)
        }, 100);
       
        this.setState({ loading1: false })
    }
}

onCapture = () => {
    captureRef(this.ref, this.state.value)
        .then(res =>
            this.state.value.result !== "file"
                ? res
                : new Promise((success, failure) =>
                    // just a test to ensure res can be used in Image.getSize
                    Image.getSize(
                        res,
                        (width, height) => (console.log(res, width, height), success(res)),
                        failure))
        )
        .then(res => {
            console.log(res);
            this.setState({
                error: null,
                res,
                previewSource: { uri: res }
            })

            CameraRoll.save(res)
                .then(Toast.show('Photo download successfully and added to camera roll!'))
                .catch(err => console.log('err:', err))
        }).catch(error => (console.log(error), this.setState({ error, res: null, previewSource: null })));
}


  render() {
    const {navigation} = this.props;
    const rowID = this.props.index;
    const rowData = this.props.item;
    const dataSource = this.props.dataSource;
const theme = "light";
    return (
       
        <View style={{
            width: width * 0.55,
            borderRadius: 10,
            shadowOffset: { width: 5, height: 10 },
            // shadowColor: Colors.light_gray,
            shadowOpacity: 0.5,
            // elevation:1,
            elevation: 1,
            minHeight: height * 0.22,

            // borderWidth:1,
            // borderColor:Colors.light_gray,   
            overflow: 'hidden',
            margin: 15,
        }}>
            <View
                style={{
                    flexDirection: 'column', borderRadius: 10,
                        backgroundColor: "#fff", paddingBottom: 10,
                }}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { this.setState({ modalVisible: true })}}
                    style={{ flexDirection: 'column', overflow: 'hidden' }} >
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            style={{ height: 500 * ((width * .55) - 20) / 500, width: (width * .55) - 20, margin: 10, borderRadius: 10  }}
                            source={{ uri: rowData.image }} />
                        <TouchableOpacity
                                activeOpacity={0.8} onPress={() => {this.favAPI(rowData)}} style={{ top: 15, right: 15, alignItems: 'center', justifyContent: 'center', position: 'absolute', width: 25, height: 25, borderRadius: 5, backgroundColor: "#fff" }}>
                                <Image
                                    style={{ height: 16, width: 16, alignSelf: 'center', }}
                                    resizeMode="contain"
                                    source={ rowData.favorite == 0 ? require('../../images/heart.png') : require('../../images/fillheart.png')} />
                            </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'column', paddingHorizontal: 4 }}>
                        <Text numberOfLines={2} style={{ fontSize: 14, color: "#000", fontFamily: Fonts.SemiBold, textAlign: 'left', paddingHorizontal: 10 }}>{rowData.name}</Text>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                            <Text numberOfLines={2} style={{ flex: 1, fontSize: 12, color: "#000", fontFamily: Fonts.Light, textAlign: 'left', paddingRight: 10 }}>{rowData.category}</Text>
                            <Text numberOfLines={2} style={{ fontSize: 12, color: "#000", fontFamily: Fonts.Light, textAlign: 'left', }}>Weight: {rowData.weight} gm</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                            <FloatingLabelInput
                                label="Any Remark..."
                                cart={true}
                                value={this.state.remark}
                                keyboardType="default"
                                onChangeText={value => {
                                    this.setState({ remark: value, })
                                }}


                            />
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                            <View style={{
                                flexDirection: 'row', height: 36,
                                width: widthPercentageToDP('20%'), alignItems: 'center'
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (this.state.qty == 1) {
                                            if(rowData.product_in_cart != 0){
                                            Alert.alert(
                                                "Remove from Cart",
                                                "Are you sure want to remove this product from cart?",
                                                [
                                                  {
                                                    text: "No",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel"
                                                  },
                                                  { text: "Yes", onPress: () => {this.removeAPI(rowData)} }
                                                ]
                                              );
                                            }
                                        } else {
                                            if(rowData.product_in_cart == 0){
                                                this.setState({ qty: this.state.qty - 1 })
                                                } else {
                                                    this.setState({ qty: this.state.qty - 1 }, ()=> {
                                                        this.updateQtyAPI(rowData)
                                                    })
                                                }
                                            // , isprice: parseInt(this.state.isprice) - parseInt(this.props.route.params.data.price[this.state.id].value)})
                                        }
                                    }}
                                    style={{
                                        height: 25,
                                        width: 25,
                                        borderRadius: 13,
                                        backgroundColor: checkTheme('light').secondary,
                                        elevation: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                    <Text
                                        style={{
                                            fontFamily: Fonts.Bold,
                                            color: checkTheme('light').white,
                                            fontSize: 15,
                                            bottom: 2
                                        }}>-</Text>
                                </TouchableOpacity>

                                <Text refresh={new Date()}
                                    style={{
                                        fontFamily: Fonts.Regular, color: 'black',
                                        fontSize: 16, paddingHorizontal: 5
                                    }}>{this.state.qty}</Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        // , isprice: value
                                        // var value = parseInt(this.state.isprice) + parseInt(this.props.route.params.data.price[this.state.id].value)
                                        if(rowData.product_in_cart == 0){
                                        this.setState({ qty: this.state.qty + 1 })
                                        } else {
                                            this.setState({ qty: this.state.qty + 1 }, ()=> {
                                                this.updateQtyAPI(rowData)
                                            })
                                        }
                                    }}
                                    style={{
                                        height: 25,
                                        width: 25,
                                        borderRadius: 13,
                                        backgroundColor: checkTheme('light').secondary,
                                        elevation: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                    <Text
                                        style={{
                                            color: checkTheme('light').white,
                                            fontFamily: Fonts.Bold,
                                            fontSize: 15,
                                        }}>+</Text>
                                </TouchableOpacity>
                            </View>

                            <SmallButton visible={this.state.loading} disable={rowData.product_in_cart == 0 ? false : true} text={rowData.product_in_cart == 0 ? "Add to Cart" :  "Added"} onPress={() => {
                                this.addcartAPI(rowData)
                            }} />
                        </View>
                    </View>
                </TouchableOpacity>

            </View>
            <Modal
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    visible={this.state.modalVisible}
                    position='bottom'
                    backdrop={true}
                    coverScreen={true}
                    backdropPressToClose={false}
                    backdropOpacity={0.5}
                    transparent={true}
                    swipeToClose={false}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false })
                    }}>
                    <View style={{ height: heightPercentageToDP('100%'), width: widthPercentageToDP('100%'), backgroundColor: Platform.OS == "ios" ? "#fff" : 'rgba(0,0,0,0.8)' }}>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: Platform.OS == "ios" ? 25 : 5 }}>
                            <TouchableOpacity onPress={() => { this.onCapture() }} style={{ margin: 10, alignItems: 'center', justifyContent: 'center', height: 40, width: 40, }}>
                                <Image style={{ height: 30, width: 30, tintColor: Platform.OS == "ios" ? "#000" : 'white' }} resizeMode="contain" source={require('../../images/download.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }) }} style={{ margin: 10, alignItems: 'center', justifyContent: 'center', height: 40, width: 40, }}>
                                <Image style={{ height: 30, width: 30, tintColor: Platform.OS == "ios" ? "#000" : 'white' }} resizeMode="contain" source={require('../../images/close.png')} />
                            </TouchableOpacity>
                        </View>
                        <ViewShot collapsable={false} ref={(ref) => this.ref = ref} options={{ format: "jpg", quality: 1 }} >
                            <View
                                style={{
                                    // flex:1,
                                    flexDirection: 'column',
                                    paddingBottom: 10,
                                }}>

                                <ImageZoom cropWidth={widthPercentageToDP('100%')}
                                    cropHeight={heightPercentageToDP('80%')}
                                    imageWidth={widthPercentageToDP('100%')}
                                    imageHeight={1280 * width / 1280}
                                    enableCenterFocus={false}
                                    swipeDownThreshold={-1}
                                    minScale={1}
                                    // onStartShouldSetPanResponder={(e) => {
                                    //   return e.nativeEvent.touches.length === 2 || scaleValue.current > 1;
                                    // }}
                                    //   onMove={({ scale }) => {
                                    //     scaleValue.current = scale;
                                    //     onMove && onMove({ scale });
                                    //   }}
                                    key={`image-${rowData.id}`} >
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Image
                                            defaultSource={require('../../images/logoplaceholder.png')}
                                            resizeMode="contain"
                                            style={{ height: 1280 * width / 1280, width: width, margin: 10 }}
                                            source={{ uri: rowData.hdimage }}
                                        />

                                    </View>
                                </ImageZoom>
                                <View style={{ flexDirection: 'column', paddingHorizontal: 4, marginTop: 10 }}>
                                    <Text numberOfLines={2} style={{ fontSize: 14, color: Platform.OS == "ios" ? "#000" : "#fff", fontFamily: Fonts.SemiBold, textAlign: 'left', paddingHorizontal: 10 }}>{rowData.name}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                        <Text numberOfLines={1} style={{ fontSize: 12, color: Platform.OS == "ios" ? "#000" : "#fff", fontFamily: Fonts.Light, textAlign: 'left', paddingRight: 10 }}>{rowData.category}</Text>
                                        <Text numberOfLines={2} style={{ fontSize: 12, color: Platform.OS == "ios" ? "#000" : "#fff", fontFamily: Fonts.Light, textAlign: 'left', }}>Weight: {rowData.weight} gm</Text>
                                    </View>


                                </View>

                            </View>
                        </ViewShot>
                    </View>
                </Modal>
        </View>

    );
  }
}
