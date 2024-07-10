
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
import ProductsList from '../../components/products/product';
import { ActivityIndicator } from 'react-native';
import CartList from '../../components/cart/cartlist';
import { Dropdown } from '../../components/react-native-element-dropdown1';
var arrCount = [];

export default class Cart extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            qty: 1,
            start: 0,
            products: [],
            metal_color: [],
            metal_purity: [],
            metal_purity1: [],
            loading: false,
            loading1: false,
            cartloading: false,
            colorid: '',
            colorname: '',
            purity: '',
            purityid: '',
            remark: '',
            modalVisible: false,
            modalVisible1: false,
            order_status: 0,
            order_status_msg: '',
            tweight: '',
            tproduct: '',
            admin_no: '',
            cart: []
        }
        arrCount = []
    }

    async componentDidMount() {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
        this.cartAPI()
        AsyncStorage.getItem('cart').then(cart => {
            if (cart) {
                this.setState({ cart: JSON.parse(cart) })
            }
        })
        let user = await AsyncStorage.getItem('user');
    }

    componentWillUnmount() {
        // this.in2()
    }




    cartAPI = async () => {
        if (arrCount.includes(this.state.start)) {
            console.log('IF Block');
            this.setState({ loading: false })
        } else {
            console.log(arrCount.length);
            if (arrCount.length == 0) {
                this.setState({ loading1: true, products: [] })
            }
            this.setState({ loading: true })
            arrCount.push(this.state.start);
            AsyncStorage.getItem('id').then(id => {
                AsyncStorage.getItem('token').then(token => {
                    var Request = {
                        security: 1,
                        token: JSON.parse(token),
                        start: this.state.start,
                    }
                    if (id) {
                        Request = {
                            security: 0,
                            token: JSON.parse(token),
                            id: JSON.parse(id),
                            start: this.state.start,
                        }
                    }
                    console.log(JSON.stringify(Request));
                    this.setState({ loading: true, })
                    NetInfo.fetch().then(state => {
                        if (state.isConnected) {
                            timeout(
                                15000,
                                fetch(API.cart, {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(Request),
                                })
                                    .then(res => res.json())
                                    .then(res => {
                                        console.log('products:::  ', res);
                                        if (res.status == 'success') {
                                            this.setState({ loading: false, loading1: false, id: id, tproduct: res.tproduct, tweight: res.tweight, order_status_msg: res.order_status_msg, admin_no: res.admin_no, order_status: res.order_status, refresh: !this.state.refresh, metal_color: res.metal_color, metal_purity: res.metal_purity, metal_purity1: res.metal_purity, products: this.state.products.concat(res.data), start: this.state.start + res.limit })
                                        } else if (res.status == "failed") {
                                            AsyncStorage.removeItem('id');
                                            AsyncStorage.removeItem('user');
                                            this.props.navigation.dispatch(
                                                CommonActions.reset({
                                                    index: 0,
                                                    routes: [{ name: 'Home' }],
                                                }),
                                            );
                                            this.setState({ loading: false, loading1: false })
                                        } else {
                                            // Toast.show(res.message)
                                            this.setState({ loading: false, loading1: false, msg: res.message, products: [] })
                                            console.log(this.state.products.length, this.state.loading, this.state.loading1);
                                        }
                                    })
                                    .catch(e => {
                                        this.setState({ loading1: false, loading: false })
                                        Toast.show(
                                            'Something went wrong...',
                                            Toast.SHORT,
                                        );
                                    }),
                            ).catch(e => {
                                this.setState({ loading1: false, loading: false })
                                Toast.show(
                                    'Request Time Out',
                                    Toast.SHORT,
                                );
                            });
                        } else {
                            this.setState({ loading1: false, loading: false })
                            Toast.show(
                                'Please Check your internet connection',
                                Toast.SHORT,
                            );
                        }
                    });

                    // const res = await FetchAPI(API.shop, "POST", Request);
                    // console.log(res);
                    // if (res.status == "success") {
                    //     this.setState({ loading: false, loading1: false, refresh: !this.state.refresh, products: this.state.products.concat(res.data), start: this.state.start + res.limit })
                    // } else if (res.status == "failed") {
                    //     AsyncStorage.removeItem('id');
                    //     AsyncStorage.removeItem('user');
                    //     this.props.navigation.dispatch(
                    //         CommonActions.reset({
                    //             index: 0,
                    //             routes: [{ name: 'Home' }],
                    //         }),
                    //     );
                    //     this.setState({ loading: false, loading1: false })
                    // } else {
                    //     // Toast.show(res.message)
                    //     this.setState({ loading: false, loading1: false, msg: res.message, products: this.state.loading1 ? [] : this.state.products })
                    // }
                })
            })
        }
    }


    handLoadMore = () => {
        this.cartAPI();
    };


    checkoutAPI = async () => {

        if (!this.state.colorid) {
            Toast.show("Please select metal color")
        } else if (!this.state.purityid) {
            Toast.show("Please select metal purity")
        } else {


            this.setState({ loading: true })
            AsyncStorage.getItem('id').then(id => {
                AsyncStorage.getItem('token').then(token => {

                    var Request = {
                        security: 0,
                        token: JSON.parse(token),
                        id: JSON.parse(id),
                        metal_color: this.state.colorid,
                        purity: this.state.purityid,
                        remark: this.state.remark,
                        data: (this.state.products)
                    }

                    console.log(API.checkout);
                    console.log(JSON.stringify(Request));
                    this.setState({ loading: true, })
                    NetInfo.fetch().then(state => {
                        if (state.isConnected) {
                            timeout(
                                15000,
                                fetch(API.checkout, {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(Request),
                                })
                                    .then(res => res.json())
                                    .then(res => {
                                        console.log('products:::  ', res);
                                        if (res.status == 'success') {
                                            AsyncStorage.removeItem('cart');
                                            this.props.navigation.navigate('Success', { orderno: res.orderno })
                                            this.setState({ loading: false, loading1: false, refresh: !this.state.refresh, })
                                        } else if (res.status == "failed") {
                                            AsyncStorage.removeItem('id');
                                            AsyncStorage.removeItem('user');
                                            this.props.navigation.dispatch(
                                                CommonActions.reset({
                                                    index: 0,
                                                    routes: [{ name: 'Home' }],
                                                }),
                                            );
                                            this.setState({ loading: false, loading1: false })
                                        } else {
                                            setTimeout(() => {
                                                Toast.show(res.message)
                                            }, 200);
                                            this.setState({ loading: false, loading1: false, msg: res.message, })
                                        }
                                    })
                                    .catch(e => {
                                        console.log("i", e);
                                        this.setState({ loading1: false, loading: false })
                                        Toast.show(
                                            'Something went wrong...',
                                            Toast.SHORT,
                                        );
                                    }),
                            ).catch(e => {
                                console.log("h", e);
                                this.setState({ loading1: false, loading: false })
                                Toast.show(
                                    'Request Time Out',
                                    Toast.SHORT,
                                );
                            });
                        } else {
                            this.setState({ loading1: false, loading: false })
                            Toast.show(
                                'Please Check your internet connection',
                                Toast.SHORT,
                            );
                        }
                    });


                })
            })
        }
    }



    renderFooter() {
        if ((this.state.products.length > 1 && this.state.loading) || this.state.loading1) {
            return (
                <View
                    style={{

                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 20,
                    }}>
                    <ActivityIndicator size="large" color={"#4d4e4e"} />
                </View>
            )
        } else {
            return false

        }
    }

    UpdateQty = (item, qty) => {
        if (this.state.cart) {
            for (let i = 0; i < this.state.cart.length; i++) {
                if (this.state.cart[i].pid == item.product_id) {
                    this.state.cart[i].quantity = qty;
                    this.setState({ refresh: !this.state.refresh }, () => {
                        AsyncStorage.setItem('cart', JSON.stringify(this.state.cart))
                    })
                }
            }
        }
    }


    renderItem = ({ item, index }) => (

        <CartList
            item={item}
            onRefresh={() => {
                this.setState({ refresh: !this.state.refresh })
            }}
            removeCart={(item) => {
                this.setState({ cartloading: true })
                console.log(this.state.cartloading);
                for (let i = 0; i < this.state.products.length; i++) {
                    if (this.state.products[i].id == item.id) {
                        this.state.products.splice(i, 1);
                        this.setState({ refresh: !this.state.refresh, cartloading: false }, () => {
                            console.log(this.state.cartloading);


                            if (this.state.products.length > 0) {
                                this.setState({ refresh: !this.state.refresh })
                            } else {

                                this.setState({ products: [], msg: 'Your cart is empty...' })
                            }
                        })
                    }
                }

                for (let i = 0; i < this.state.cart.length; i++) {
                    if (this.state.cart[i].pid == item.product_id) {
                        // this.state.cart.splice(i, 1);
                        this.state.cart[i].product_in_cart = 0;
                        this.setState({ refresh: !this.state.refresh }, () => {
                            if (this.state.cart.length > 0) {
                                console.log("kakak", this.state.cart);
                                AsyncStorage.setItem('cart', JSON.stringify(this.state.cart))
                            } else {
                                AsyncStorage.removeItem('cart')
                                this.setState({ cart: [] })
                            }
                        })
                    }
                }

            }}
            UpdateQty={(item, qty) => {
                this.UpdateQty(item, qty)
            }}
            loading={this.state.loading}
            userid={this.state.userid}
            image={this.state.proloader}
            index={index}

        />

    )

    render() {
        let { user } = this.state;
        let tweight = 0;
        for (let i = 0; i < this.state.products.length; i++) {
            tweight = tweight + parseFloat(this.state.products[i].weight * parseFloat(this.state.products[i].quantity))
        }
        return (
            <ThemeContext.Consumer>{(context) => {

                const theme = context.theme;
                return (
                    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2", }}>
                        <StatusBar backgroundColor={checkTheme(theme).light_gray} barStyle="dark-content" />
                        {/* <Loader loading={this.state.cartloading} /> */}

                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: widthPercentageToDP('2%'), paddingRight: widthPercentageToDP('5%'), paddingTop: Platform.OS == "ios" ? 15 : 35, paddingBottom: 10 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ padding: 5 }}>
                                    <Image style={{ height: 28, width: 28, tintColor: checkTheme(theme).black }} resizeMode="contain" source={require('../../images/leftarrow.png')} />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: Fonts.SemiBold, fontSize: FontSize.medium, color: checkTheme(theme).black }}>{'Cart'}</Text>
                            </View>


                        </View>
                        {/* {this.state.cartloading ?
                        <Text style={{fontSize:14, fontFamily: Fonts.Regular, color: checkTheme(theme).black, textAlign:'center', backgroundColor: checkTheme(theme).white}}>Loading...</Text>
                        : null } */}
                        <ScrollView>
                            <FlatList
                                // contentContainerStyle={{ flexGrow: 1 }}
                                data={this.state.products}
                                extraData={this.state.refresh}
                                removeClippedSubviews={true}
                                // maxToRenderPerBatch={800}
                                // updateCellsBatchingPeriod={1000}
                                // disableVirtualization={true}
                                // legacyImplementation={true}
                                // onEndReached={this.handLoadMore}
                                // onEndReachedThreshold={0.2}
                                // windowSize={10}
                                // maxToRenderPerBatch={10}
                                // getItemLayout={(data, index) => (
                                //     {length: heightPercentageToDP('50%'), offset: heightPercentageToDP('50%') * index, index}
                                // )}
                                ListFooterComponent={this.renderFooter.bind(this)}
                                initialNumToRender={10}
                                ListEmptyComponent={
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: this.state.loading ? 0 : height - 150 }}>
                                        <Text style={{ fontFamily: Fonts.SemiBold, fontSize: 14, color: checkTheme(theme).black }}>{this.state.msg}</Text>
                                    </View>
                                }
                                keyExtractor={(item, index) => item.id}
                                renderItem={this.renderItem}
                            />

                            {(this.state.products.length == 0 || this.state.loading1) ? null :
                                <View style={{ marginHorizontal: widthPercentageToDP('5%'), marginTop: 10 }}>
                                    <View style={{ flex: 1, flexDirection: 'column', padding: 10 }}>
                                        <Text numberOfLines={1} style={{ fontSize: 18, color: "#000", fontFamily: Fonts.Light, textAlign: 'left', paddingRight: 10 }}>Total Products: {this.state.products.length}</Text>
                                        <Text numberOfLines={2} style={{ fontSize: 18, color: "#000", paddingTop: 2, fontFamily: Fonts.Light, textAlign: 'left', }}>Total Weight: {(tweight).toFixed(2)} gm</Text>
                                    </View>

                                    <Dropdown

                                        placeholder="Metal Color"
                                        value={this.state.colorname}
                                        onChange={(item) => {
                                            this.setState({ colorid: item.id, colorname: item.name }, () => {
                                                if (item.purity_data) {
                                                    this.setState({ metal_purity: item.purity_data, purityid: '', purity: '' })
                                                } else {
                                                    this.setState({ metal_purity: this.state.metal_purity1 })
                                                }
                                            })
                                        }}
                                        data={this.state.metal_color}
                                    />

                                    <Dropdown

                                        placeholder="Metal Purity"
                                        value={this.state.purity}
                                        onChange={(item) => { this.setState({ purityid: item.id, purity: item.name }) }}
                                        data={this.state.metal_purity}
                                    />


                                    <FloatingLabelInput
                                        label="Enter Remarks"
                                        value={this.state.remark}
                                        error={this.state.remarkerror}
                                        onChangeText={value => {
                                            this.setState({ remark: value, remarkerror: null })
                                        }}
                                    />

                                    <Button visible={this.state.loading} disable={this.state.disable} text="Checkout" onPress={() => {
                                        if (this.state.id) {
                                            if (this.state.order_status != 0) {
                                                this.checkoutAPI()
                                            } else {
                                                this.setState({ modalVisible1: true })
                                            }
                                        } else {
                                            this.setState({ modalVisible: true })
                                        }
                                        // this.props.navigation.navigate('Success')
                                    }} />

                                </View>
                            }
                        </ScrollView>

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
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    // this.setState({ modalVisible: false })
                                }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>

                                <View style={{ minHeight: 163, overflow: 'hidden', backgroundColor: 'white', width: '95%', alignSelf: 'center', borderRadius: 10 }}>
                                    <TouchableOpacity
                                        styles={{ height: 25, width: 60, }}
                                        onPress={() => {

                                            this.setState({ modalVisible: false })
                                        }}>
                                        <Image
                                            resizeMode="contain"
                                            style={{
                                                width: 18,
                                                alignSelf: 'flex-end',
                                                margin: 10,
                                                height: 18
                                            }}
                                            source={require('../../images/close.png')}
                                        /></TouchableOpacity>
                                    <View style={{ flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({ modalVisible: false }, () => {
                                                this.props.navigation.navigate('SignupOne', { type: 2, fname: '', lname: '', email: '', stoken: '' })
                                            })
                                        }} style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', backgroundColor: checkTheme(theme).light_gray, justifyContent: 'center' }}>
                                            <Text style={{ flex: 1, fontSize: 16, fontFamily: Fonts.Light, color: checkTheme(theme).black }}>Are you not on VardhmanKrupa yet?  </Text>
                                            <Text style={{ fontSize: 16, fontFamily: Fonts.Regular, color: checkTheme(theme).primary }}>New User?</Text>
                                        </TouchableOpacity>

                                        <View style={{ height: 1, width: '100%', backgroundColor: checkTheme(theme).medium_gray }} />

                                        <TouchableOpacity onPress={() => {
                                            this.setState({ modalVisible: false }, () => {
                                                this.props.navigation.dispatch(
                                                    CommonActions.reset({
                                                        index: 0,
                                                        routes: [{ name: 'Login' }],
                                                    }),
                                                );
                                            })
                                        }} style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', backgroundColor: checkTheme(theme).light_gray, justifyContent: 'center' }}>
                                            <Text style={{ flex: 1, fontSize: 16, fontFamily: Fonts.Light, color: checkTheme(theme).black }}>Are you member of VardhmanKrupa?  </Text>
                                            <Text style={{ fontSize: 16, fontFamily: Fonts.Regular, color: checkTheme(theme).primary }}>Log in?</Text>
                                        </TouchableOpacity>
                                    </View>


                                </View>


                            </TouchableOpacity>
                        </Modal>


                        <Modal
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            visible={this.state.modalVisible1}
                            position='bottom'
                            backdrop={true}
                            coverScreen={true}
                            backdropPressToClose={false}
                            backdropOpacity={0.5}
                            transparent={true}
                            swipeToClose={false}
                            onRequestClose={() => {
                                this.setState({ modalVisible1: false })
                            }}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    // this.setState({ modalVisible: false })
                                }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>

                                <View style={{ minHeight: 200, overflow: 'hidden', backgroundColor: 'white', width: '95%', alignSelf: 'center', borderRadius: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 16, padding: 5, paddingLeft: 10, fontFamily: Fonts.Light, color: checkTheme(theme).black }}>{"Alert"}  </Text>
                                        <TouchableOpacity
                                            styles={{ height: 25, width: 60, }}
                                            onPress={() => {

                                                this.setState({ modalVisible1: false })
                                            }}>
                                            <Image
                                                resizeMode="contain"
                                                style={{
                                                    width: 18,
                                                    alignSelf: 'flex-end',
                                                    margin: 10,
                                                    height: 18
                                                }}
                                                source={require('../../images/close.png')}
                                            /></TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                                        <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 10, alignItems: 'center', backgroundColor: checkTheme(theme).light_gray, justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 16, fontFamily: Fonts.Light, textAlign: 'center', paddingVertical: 10, marginTop: 10, color: checkTheme(theme).red }}>{this.state.order_status_msg}  </Text>
                                            <Button visible={this.state.loading} disable={this.state.disable} text="Contact Us" onPress={() => { Linking.openURL('tel:' + this.state.admin_no) }} />
                                        </View>



                                    </View>


                                </View>


                            </TouchableOpacity>
                        </Modal>

                    </SafeAreaView>
                )
            }}

            </ThemeContext.Consumer>
        )
    }


}
