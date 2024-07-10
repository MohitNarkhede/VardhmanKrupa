
import React, { Component } from 'react';
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
import MultiSlider from "../../components/MultiSlider/MultiSlider";
import { Dropdown } from '../../components/react-native-element-dropdown';
import { PermissionsAndroid } from 'react-native';

var arrCount = [];

class Products extends Component {
  constructor(props) {
    super(props)
    this.state = {
      qty: 1,
      start: 0,
      products: [],
      sortby: '',
      loading: true,
      loading1: false,
      cat_ids: this.props.route.params?.cat_data?.id ? [this.props.route.params?.cat_data?.id] : [],
      subcat_ids: this.props.route.params?.subcat_data?.id ? [this.props.route.params?.subcat_data?.id] : [],
      cart_count: 0,
      filterValue: '1',
      minWeight: 0,
      maxWeight: 0,
      trending: 0,
      new_arrival: 0,
      defaultmin: 0,
      defaultmax: 0,
      weight_min: null,
      weight_max: null,
      filter: [
        {
          name: 'Category',
          id: 1
        },
        {
          name: 'Sub category',
          id: 2
        },
        {
          name: 'Weight',
          id: 3
        },

      ],
      Categorydata: [],
      refresh: false,
      subCategorydata: [],
      cart: [],

      descriptionModal:parseInt(this.props.route.params?.popup) === 1 ? true :  false,
      popup: this.props.route.params?.popup,
      popup_desc: this.props.route.params?.popup_desc,
      popup_tite: this.props.route.params?.popup_tite,

    }
    arrCount = []
  }

  
  async componentDidMount() {
    if (this.props.route.params?.cat_data?.id) {
      this.setState({
        filterValue: '3',
        filter: [
          {
            name: 'Weight',
            id: 3
          },
        ],
      })
    }
    this.setState({
      start: 0,
      products: [],
      sortby: '',
    }, () => {
      arrCount = [];
      this.productsAPI()
      this.filterAPI()
    })
    // AsyncStorage.removeItem('cart')

    this.in5 = this.props.navigation.addListener('focus', async () => {
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
    })


    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])


    let user = await AsyncStorage.getItem('user');
    if (Platform.OS == "android") {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) {
        return true;
      }

      const status = await PermissionsAndroid.request(permission);
      return status === 'granted';
    }
  }

  componentWillUnmount() {
    this.in5()
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

  filterAPI = async () => {
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
    console.log(API.filterlist);
    const res = await FetchAPI(API.filterlist, "POST", Request);
    console.log(res);
    if (res.status == "success") {
      this.setState({ loading: false, })
      if (res.category.length > 0) {
        this.setState({
          Categorydata: res.category,
        })
      }
      if (res.subcategory.length > 0) {
        this.setState({
          subCategorydata: res.subcategory,
        })
      }
      this.setState({
        loading: false,
        defaultmax: res.weight_max,
        defaultmin: res.weight_min,
        minWeight: res.weight_min,
        maxWeight: res.weight_max,
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
      this.setState({ cart_count: 0, loading1: false, loading: false })
    } else {
      // Toast.show(res.message)
      this.setState({ cart_count: 0, loading1: false, loading: false })
    }
  }

  productsAPI = () => {
    if (arrCount.includes(this.state.start)) {
      this.setState({ loading: false })
    } else {
      if (arrCount.length == 0) {
        this.setState({ loading: true })
      }
      this.setState({ loading1: true })
      arrCount.push(this.state.start);
      AsyncStorage.getItem('id').then(id => {
        AsyncStorage.getItem('token').then(token => {

          if (id) {
            var Request = {
              security: 0,
              token: JSON.parse(token),
              id: JSON.parse(id),
              category: this.state.cat_ids,
              subcategory: this.state.subcat_ids,
              start: this.state.start,
              weight_min: this.state.weight_min,
              weight_max: this.state.weight_max,
              new_arrival: this.state.new_arrival,
              trending: this.state.trending,
            }
          } else {
            var Request = {
              security: 1,
              token: JSON.parse(token),
              category: this.state.cat_ids,
              subcategory: this.state.subcat_ids,
              start: this.state.start,
              weight_min: this.state.weight_min,
              weight_max: this.state.weight_max,
              new_arrival: this.state.new_arrival,
              trending: this.state.trending,
            }
          }
          console.log(JSON.stringify(Request));
          // this.setState({ loading: true, })
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.shop, {
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
                      this.setState({
                        loading: false, loading1: false, products: this.state.products.concat(res.data),
                        start: this.state.start + res.limit, cart_count: res.cart_count, refresh: !this.state.refresh,
                        product_count: res.product_count
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
                      this.setState({ loading: false, loading1: false })
                    } else {
                      // Toast.show(res.message)
                      this.setState({ loading: false, loading1: false, msg: res.message, products: this.state.loading ? [] : this.state.products })
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
    this.productsAPI();
  };


  renderFooter() {
    if ((this.state.products.length > 1 && this.state.loading1) || this.state.loading) {
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


  multiWeightValuesChange = values => {
    this.setState({
      minWeight: values[0],
      maxWeight: values[1],
      weight_min: values[0],
      weight_max: values[1]
    });
  };

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
    let data = [{
      name: 'New Arrivals',
      id: '1',
    }, {
      name: 'Trending',
      id: '2',
    }];
    console.log(this.state.popup,this.state.popup_desc,this.state.popup_tite,'props data');
    return (
      <ThemeContext.Consumer>{(context) => {

        const theme = context.theme;
        return (
          <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2", }}>
            <StatusBar backgroundColor={checkTheme(theme).light_gray} barStyle="dark-content" />
            {/* <Loader loading={this.state.loading} /> */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: widthPercentageToDP('2%'), paddingRight: widthPercentageToDP('5%'), paddingTop: Platform.OS == "ios" ? 15 : 35, paddingBottom: 10 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ padding: 5 }}>
                  <Image style={{ height: 28, width: 28, tintColor: checkTheme(theme).black }} resizeMode="contain" source={require('../../images/leftarrow.png')} />
                </TouchableOpacity>
                <Text style={{ fontFamily: Fonts.SemiBold, fontSize: FontSize.medium, color: checkTheme(theme).black }}>{this.props.route.params.subcat_data.name}</Text>
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
            <View style={{ flex: 1, backgroundColor: checkTheme(theme).white }}>

              <FlatList
                data={this.state.products}
                extraData={this.state}
                onEndReached={this.handLoadMore}
                onEndReachedThreshold={0.01}
                ItemSeparatorComponent={(props) => <View style={{ height: 1 }} />}

                removeClippedSubviews={true}
                ListFooterComponent={this.renderFooter.bind(this)}
                initialNumToRender={10}
                ListEmptyComponent={
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: this.state.loading ? 0 : height - 150 }}>
                    <Text style={{ fontFamily: Fonts.SemiBold, fontSize: 14, color: checkTheme(theme).black }}>{this.state.msg}</Text>
                  </View>
                }

                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                  <ProductsList
                    item={item}
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
                    loading={this.state.loading}
                    index={index}
                    navigation={this.props.navigation}
                    type="shop"
                    cat_ids={this.state.cat_ids}
                    subcat_ids={this.state.subcat_ids}
                    weight_min={this.state.weight_min}
                    weight_max={this.state.weight_max}
                    new_arrival={this.state.new_arrival}
                    trending={this.state.trending}
                    product_count={this.state.product_count}
                  />
                )}
                numColumns={2}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: 'space-around', backgroundColor: '#f2f2f2', paddingBottom: 10 }}>
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', paddingHorizontal: 15,
                borderRadius: 20, borderWidth: 0.5, borderColor: 'black',
                height: 40, marginTop: 10, width: widthPercentageToDP('40%')
              }}>
                <Dropdown
                  // search
                  // searchPlaceholder="Search Study"
                  placeholder="Sort by"
                  value={this.state.sortby}
                  onChange={(item) => {
                    this.setState({ sortbyid: item.id, sortby: item.name }, () => {
                      if (this.state.sortbyid == "1") {
                        arrCount = [];
                        this.setState({ new_arrival: 1, trending: 0, products: [], start: 0 }, () => {
                          this.productsAPI()
                        })
                      } else if (this.state.sortbyid == "2") {
                        arrCount = [];
                        this.setState({ new_arrival: 0, trending: 1, products: [], start: 0 }, () => {
                          this.productsAPI()
                        })
                      }
                    })
                  }}
                  data={data}
                />

                {/* <Dropdown
              containerStyle={{
                flex: 1,
                paddingLeft: 5,

                paddingBottom: 20,
              }}

              fontSize={16}

              itemTextStyle={{ fontFamily: Fonts.Regular, color: checkTheme(theme).primary }}
              itemColor={checkTheme(theme).black}
              pickerStyle={{ width: 200, height: 300, top: height - 350 }}
              fontFamily={Fonts.Regular}

              selectedItemColor={checkTheme(theme).black}
              labelExtractor={({ title }) => title}
              valueExtractor={({ value }) => value}
              textColor={this.state.sortby ? checkTheme(theme).black : checkTheme(theme).black}

              value={this.state.sortby ? this.state.sortby : 'Sort By'}
              onChangeText={(value) => {
                this.setState({ sortby: value }, () => {
                  this.setState({
                    start: 0, Products: [],
                  }, () => {
                    arrCount = [];
                    this.Product()

                  })
                })
              }}
              data={data}
            /> */}

              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.setState({ modalVisible: true })}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  justifyContent: 'space-between', paddingHorizontal: 15,
                  borderRadius: 20, borderWidth: 0.5, borderColor: 'black',
                  width: widthPercentageToDP('32%'), height: 40, marginTop: 10,
                }}>
                <Text numberOfLines={1} style={{
                  fontFamily: Fonts.Regular,
                  color: checkTheme(theme).dark_gray,
                  paddingVertical: 1.5,
                  fontSize: 15
                }}>{'Filter by'}</Text>
                <Image resizeMode={'contain'}
                  style={{ height: 17, width: 17, tintColor: 'black' }}
                  source={require('../../images/filter.png')} />
              </TouchableOpacity>
            </View>

            {this.state.modalVisible ?
              <Modal
                transparent={true}
                animationType={"fade"}
                onRequestClose={() => {
                  this.setState({ modalVisible: false })
                }}
                visible={this.state.modalVisible}
              >
                <View
                  style={{
                    height: Platform.OS == 'android' ? heightPercentageToDP("100%") : heightPercentageToDP("100%") - 28,
                    width: widthPercentageToDP("100%"),
                    backgroundColor: checkTheme(theme).white,
                    position: "absolute",
                    bottom: 0,
                  }} refresh={this.state.refresh}>

                  <View style={{
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: 'rgba(0, 0, 0, .2)', alignItems: 'center', flexDirection: 'row', width: '100%', paddingHorizontal: 10, height: 50, backgroundColor: '#f2f2f2'
                  }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          cat_ids: [],
                          subcat_ids: [],
                          weight_min: null,
                          weight_max: null,
                          minWeight: this.state.defaultmin,
                          maxWeight: this.state.defaultmax,
                        }, () => {
                          this.setState({
                            modalVisible: false
                          })
                        })
                      }}
                      style={{ height: 25, width: 25, justifyContent: 'center', alignItems: 'center', }}>
                      <Image style={{ height: 20, width: 20, tintColor: 'black' }} resizeMode="contain"
                        source={require('../../images/leftarrow.png')} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: Fonts.Light, fontSize: 18, color: checkTheme(theme).black, paddingLeft: 20 }}>Filter By</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>

                    <View style={{ width: '30%', justifyContent: 'flex-start', alignSelf: 'flex-start', }}>
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.state.filter}
                        removeClippedSubviews={true}
                        style={{ marginBottom: 122 }}
                        extraData={this.state.refresh}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity key={index}
                            onPress={() => {
                              this.setState({ filterValue: item.id, }, () => {
                              });
                            }}
                            style={{
                              width: '100%', paddingVertical: 15, borderBottomWidth: 1, borderTopWidth: 1, borderTopColor: checkTheme(theme).light_gray,
                              backgroundColor: this.state.filterValue == item.id ? checkTheme(theme).background : null,
                              borderBottomColor: this.state.filterValue == item.id ? '#ccc' : '#ccc'
                            }}>
                            <Text
                              style={{
                                textAlign: "left",
                                width: '90%',
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                fontFamily: this.state.filterValue == item.id ? Fonts.SemiBold : Fonts.Light,
                                fontSize: 15,
                                color: this.state.filterValue == item.id ? checkTheme(theme).black : checkTheme(theme).black
                              }}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => String(index)}
                      />

                    </View>
                    <View style={{ height: '100%', width: 1, backgroundColor: '#ccc', }} />
                    {/* manage by filter id  */}

                    {this.state.filterValue == '1' ?
                      <ScrollView style={{ alignSelf: 'flex-start', marginBottom: Platform.OS == 'ios' ? 100 : 0 }}>


                        <View style={{ width: '100%', justifyContent: 'flex-start', alignSelf: 'flex-start', paddingBottom: 10 }}>
                          {this.state.Categorydata.map((item, index) => {
                            return (


                              <TouchableOpacity
                                style={{ width: '100%', paddingVertical: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}
                                onPress={() => {
                                  let { cat_ids } = this.state;
                                  if (this.state.cat_ids.includes(item.id)) {
                                    const index1 = cat_ids.indexOf(item.id);
                                    if (index1 > -1) {
                                      cat_ids.splice(index1, 1);
                                    }
                                  } else {
                                    this.state.cat_ids.push(item.id)
                                  }

                                  this.setState({ cat_ids }, () => {
                                    this.setState({ refresh: !this.state.refresh })
                                  })
                                }}
                              >

                                <View

                                  style={{ height: 25, width: 25, borderRadius: 12.5, justifyContent: 'center', alignSelf: 'flex-start', alignItems: 'center', borderWidth: 1, borderColor: 'black' }}>
                                  {this.state.cat_ids.includes(item.id) ?
                                    <Image source={require('../../images/check.png')} style={{ height: 10, width: 15, tintColor: 'green' }} /> : null}
                                </View>


                                <Text
                                  style={{
                                    textAlign: "left",
                                    width: '90%',
                                    paddingHorizontal: 6,
                                    color: checkTheme(theme).black,
                                    fontFamily: Fonts.Regular,
                                    fontSize: Fonts.Small,
                                  }}>
                                  {item.name}
                                </Text>
                              </TouchableOpacity>



                            );
                          })}
                        </View>
                      </ScrollView>
                      : null}

                    {this.state.filterValue == '2' ?
                      <ScrollView style={{ alignSelf: 'flex-start', marginBottom: Platform.OS == 'ios' ? 100 : 0 }}>

                        <View style={{ width: '100%', justifyContent: 'flex-start', alignSelf: 'flex-start', paddingBottom: 10 }}>

                          {this.state.subCategorydata.map((item, index) => {
                            return (


                              <TouchableOpacity
                                style={{ width: '100%', paddingVertical: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}
                                onPress={() => {
                                  let { subcat_ids } = this.state;
                                  if (this.state.subcat_ids.includes(item.id)) {
                                    const index1 = subcat_ids.indexOf(item.id);
                                    if (index1 > -1) {
                                      subcat_ids.splice(index1, 1);
                                    }
                                  } else {
                                    this.state.subcat_ids.push(item.id)
                                  }

                                  this.setState({ subcat_ids }, () => {
                                    this.setState({ refresh: !this.state.refresh })
                                  })
                                }}
                              >

                                <View

                                  style={{ height: 25, width: 25, borderRadius: 12.5, justifyContent: 'center', alignSelf: 'flex-start', alignItems: 'center', borderWidth: 1, borderColor: 'black' }}>
                                  {this.state.subcat_ids.includes(item.id) ?
                                    <Image source={require('../../images/check.png')} style={{ height: 10, width: 15, tintColor: 'green' }} /> : null}
                                </View>


                                <Text
                                  style={{
                                    textAlign: "left",
                                    width: '90%',
                                    paddingHorizontal: 6,
                                    color: checkTheme(theme).black,
                                    fontFamily: Fonts.Regular,
                                    fontSize: Fonts.Small,
                                  }}>
                                  {item.name}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </ScrollView>

                      : null}





                    {this.state.filterValue == '3' ?
                      <View style={{ width: '60%', justifyContent: 'center', alignSelf: 'center' }}>
                        <View style={{
                          width: width * .5,

                          alignSelf: 'center',
                          paddingHorizontal: 15,

                        }}>
                          <MultiSlider
                            values={[
                              this.state.minWeight,
                              this.state.maxWeight,
                            ]}
                            selectedStyle={{
                              backgroundColor: checkTheme(theme).black,
                            }}
                            unselectedStyle={{
                              backgroundColor: checkTheme(theme).medium_gray,
                            }}
                            markerStyle={{ backgroundColor: checkTheme(theme).primary }}
                            sliderLength={width * .45}
                            onValuesChange={this.multiWeightValuesChange}
                            min={this.state.defaultmin}
                            max={this.state.defaultmax}
                            step={1}
                            allowOverlap
                            snapped
                          />
                        </View>

                        <View style={{
                          width: width * .45,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginHorizontal: 10,
                          alignSelf: 'center'
                        }}>

                          <Text style={{ fontSize: 14, fontFamily: Fonts.Medium, color: checkTheme(theme).black }}>Min {this.state.minWeight} </Text>
                          <Text style={{ fontSize: 14, fontFamily: Fonts.Medium, color: checkTheme(theme).black }}>Max {this.state.maxWeight}</Text>
                        </View>


                      </View>
                      : null}




                  </View>

                  <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    <TouchableOpacity onPress={() => {
                      if (this.props.route.params?.cat_data?.id) {
                        this.setState({

                          weight_min: null,
                          weight_max: null,
                          minWeight: this.state.defaultmin,
                          maxWeight: this.state.defaultmax,



                        }, () => {
                          this.setState({
                            start: 0, products: [], modalVisible: false
                          }, () => {
                            arrCount = [];
                            this.productsAPI()

                          })
                        })
                      }
                      else {
                        this.setState({
                          cat_ids: [],
                          subcat_ids: [],
                          weight_min: null,
                          weight_max: null,
                          minWeight: this.state.defaultmin,
                          maxWeight: this.state.defaultmax,



                        }, () => {
                          this.setState({
                            start: 0, products: [], modalVisible: false
                          }, () => {
                            arrCount = [];
                            this.productsAPI()

                          })
                        })
                      }
                    }} style={{ height: 50, width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: checkTheme(theme).dark_gray }}>
                      <Text style={{ fontFamily: Fonts.Bold, color: 'white' }}>RESET</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                      this.setState({
                        start: 0, products: [], modalVisible: false
                      }, () => {
                        arrCount = [];
                        this.productsAPI()

                      })

                    }} style={{ height: 50, width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: checkTheme(theme).primary }}>
                      <Text style={{ fontFamily: Fonts.Bold, color: 'white' }}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              : null}

              <Modal
                transparent={true}
                animationType={"fade"}
                visible={this.state.descriptionModal}>

                <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.3)',justifyContent:'center',alignItems:'center'}}>
                    <View style={{height:'auto',width:'80%',backgroundColor:'white',borderRadius:10}}>
                    <View style={{height:45,width:'100%',backgroundColor:checkTheme(theme).light_gray,justifyContent:'center',alignItems:'center',borderTopRightRadius:10,borderTopLeftRadius:10}}>
                      <Text style={{fontFamily:Fonts.Bold,alignSelf:'center',fontSize:23,color: checkTheme(theme).primary,backgroundColor:checkTheme(theme)}}>
                      {this.state.popup_tite} 
                      </Text>
                    </View>
                      
                    <View style={{paddingRight:23,paddingLeft:23,paddingTop:0,paddingBottom:10,}}>
                        <Text style={{fontFamily:Fonts.Regular,fontSize:14,marginTop:5,color: checkTheme(theme).black}}>
                          {this.state.popup_desc}
                        </Text>

                        <TouchableOpacity onPress={()=>this.setState({descriptionModal:false})}
                        style={{height:40,alignSelf:'flex-end',width:'40%',marginTop:10,borderRadius:10,backgroundColor:checkTheme(theme).primary,justifyContent:'center',alignItems:'center'}}>
                          <Text style={{fontFamily:Fonts.Medium,color:checkTheme(theme).fixwhite,fontSize:18}}>OK</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>

              </Modal>
          </SafeAreaView>
        )
      }}

      </ThemeContext.Consumer>
    )
  }
}

export default Products;
