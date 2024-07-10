
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
  TouchableHighlight,
  PermissionsAndroid,
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
import ProductsList from '../../components/products/product';
import { ActivityIndicator } from 'react-native';
import MultiSlider from "../../components/MultiSlider/MultiSlider";
import { Dropdown } from '../../components/react-native-element-dropdown';

let arrCount = [];

export default class Search extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      scrollheader: false,
      loading: false,
      search: "",
      searchData: [],
      focus: false,
      loading1: false,
      start: 0,
      products: [],
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],

      cat_ids: [],
      subcat_ids: [],
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

      subCategorydata: [],


    }
    arrCount = []




  }

  componentDidMount() {
    this.setState({
      start: 0,
      products: [],
      sortby: '',
    }, () => {
      arrCount = [];
      this.filterAPI()
    })
    AsyncStorage.getItem('search').then(search => {
      console.log(search);
      if (search) {
        this.setState({ searchData: JSON.parse(search), })

      } else {

      }
    })
    this.in5 = this.props.navigation.addListener('focus', async () => {
      AsyncStorage.getItem('cart').then(cart => {
        console.log("cart1", cart);
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


    this.permission()
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
  }


  componentWillUnmount() {
    this.in5()
  }

  permission = async () => {
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


  add = () => {
    AsyncStorage.getItem('search').then(search1 => {
      console.log(search1);
      if (search1) {
        let final = JSON.parse(search1);
        console.log(final);
        if (final.includes(this.state.search)) {

        } else {
          this.state.searchData.push(this.state.search);
          AsyncStorage.setItem('search', JSON.stringify(this.state.searchData));
          console.log(this.state.searchData);
          this.setState({ refresh: !this.state.refresh })
        }

      } else {
        this.state.searchData.push(this.state.search);
        AsyncStorage.setItem('search', JSON.stringify(this.state.searchData));
        this.setState({ refresh: !this.state.refresh })
      }
    })
  }

  remove = (index) => {
    if (this.state.searchData.length > 1) {
      this.state.searchData.splice(index, 1);
      AsyncStorage.setItem('search', JSON.stringify(this.state.searchData));
      this.setState({ refresh: !this.state.refresh })
    } else {
      AsyncStorage.removeItem('search');
      this.setState({ refresh: !this.state.refresh, searchData: [] })
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
      this.setState({ cart_count: 0 })
    } else {
      // Toast.show(res.message)
      this.setState({ cart_count: 0 })
    }
  }


  searchAPI = async () => {
    if (arrCount.includes(this.state.start)) {
      console.log('IF Block');
      this.setState({ loading: false })
    } else {
      console.log(arrCount.length);
      if (arrCount.length == 0) {
        this.setState({ loading1: true, products: [] })
      }
      // this.setState({ loading: true })
      arrCount.push(this.state.start);
      AsyncStorage.getItem('id').then(id => {
        AsyncStorage.getItem('token').then(token => {
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
            value: this.state.search

          }
          if (id) {
            Request = {
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
              value: this.state.search
            }
          }
          console.log(JSON.stringify(Request));
          this.setState({ loading: true, })
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.search, {
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
                      this.setState({ loading: false, loading1: false, products: this.state.products.concat(res.data), start: this.state.start + res.limit, refresh: !this.state.refresh, product_count: res.product_count })
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
                      console.log(this.state.loading1);
                      this.setState({ loading: false, loading1: false, msg: res.message, products: this.state.loading1 ? [] : this.state.products })
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


        })
      })
    }
  }


  handLoadMore = () => {
    this.searchAPI();
  };


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
          // this.state.cart.splice(i, 1);
          this.state.cart[i].product_in_cart = 0;
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


  renderItem = ({ item, index }) => (

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
      // userid={this.state.userid}
      // image={this.state.proloader}
      index={index}
      navigation={this.props.navigation}
      type="search"
      cat_ids={this.state.cat_ids}
      subcat_ids={this.state.subcat_ids}
      weight_min={this.state.weight_min}
      weight_max={this.state.weight_max}
      new_arrival={this.state.new_arrival}
      trending={this.state.trending}
      product_count={this.state.product_count}
      value={this.state.search}

    />

  )


  multiWeightValuesChange = values => {
    console.log(values, this.state.minWeight, this.state.maxWeight);
    this.setState({
      minWeight: values[0],
      maxWeight: values[1],
      weight_min: values[0],
      weight_max: values[1]
    });
  };

  render() {
    let { user } = this.state;
    let data = [{
      name: 'New Arrivals',
      id: '1',
    }, {
      name: 'Trending',
      id: '2',
    }];
    return (
      <ThemeContext.Consumer>{(context) => {

        const theme = context.theme;
        return (
          <SafeAreaView style={{ flex: 1, backgroundColor: "white", }}>
            <StatusBar backgroundColor={checkTheme(theme).white} barStyle="dark-content" />
            {/* <Loader loading={this.state.loading} /> */}

            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: widthPercentageToDP('2%'), paddingRight: widthPercentageToDP('5%'), paddingTop: Platform.OS == "ios" ? 15 : 35, paddingBottom: 10 }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ width: widthPercentageToDP('10%'), justifyContent: 'flex-start', alignItems: 'center', padding: 5 }}>
                <Image style={{ height: 25, width: 25, tintColor: checkTheme(theme).black }} resizeMode="contain" source={require('../../images/arrowleft.png')} />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: "#F8F8F8", borderRadius: 10, width: widthPercentageToDP('85%') }}>
                <Image style={{ height: 25, width: 25, marginHorizontal: 10, tintColor: checkTheme(theme).medium_gray }} resizeMode="contain" source={require('../../images/search.png')} />
                <TextInput style={{ fontFamily: Fonts.Regular, color: checkTheme(theme).black, fontSize: FontSize.medium, flex: 1, paddingVertical: Platform.OS == 'ios' ? 12 : 10 }} placeholderTextColor={checkTheme(theme).dark_gray} placeholder="Search"
                  onChangeText={(text) => {
                    this.setState({ search: text }, () => {
                      // console.log(this.state.search.length);
                      if (this.state.search.length > 3) {
                        arrCount = [];
                        this.setState({ products: [], start: 0 }, () => {
                          setTimeout(() => {
                          this.searchAPI()
                        }, 500);
                        })

                      } else {
                        this.setState({ products: [] })
                      }
                    })
                  }}
                  value={this.state.search}
                  onFocus={() => this.setState({ focus: true })}
                  onBlur={() => this.setState({ focus: false })}
                  onSubmitEditing={() => {
                    this.add()
                  }}
                />
                {this.state.search.length > 0 &&
                  <TouchableHighlight underlayColor={checkTheme(theme).primary} onPress={() => { this.setState({ search: '' }) }} style={{ padding: 5 }}>
                    <Image style={{ height: 22, width: 22, marginHorizontal: 10, }} resizeMode="contain" source={require('../../images/close.png')} />
                  </TouchableHighlight>
                }
              </View>
            </View>

            {this.state.products.length < 1 && this.state.loading == false && !this.state.msg ?
              <FlatList
                data={this.state.searchData}
                style={{ marginTop: widthPercentageToDP('2%') }}
                keyExtractor={(item) => item.id}
                extraData={this.state}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity onPress={() => this.setState({ search: item }, () => {
                      arrCount = [];
                      this.setState({ products: [], start: 0 }, () => {
                        this.searchAPI()
                      })
                    })} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: checkTheme(theme).medium_gray }}>
                      <Image style={{ height: 25, width: 25, borderRadius: 10 }} resizeMode="contain" source={require('../../images/clock1.png')} />
                      <Text numberOfLines={1} style={{ flex: 1, marginHorizontal: 10, fontFamily: Fonts.Regular, color: checkTheme(theme).black, fontSize: FontSize.smedium }}>{item}</Text>
                      <TouchableOpacity onPress={() => this.remove(index)} style={{ flexDirection: 'column', padding: 10, justifyContent: 'center' }}>
                        <Image style={{ height: 15, width: 15, }} resizeMode="contain" source={require('../../images/close.png')} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )
                }}
              />
              : null}
            {(this.state.products.length > 0 || (this.state.msg)) &&
              <FlatList
                // contentContainerStyle={{ flexGrow: 1 }}
                data={this.state.products}
                extraData={this.state.refresh}
                removeClippedSubviews={true}
                // maxToRenderPerBatch={800}
                // updateCellsBatchingPeriod={1000}
                // disableVirtualization={true}
                // legacyImplementation={true}
                onEndReached={this.handLoadMore}
                onEndReachedThreshold={0.2}
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
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={this.renderItem}
                numColumns={2}
              />
            }
            {(this.state.products.length > 0 || this.state.msg) &&

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
                            this.searchAPI()
                          })
                        } else if (this.state.sortbyid == "2") {
                          arrCount = [];
                          this.setState({ new_arrival: 0, trending: 1, products: [], start: 0 }, () => {
                            this.searchAPI()
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
            }

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
                    height: Platform.OS == 'android' ? heightPercentageToDP("100%") - 28 : heightPercentageToDP("100%") - 28,
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
                                    console.log(cat_ids);
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
                                    console.log(subcat_ids);
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
                            this.searchAPI()

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
                            this.searchAPI()

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
                        this.searchAPI()

                      })

                    }} style={{ height: 50, width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: checkTheme(theme).primary }}>
                      <Text style={{ fontFamily: Fonts.Bold, color: 'white' }}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              : null}

          </SafeAreaView>
        )
      }}

      </ThemeContext.Consumer>
    )
  }


}
