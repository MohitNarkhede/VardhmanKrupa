
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
import moment from 'moment';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Carousel from 'react-native-snap-carousel';
import SmallButton from '../../components/smallbutton';
import ProductsList from '../../components/products/product';
import { PermissionsAndroid } from 'react-native';
const SLIDER_1_FIRST_ITEM = 0;

export default class Favourite extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            scrollheader: false,
            slider2ActiveSlide: SLIDER_1_FIRST_ITEM,
            qty: 1,
            products: [],
            newtopics: [{ data: [{}, {}] }],
            retopics: [{}, {}, {}],
            current_play_session: {},
            first_name: '',
            greeting: 'Hello, ',
            mood_stat: 1,
            select_topic: {},
            loading: false,
            loading1: false,
            quote: '',
            cart_count: 0
        }

    }

    async componentDidMount() {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
        this.in2 = this.props.navigation.addListener('focus', async () => {
            this.productsAPI()
            this.countAPI()
                AsyncStorage.getItem('cart').then(cart => {
                  console.log("cart1",cart);
                  if (cart) {
                    this.setState({ cart: JSON.parse(cart) }, () => {
                      if (this.state.products.length > 0) {
                        for (let i = 0; i < this.state.products.length; i++) {
                          console.log("cart", this.state.cart);
                          this.state.cart.filter((data, index) => {
                            if (data.pid == this.state.products[i].id) {
                              if (data.product_in_cart == 1) {
                                this.state.products[i].quantity = data.quantity;
                                this.state.products[i].product_in_cart = 1;
                                this.state.products[i].cart_id = data.cart_id;
                                this.setState({ refresh: !this.state.refresh })
                              } else {
                                this.state.products[i].quantity = 1;
                                this.state.products[i].product_in_cart = 0;
                                this.state.products[i].cart_id = '';
                                this.state.cart.splice(index, 1);
                                console.log("products", this.state.products[i]);
          
                                this.setState({ refresh: !this.state.refresh }, () => {
                                  if (this.state.cart.length > 0) {
                                    AsyncStorage.setItem('cart', JSON.stringify(this.state.cart))
                                  } else {
                                    AsyncStorage.removeItem('cart')
                                    this.setState({ cart: [] })
                                  }
                                })
                                console.log("products123", this.state.products);
                                this.setState({ refresh: !this.state.refresh })
                              }
                            } else {
          
                            }
                            
                          })
                        }
                      }
                    })
                  } else {
                    this.setState({ cart: [] })
                  }
                  this.setState({ refresh: !this.state.refresh, })
          
                })
          
            let user = await AsyncStorage.getItem('user');
            // console.log(user.first_name);    
            // let first_name = JSON.parse(user).first_name;
            this.setState({ greeting: this.generateGreetings() })
            if (Platform.OS == "android") {

                const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

                const hasPermission = await PermissionsAndroid.check(permission);
                if (hasPermission) {
                    return true;
                }

                const status = await PermissionsAndroid.request(permission);
                return status === 'granted';
            }
        })

    }

    componentWillUnmount() {
        this.in2()
    }



    countAPI = async () => {
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
        console.log(JSON.stringify(Request));
        console.log(API.cart_count);
        const res = await FetchAPI(API.cart_count, "POST", Request);
        console.log(res);
        if (res.status == "success") {
            this.setState({ cart_count: res.cart_count, })
        } else if (res.status == "failed") {
            AsyncStorage.removeItem('id');
            AsyncStorage.removeItem('user');
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                }),
            );
            this.setState({ cart_count: 0 })
        } else {
            // Toast.show(res.message)
            this.setState({ cart_count: 0 })
        }
    }

    generateGreetings = () => {

        var currentHour = moment().format("HH");
        console.log(currentHour);
        if (currentHour >= 3 && currentHour < 12) {
            return "Good Morning ";
        } else if (currentHour >= 12 && currentHour < 16) {
            return "Good Afternoon ";
        } else if (currentHour >= 16 && currentHour < 20) {
            return "Good Evening ";
        } else if (currentHour >= 20 && currentHour < 3) {
            return "Hello ";
        } else {
            return "Hello ";
        }

    }

    generateImages = () => {

        var currentHour = moment().format("HH");
        console.log(currentHour);
        if (currentHour >= 3 && currentHour < 12) {
            return require('../../images/gm.png');
        } else if (currentHour >= 12 && currentHour < 16) {
            return require('../../images/ga.png');
        } else if (currentHour >= 16 && currentHour < 20) {
            return require('../../images/ge.png');
        } else if (currentHour >= 20 && currentHour < 3) {
            return require('../../images/ge.png');
        } else {
            return require('../../images/ge.png');
        }

    }




    productsAPI = async () => {
        let id = await AsyncStorage.getItem('id')
        let token = await AsyncStorage.getItem('token')
        var Request = {
            security: 1,
            token: JSON.parse(token),
            start:0
        }
        if (id) {
            Request = {
                security: 0,
                token: JSON.parse(token),
                id: JSON.parse(id),
                start:0
            }
        }
        console.log(JSON.stringify(Request));
        this.setState({ loading: true, products: [{}, {}] })
        const res = await FetchAPI(API.wishlist, "POST", Request);
        console.log(res);
        if (res.status == "success") {
            this.setState({ products: [], loading: false, product_count: res.product_count }, () => {
                this.setState({ products: res.data, })
            })
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
            this.setState({ loading: false, products: [], msg: res.message })
        }
    }


    
  addCart = (item, remark, cart_id) => {
    let cartArray = [];
    AsyncStorage.getItem('cart').then(cart => {
      console.log("cart => ", cart);

      if (cart) {
        cartArray = JSON.parse(cart);
        console.log("cartArray cart 1 ==> ", cartArray);
        var obj = {

          id: cartArray[cartArray.length - 1].id + 1,
          pid: item.id,
          quantity: item.quantity,
          remark: remark,
          cart_id: cart_id,
          product_in_cart: 1
        }
        cartArray.push(obj);
        console.log("cartArray cart 2 ==> ", cartArray);
        // console.log(cartArray);

        AsyncStorage.setItem('cart', JSON.stringify(cartArray));
      } else {
        console.log("cartArray nocart 1 ==> ", cartArray);
        var obj = {
          id: 1,
          pid: item.id,
          quantity: item.quantity,
          remark: remark,
          cart_id: cart_id,
          product_in_cart: 1
        }
        cartArray.push(obj);
        console.log("cartArray nocart 2 ==> ", cartArray);
        // console.log(cartArray);

        AsyncStorage.setItem('cart', JSON.stringify(cartArray));
      }


      this.setState({ add: true }, () => {
        AsyncStorage.getItem('cart').then(cart => {
          this.setState({ cart: JSON.parse(cart) })
          this.setState({ refresh: !this.state.refresh })
        })
      })
    });
  }

  remove = (item) => {
    if (this.state.cart) {
      for (let i = 0; i < this.state.cart.length; i++) {
        if (this.state.cart[i].pid == item.id) {
          this.state.cart.splice(i, 1);
          this.setState({ refresh: !this.state.refresh }, () => {
            if (this.state.cart.length > 0) {
              AsyncStorage.setItem('cart', JSON.stringify(this.state.cart))
            } else {
              AsyncStorage.removeItem('cart')
              this.setState({ cart: [] })
            }
          })
        }
      }
    }
  }

  UpdateQty = (item, qty) => {
    if (this.state.cart) {
      for (let i = 0; i < this.state.cart.length; i++) {
        if (this.state.cart[i].pid == item.id) {
          this.state.cart[i].quantity = qty;
          this.setState({ refresh: !this.state.refresh }, () => {
            AsyncStorage.setItem('cart', JSON.stringify(this.state.cart))
          })
        }
      }
    }
  }

  


    render() {
        let { user } = this.state;
        return (
            <ThemeContext.Consumer>{(context) => {

                const theme = context.theme;
                return (
                    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", }}>
                        <StatusBar backgroundColor={checkTheme(theme).light_gray} barStyle="dark-content" />
                        {/* <Loader loading={this.state.loading} /> */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: widthPercentageToDP('5%'), paddingTop: Platform.OS == "ios" ? 15 : 45, paddingBottom: 10 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                <Image style={{ height: 25, width: 25 }} resizeMode="contain" source={this.generateImages()} />
                                <Text style={{ fontFamily: Fonts.SemiBold, fontSize: FontSize.medium, marginLeft: 10, color: checkTheme(theme).black }}>{this.state.greeting}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Search')} style={{ paddingHorizontal: 10 }}>
                                <Image style={{ height: 25, width: 25 }} resizeMode="contain" source={require('../../images/search.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Cart')} style={{ paddingHorizontal: 10 }}>
                                <Image style={{ height: 25, width: 25 }} resizeMode="contain" source={require('../../images/bag.png')} />
                                {this.state.cart_count != 0 &&
                                    <View style={{ top: -5, right: 0, position: 'absolute', height: 20, minWidth: 20, borderRadius: 10, backgroundColor: checkTheme(theme).secondary, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: Fonts.SemiBold, fontSize: 10, paddingHorizontal: 2, color: checkTheme(theme).white }}>{this.state.cart_count}</Text>
                                    </View>
                                }
                            </TouchableOpacity>

                        </View>
                        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>

                            <FlatList

                                data={this.state.products}
                                extraData={this.state}
                                //  onEndReached={this.handLoadMore}
                                //  onEndReachedThreshold={0.01}
                                removeClippedSubviews={true}
                                //  ListFooterComponent={this.renderFooter.bind(this)}
                                initialNumToRender={10}

                                ListEmptyComponent={
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: this.state.loading ? 0 : height - 150 }}>
                                        <Text style={{ fontFamily: Fonts.SemiBold, fontSize: 14, color: checkTheme(theme).black }}>{this.state.msg}</Text>
                                    </View>
                                }
                                renderItem={({ item, index }) => (
                                    <>
                                        {this.state.loading ?
                                            <SkeletonPlaceholder>
                                                <SkeletonPlaceholder.Item flexDirection="column" alignItems="center" margin={5} borderRadius={10} width={widthPercentageToDP('50%') - 10} >
                                                    <SkeletonPlaceholder.Item flexDirection="column" alignItems="center" borderRadius={10} paddingBottom={10}  >
                                                        <SkeletonPlaceholder.Item borderRadius={10} margin={5} width={(width * .5) - 20} height={500 * ((width * .5 + 118)) / 500} />
                                                    </SkeletonPlaceholder.Item>
                                                </SkeletonPlaceholder.Item>
                                            </SkeletonPlaceholder>
                                            :
                                            <ProductsList
                                                item={item}
                                                navigation={this.props.navigation}
                                                products={this.state.products}
                                                onAddCart={(remark, cart_id) => {
                                                  console.log("item", item);
                                                  this.addCart(item, remark, cart_id)
                                                  this.setState({ cart_count: (this.state.cart_count) + 1 })
                                                }}
                                                onRemoveCart={() => {
                                                  this.remove(item)
                                                  this.setState({ cart_count: (this.state.cart_count) - 1 })
                                                }}
                                                onRefresh={() => {
                                                  this.setState({ refresh: !this.state.refresh })
                                                }}
                                                UpdateQty={(item, qty) => {
                                                  this.UpdateQty(item, qty)
                                                }}
                                                type="wishlist"

                                                product_count={this.state.product_count}
                                               
                                                loading={this.state.loading}
                                                userid={this.state.userid}
                                                image={this.state.proloader}
                                                index={index}
                                                onPress={() => {
                                                    navigation.navigate('Detail', { data: item })
                                                }}
                                            />
                                        }
                                    </>
                                )}
                                keyExtractor={item => item.id}
                                numColumns={2}
                            />
                        </ScrollView>
                    </SafeAreaView>
                )
            }}

            </ThemeContext.Consumer>
        )
    }


}
