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
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Colors from '../../common/Colors';
import {CommonActions} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import API from '../../common/Api';
import Loader from '../../common/Loader';
import timeout from '../../common/timeout';
import Toast from 'react-native-simple-toast';
import Fonts from '../../common/Fonts';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Button from '../../components/button';
const {width, height} = Dimensions.get('window');
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {FloatingLabelInput} from '../../components/floatinglabel';
import Background from '../../components/background';
import {checkTheme} from '../../common/checkTheme';
import {ThemeContext} from '../../components/ThemeProvider';
import FontSize from '../../common/FontSize';
import FetchAPI from '../../common/FetchAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Carousel from 'react-native-snap-carousel';
import SmallButton from '../../components/smallbutton';
import CaraouselProduct from '../../components/products/caraouselProduct';
const SLIDER_1_FIRST_ITEM = 0;

export default class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scrollheader: false,
      slider2ActiveSlide: SLIDER_1_FIRST_ITEM,
      qty: 1,
      slider: [{}],
      sloading: true,
      aloading: true,
      cloading: true,
      tloading: true,
      nproducts: [{}, {}, {}],
      tproducts: [{}, {}, {}],
      banners: [{}, {}, {}, {}, {}, {}],

      newtopics: [{data: [{}, {}]}],
      retopics: [{}, {}, {}],
      current_play_session: {},
      first_name: '',
      greeting: 'Hello, ',
      mood_stat: 1,
      select_topic: {},
      loading: false,
      loading1: false,
      quote: '',
      cart_count: 0,
    };
  }

  async componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    this.sliderAPI();
    this.in3 = this.props.navigation.addListener('focus', async () => {
    this.countAPI();
    AsyncStorage.getItem('cart').then(cart => {
      console.log('cart1', cart);
      if (cart) {
        this.setState({cart: JSON.parse(cart)}, () => {
          if (this.state.nproducts.length > 0) {
            for (let i = 0; i < this.state.nproducts.length; i++) {
              console.log('cart', this.state.cart);
              this.state.cart.filter((data, index) => {
                if (data.pid == this.state.nproducts[i].id) {
                  if (data.product_in_cart == 1) {
                    this.state.nproducts[i].quantity = data.quantity;
                    this.state.nproducts[i].product_in_cart = 1;
                    this.state.nproducts[i].cart_id = data.cart_id;
                    this.setState({refresh: !this.state.refresh});
                  } else {
                    this.state.nproducts[i].quantity = 1;
                    this.state.nproducts[i].product_in_cart = 0;
                    this.state.nproducts[i].cart_id = '';
                    this.state.cart.splice(index, 1);
                    console.log('products', this.state.nproducts[i]);

                    this.setState({refresh: !this.state.refresh}, () => {
                      if (this.state.cart.length > 0) {
                        AsyncStorage.setItem(
                          'cart',
                          JSON.stringify(this.state.cart),
                        );
                      } else {
                        AsyncStorage.removeItem('cart');
                        this.setState({cart: []});
                      }
                    });
                    console.log('products123', this.state.nproducts);
                    this.setState({refresh: !this.state.refresh});
                  }
                } else {
                }
              });
            }
          }
          if (this.state.tproducts.length > 0) {
            for (let i = 0; i < this.state.tproducts.length; i++) {
              console.log('cart', this.state.cart);
              this.state.cart.filter((data, index) => {
                if (data.pid == this.state.tproducts[i].id) {
                  if (data.product_in_cart == 1) {
                    this.state.tproducts[i].quantity = data.quantity;
                    this.state.tproducts[i].product_in_cart = 1;
                    this.state.tproducts[i].cart_id = data.cart_id;
                    this.setState({refresh: !this.state.refresh});
                    console.log('products', this.state.tproducts);
                  } else {
                    this.state.tproducts[i].quantity = 1;
                    this.state.tproducts[i].product_in_cart = 0;
                    this.state.tproducts[i].cart_id = '';
                    this.state.cart.splice(index, 1);

                    this.setState({refresh: !this.state.refresh}, () => {
                      if (this.state.cart.length > 0) {
                        AsyncStorage.setItem(
                          'cart',
                          JSON.stringify(this.state.cart),
                        );
                      } else {
                        AsyncStorage.removeItem('cart');
                        this.setState({cart: []});
                      }
                    });
                    console.log('products123', this.state.tproducts);
                    this.setState({refresh: !this.state.refresh});
                  }
                } else {
                }
              });
            }
          }
        });
      } else {
        this.setState({cart: []});
      }
      this.setState({refresh: !this.state.refresh});
    });
    })

    let user = await AsyncStorage.getItem('user');
    // console.log(user.first_name);
    // let first_name = JSON.parse(user).first_name;
    this.permission();
    this.setState({greeting: this.generateGreetings()});
  }

  componentWillUnmount() {
    this.in3()
  }

  permission = async () => {
    if (Platform.OS == 'android') {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) {
        return true;
      }

      const status = await PermissionsAndroid.request(permission);
      return status === 'granted';
    }
  };

  generateGreetings = () => {
    var currentHour = moment().format('HH');
    console.log(currentHour);
    if (currentHour >= 3 && currentHour < 12) {
      return 'Good Morning ';
    } else if (currentHour >= 12 && currentHour < 16) {
      return 'Good Afternoon ';
    } else if (currentHour >= 16 && currentHour < 20) {
      return 'Good Evening ';
    } else if (currentHour >= 20 && currentHour < 3) {
      return 'Hello ';
    } else {
      return 'Hello ';
    }
  };

  generateImages = () => {
    var currentHour = moment().format('HH');
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
  };

  countAPI = async () => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
      };
    }
    console.log(JSON.stringify(Request));
    console.log(API.cart_count);
    const res = await FetchAPI(API.cart_count, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({cart_count: res.cart_count});
    } else if (res.status == 'failed') {
      AsyncStorage.removeItem('id');
      AsyncStorage.removeItem('user');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
      this.setState({cart_count: 0});
    } else {
      // Toast.show(res.message)
      this.setState({cart_count: 0});
    }
  };

  sliderAPI = async () => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
      };
    }
    console.log(JSON.stringify(Request));
    console.log(API.sliders);
    this.setState({sloading: true});
    const res = await FetchAPI(API.sliders, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({slider: res.data, sloading: false}, ()=> {
        if(res.profile == 0){
        Alert.alert('Alert', res.p_msg, [
          
          {text: 'Update', onPress: () => this.props.navigation.navigate('EditProfile')},
        ]);
      }
      });
      this.newArrivalAPI();
    } else if (res.status == 'failed') {
      AsyncStorage.removeItem('id');
      AsyncStorage.removeItem('user');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
      this.setState({sloading: false});
    } else {
      // Toast.show(res.message)
      this.newArrivalAPI();
      this.setState({sloading: false, slider: []});
    }
  };

  newArrivalAPI = async () => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      start: 0,
      end: 5,
      new_arrival: 1,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        start: 0,
        end: 5,
        new_arrival: 1,
      };
    }
    this.setState({aloading: true});
    const res = await FetchAPI(API.shop, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({nproducts: res.data, aloading: false});
      this.homeBannersAPI();
    } else if (res.status == 'failed') {
      AsyncStorage.removeItem('id');
      AsyncStorage.removeItem('user');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
      this.setState({aloading: false});
    } else {
      // Toast.show(res.message)
      this.homeBannersAPI();
      this.setState({aloading: false, nproducts: []});
    }
  };

  homeBannersAPI = async () => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
      };
    }
    this.setState({cloading: true});
    const res = await FetchAPI(API.home_banners, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({banners: res.data, cloading: false});
      this.trendingAPI();
    } else if (res.status == 'failed') {
      AsyncStorage.removeItem('id');
      AsyncStorage.removeItem('user');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
      this.setState({cloading: false});
    } else {
      // Toast.show(res.message)
      this.trendingAPI();
      this.setState({cloading: false, banners: []});
    }
  };

  trendingAPI = async () => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      start: 0,
      end: 5,
      trending: 1,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        start: 0,
        end: 5,
        trending: 1,
      };
    }
    this.setState({tloading: true});
    const res = await FetchAPI(API.shop, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({tproducts: res.data, tloading: false});
    } else if (res.status == 'failed') {
      AsyncStorage.removeItem('id');
      AsyncStorage.removeItem('user');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
      this.setState({tloading: false});
    } else {
      // Toast.show(res.message)
      this.setState({tloading: false, tproducts: []});
    }
  };

  favAPI = async item => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      product_id: item.id,
      type: item.favorite == 1 ? 2 : 1,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        product_id: item.id,
        type: item.favorite == 1 ? 2 : 1,
      };
    }
    console.log(JSON.stringify(Request));
    this.setState({loading: true});
    const res = await FetchAPI(API.add_remove_wishlist, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      if (item.favorite == 1) {
        item.favorite = 0;
      } else {
        item.favorite = 1;
      }
      this.setState({loading: false});
    } else if (res.status == 'failed') {
      AsyncStorage.removeItem('id');
      AsyncStorage.removeItem('user');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
      this.setState({loading: false});
    } else {
      // Toast.show(res.message)
      if (item.favorite == 1) {
        item.favorite = 0;
      } else {
        item.favorite = 1;
      }
      this.setState({loading: false});
    }
  };

  addCart = (item, remark, cart_id) => {
    let cartArray = [];
    AsyncStorage.getItem('cart').then(cart => {
      console.log('cart => ', cart);

      if (cart) {
        cartArray = JSON.parse(cart);
        console.log('cartArray cart 1 ==> ', cartArray);
        var obj = {
          id: cartArray[cartArray.length - 1].id + 1,
          pid: item.id,
          quantity: item.quantity,
          remark: remark,
          cart_id: cart_id,
          product_in_cart: 1,
        };
        cartArray.push(obj);
        console.log('cartArray cart 2 ==> ', cartArray);
        // console.log(cartArray);

        AsyncStorage.setItem('cart', JSON.stringify(cartArray));
      } else {
        console.log('cartArray nocart 1 ==> ', cartArray);
        var obj = {
          id: 1,
          pid: item.id,
          quantity: item.quantity,
          remark: remark,
          cart_id: cart_id,
          product_in_cart: 1,
        };
        cartArray.push(obj);
        console.log('cartArray nocart 2 ==> ', cartArray);
        // console.log(cartArray);

        AsyncStorage.setItem('cart', JSON.stringify(cartArray));
      }

      this.setState({add: true}, () => {
        AsyncStorage.getItem('cart').then(cart => {
          this.setState({cart: JSON.parse(cart)});
          this.setState({refresh: !this.state.refresh});
        });
      });
    });
  };

  remove = item => {
    if (this.state.cart) {
      for (let i = 0; i < this.state.cart.length; i++) {
        if (this.state.cart[i].pid == item.id) {
          this.state.cart.splice(i, 1);
          this.setState({refresh: !this.state.refresh}, () => {
            if (this.state.cart.length > 0) {
              AsyncStorage.setItem('cart', JSON.stringify(this.state.cart));
            } else {
              AsyncStorage.removeItem('cart');
              this.setState({cart: []});
            }
          });
        }
      }
    }
  };

  UpdateQty = (item, qty) => {
    if (this.state.cart) {
      for (let i = 0; i < this.state.cart.length; i++) {
        if (this.state.cart[i].pid == item.id) {
          this.state.cart[i].quantity = qty;
          this.setState({refresh: !this.state.refresh}, () => {
            AsyncStorage.setItem('cart', JSON.stringify(this.state.cart));
          });
        }
      }
    }
  };

  _renderSlider({item, index}) {
    return (
      <>
        {this.state.sloading ? (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              flexDirection="column"
              alignItems="center">
              <SkeletonPlaceholder.Item
                borderRadius={10}
                width={widthPercentageToDP('95%')}
                height={(765 * width * 0.95) / 1920}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        ) : (
          <View
            style={{
              width: width * 0.95,
              shadowOffset: {width: 5, height: 0},
              shadowOpacity: 0.5,
              alignSelf: 'center',
              minHeight: height * 0.2,
              borderRadius: 10,
              overflow: 'hidden',
            }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                // if (item.type == 1) {
                //     this.props.navigation.navigate('Product', { name: item.name, cat_id: null, category: item.cat, dailywear: item.dailywear, purity: item.purity, subcat: item.subcat, color: item.color, gender: item.gender })
                // } else {
                //     this.props.navigation.navigate('Product', { name: "Shop Now", subid: null, new1: null, spo: null, cat_id: null, fifk: true })
                // }
              }}
              style={{flexDirection: 'column', overflow: 'hidden'}}>
              <Image
                style={{
                  height: (765 * width * 0.95) / 1920,
                  width: width * 0.95,
                  borderRadius: 4,
                  backgroundColor: '#f2f2f2',
                }}
                source={{uri: item.image}}
              />
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  }

  _renderItemWithParallax({item, index}) {
    return (
      <>
        {this.state.aloading ? (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              flexDirection="column"
              alignItems="center"
              margin={10}
              borderRadius={10}
              width={widthPercentageToDP('55%')}>
              <SkeletonPlaceholder.Item
                flexDirection="column"
                alignItems="center"
                borderRadius={10}
                paddingBottom={10}>
                <SkeletonPlaceholder.Item
                  borderRadius={10}
                  margin={10}
                  width={width * 0.55 - 20}
                  height={(500 * (width * 0.55 + 118 - 20)) / 500}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        ) : (
          <CaraouselProduct
            item={item}
            products={this.state.nproducts}
            onRefresh={() => {
              this.setState({refresh: !this.state.refresh});
            }}
            onAddCart={(remark, cart_id) => {
              this.addCart(item, remark, cart_id);
              this.setState({cart_count: this.state.cart_count + 1});
            }}
            onRemoveCart={() => {
              this.remove(item);
              this.setState({cart_count: this.state.cart_count - 1});
            }}
            UpdateQty={(item, qty) => {
              this.UpdateQty(item, qty);
            }}
            loading={this.state.loading}
            userid={this.state.userid}
            image={this.state.proloader}
            index={index}
            onPress={() => {
              // navigation.navigate('Detail', { data: item })
            }}
          />
        )}
      </>
    );
  }

  _renderItemWithParallax1({item, index}) {
    return (
      <>
        {this.state.tloading ? (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              flexDirection="column"
              alignItems="center"
              margin={10}
              borderRadius={10}
              width={widthPercentageToDP('55%')}>
              <SkeletonPlaceholder.Item
                flexDirection="column"
                alignItems="center"
                borderRadius={10}
                paddingBottom={10}>
                <SkeletonPlaceholder.Item
                  borderRadius={10}
                  margin={10}
                  width={width * 0.55 - 20}
                  height={(500 * (width * 0.55 + 118 - 20)) / 500}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        ) : (
          <CaraouselProduct
            item={item}
            products={this.state.tproducts}
            onRefresh={() => {
              this.setState({refresh: !this.state.refresh});
            }}
            onAddCart={(remark, cart_id) => {
              this.addCart(item, remark, cart_id);
              this.setState({cart_count: this.state.cart_count + 1});
            }}
            onRemoveCart={() => {
              this.remove(item);
              this.setState({cart_count: this.state.cart_count - 1});
            }}
            UpdateQty={(item, qty) => {
              this.UpdateQty(item, qty);
            }}
            loading={this.state.loading}
            userid={this.state.userid}
            image={this.state.proloader}
            index={index}
            onPress={() => {
              // navigation.navigate('Detail', { data: item })
            }}
          />
        )}
      </>
    );
  }

  products = (item, index) => {
    return (
      <View
        style={{
          width: width * 0.55,
          borderRadius: 10,
          shadowOffset: {width: 5, height: 10},
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
            flexDirection: 'column',
            borderRadius: 10,
            backgroundColor: '#fff',
            paddingBottom: 10,
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{flexDirection: 'column', overflow: 'hidden'}}
            onPress={() => {
              // this.props.navigation.navigate('Detail', { data: item })
            }}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={{
                  height: (500 * (width * 0.55 - 20)) / 500,
                  width: width * 0.55 - 20,
                  margin: 10,
                  borderRadius: 10,
                }}
                source={{uri: item.image}}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  this.favAPI(item);
                }}
                style={{
                  top: 15,
                  right: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  width: 25,
                  height: 25,
                  borderRadius: 5,
                  backgroundColor: '#fff',
                }}>
                <Image
                  style={{height: 16, width: 16, alignSelf: 'center'}}
                  resizeMode="contain"
                  source={
                    item.favorite == 0
                      ? require('../../images/heart.png')
                      : require('../../images/fillheart.png')
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column', paddingHorizontal: 4}}>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 14,
                  color: '#000',
                  fontFamily: Fonts.SemiBold,
                  textAlign: 'left',
                  paddingHorizontal: 10,
                }}>
                {item.name}
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                }}>
                <Text
                  numberOfLines={2}
                  style={{
                    flex: 1,
                    fontSize: 12,
                    color: '#000',
                    fontFamily: Fonts.Light,
                    textAlign: 'left',
                    paddingRight: 10,
                  }}>
                  {item.category}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 12,
                    color: '#000',
                    fontFamily: Fonts.Light,
                    textAlign: 'left',
                  }}>
                  Weight: {item.weight} gm
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                }}>
                <FloatingLabelInput
                  label="Any Remark..."
                  cart={true}
                  value={item.remark}
                  keyboardType="default"
                  onChangeText={value => {
                    this.setState({remark: value});
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    height: 36,
                    width: widthPercentageToDP('20%'),
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      if (item.quantity == 1) {
                        return false;
                      } else {
                        item.quantity = parseInt(item.quantity) - 1;
                        this.setState({refresh: !this.state.refresh});
                      }
                    }}
                    style={{
                      height: 25,
                      width: 25,
                      borderRadius: 13,
                      backgroundColor: checkTheme('light').secondary,
                      elevation: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.Bold,
                        color: checkTheme('light').white,
                        fontSize: 15,
                        bottom: 2,
                      }}>
                      -
                    </Text>
                  </TouchableOpacity>

                  <Text
                    refresh={new Date()}
                    style={{
                      fontFamily: Fonts.Regular,
                      color: 'black',
                      fontSize: 16,
                      paddingHorizontal: 5,
                    }}>
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      // , isprice: value
                      // var value = parseInt(this.state.isprice) + parseInt(this.props.route.params.data.price[this.state.id].value)
                      item.quantity = parseInt(item.quantity) + 1;
                      this.setState({refresh: !this.state.refresh});
                    }}
                    style={{
                      height: 25,
                      width: 25,
                      borderRadius: 13,
                      backgroundColor: checkTheme('light').secondary,
                      elevation: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: checkTheme('light').white,
                        fontFamily: Fonts.Bold,
                        fontSize: 15,
                      }}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>

                <SmallButton
                  visible={this.state.loading1}
                  disable={item.product_in_cart == 0 ? false : true}
                  text={item.product_in_cart == 0 ? 'Add to Cart' : 'Added'}
                  onPress={() => {
                    // this.loginAPI()
                    this.props.navigation.navigate('Verification', {
                      item: this.state,
                    });
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    let {user} = this.state;
    return (
      <ThemeContext.Consumer>
        {context => {
          const theme = context.theme;
          return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
              <StatusBar
                backgroundColor={checkTheme(theme).light_gray}
                barStyle="dark-content"
              />
              {/* <Loader loading={this.state.loading} /> */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: widthPercentageToDP('5%'),
                  paddingTop: Platform.OS == 'ios' ? 15 : 40,
                  paddingBottom: 10,
                }}>
                <View
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    style={{height: 25, width: 25}}
                    resizeMode="contain"
                    source={this.generateImages()}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: Fonts.SemiBold,
                      fontSize: FontSize.medium,
                      marginHorizontal: 10,
                      color: checkTheme(theme).black,
                    }}>
                    {this.state.greeting}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Rate')}
                  style={{
                    paddingHorizontal: 10,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{height: 25, width: 40}}
                    resizeMode="contain"
                    source={require('../../images/gold.png')}
                  />
                  <Text
                    style={{
                      fontFamily: Fonts.SemiBold,
                      fontSize: 12,
                      paddingHorizontal: 2,
                      color: checkTheme(theme).black,
                    }}>
                    {'Rate'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Search')}
                  style={{paddingHorizontal: 10}}>
                  <Image
                    style={{height: 25, width: 25}}
                    resizeMode="contain"
                    source={require('../../images/search.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Cart')}
                  style={{paddingHorizontal: 10}}>
                  <Image
                    style={{height: 25, width: 25}}
                    resizeMode="contain"
                    source={require('../../images/bag.png')}
                  />
                  {this.state.cart_count != 0 && (
                    <View
                      style={{
                        top: -5,
                        right: 0,
                        position: 'absolute',
                        height: 20,
                        minWidth: 20,
                        borderRadius: 10,
                        backgroundColor: checkTheme(theme).secondary,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SemiBold,
                          fontSize: 10,
                          paddingHorizontal: 2,
                          color: checkTheme(theme).white,
                        }}>
                        {this.state.cart_count}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={{paddingBottom: 80}}>
                <Carousel
                  ref={c => (this._slider2Ref = c)}
                  data={this.state.slider}
                  renderItem={this._renderSlider.bind(this)}
                  sliderWidth={widthPercentageToDP('100%')}
                  itemWidth={widthPercentageToDP('100%')}
                  hasParallaxImages={true}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={1}
                  containerCustomStyle={{
                    marginTop: 0,
                    overflow: 'visible',
                  }}
                  contentContainerCustomStyle={{
                    marginTop: 5,
                    paddingVertical: 4, // for custom animation
                  }}
                  // loop={Platform.OS == 'ios'?true:false}
                  loop={true}
                  // loopClonesPerSide={1}
                  // autoplay={true}
                  autoplayDelay={900}
                  autoplayInterval={3000}
                  // onSnapToItem={(index) => this.setState({ slider2ActiveSlide: index }, () => {
                  //     if (this.state.slider1.length - 1 == index) {
                  //         setTimeout(() => {
                  //             this.setState({ slider2ActiveSlide: 0 })
                  //         }, 2000);
                  //     }
                  // })}
                />

                <Carousel
                  ref={c => (this._nproductRef = c)}
                  data={this.state.nproducts}
                  renderItem={this._renderItemWithParallax.bind(this)}
                  sliderWidth={widthPercentageToDP('100%')}
                  itemWidth={widthPercentageToDP('55%')}
                  hasParallaxImages={true}
                  extraData={this.state.loading}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={0.8}
                  inactiveSlideOpacity={0.7}
                  containerCustomStyle={{
                    marginTop: 0,
                    overflow: 'visible',
                  }}
                  contentContainerCustomStyle={{
                    paddingVertical: 4, // for custom animation
                  }}
                  // loop={Platform.OS == 'ios'?true:false}
                  loop={true}
                  //   loopClonesPerSide={2}
                  //   autoplay={true}
                  autoplayDelay={900}
                  autoplayInterval={3000}
                  //   onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index },()=>{
                  //     if(this.state.slider1.length-1 == index){
                  //       setTimeout(() => {
                  //         this.setState({ slider1ActiveSlide: 0 })
                  //       }, 2000);
                  //     }
                  //     // console.log(this.state.slider.length-1,index);
                  //   })}
                />
                {/* 
                            <FlatList
                                style={{ flex: 1, marginTop: 5, }}
                                data={this.state.slider1}
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                renderItem={({ item, index }) =>
                                    <View style={{
                                        margin: 0, paddingVertical: 10,
                                        paddingHorizontal: 15, alignSelf: 'center'
                                    }}>
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            onPress={() => {
                                                // navigation.navigate('SubCategory', { data: item }) 
                                                navigation.navigate('Product', { name: item.name, subid: null, new1: 0, spo: 0, cat_id: item.id })
                                            }}
                                            style={{
                                                flex: 1,
                                                width: width * .33,
                                                shadowOffset: { width: 5, height: 10 },
                                                shadowColor: checkTheme(theme).lightBlack,
                                                shadowOpacity: 0.5,
                                                elevation: 3,
                                                borderRadius: 10,
                                                overflow: 'hidden',
                                                backgroundColor: checkTheme(theme).white,
                                                // borderWidth:1,
                                                // borderColor:Colors.lightBlack,
                                                minHeight: height * 0.15, width: width * 0.27,
                                                justifyContent: 'center', alignItems: 'center'
                                            }}>
                                            <Image style={{ height: '80%', width: '100%', }}
                                                resizeMode={'cover'}
                                                //   defaultSource={require('../../images/proloader.png')}

                                                source={{ uri: item.img }}>
                                            </Image>
                                            <View style={{ flex: 1, padding: 5, minHeight: 40, width: '100%', borderBottomRightRadius: 10, backgroundColor: '#f2f2f2', marginBottom: 20 }}>

                                                <Text
                                                    numberOfLines={2}
                                                    style={{
                                                        textAlign: 'center', color: checkTheme(theme).black,
                                                        fontFamily: Fonts.Bold, fontSize: 12,
                                                    }}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                }
                            /> */}

                <FlatList
                  style={{flex: 1}}
                  data={this.state.banners}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <>
                      {this.state.cloading && index < 3 ? (
                        <SkeletonPlaceholder>
                          <SkeletonPlaceholder.Item
                            flexDirection="column"
                            alignItems="center"
                            marginTop={7}
                            alignSelf="center"
                            height={
                              index == 0 || index == 3
                                ? (960 * width * 0.96) / 1280
                                : (603 * width * 0.96) / 1920
                            }
                            borderRadius={7}
                            width={width * 0.96}></SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                      ) : (
                        <View
                          style={{
                            width: width * 1,
                            elevation: 10,
                            marginTop: 8,
                          }}>
                          {index < 3 && (
                            <TouchableOpacity
                              activeOpacity={0.9}
                              // onPress={() => {
                              //   navigation.navigate('Detail', { data: {
                              //     id: item.pid,
                              //     name: item.pname,
                              //   } })
                              // }}
                              onPress={() => {
                                this.props.navigation.navigate('SubCategory', {
                                  item: item,
                                });
                              }}>
                              <Image
                                resizeMode={'contain'}
                                style={{
                                  height:
                                    index == 0 || index == 3
                                      ? (960 * width * 0.96) / 1280
                                      : (603 * width * 0.96) / 1920,
                                  width: width * 0.96,
                                  alignSelf: 'center',
                                  borderRadius: 7,
                                  backgroundColor: checkTheme(theme).light_gray,
                                }}
                                source={{uri: item.image}}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </>
                  )}
                  keyExtractor={(item, index) => String(index)}
                />

                <Carousel
                  ref={c => (this._slider1Ref = c)}
                  data={this.state.tproducts}
                  renderItem={this._renderItemWithParallax1.bind(this)}
                  sliderWidth={widthPercentageToDP('100%')}
                  itemWidth={widthPercentageToDP('50%')}
                  hasParallaxImages={true}
                  extraData={this.state.loading}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={0.8}
                  inactiveSlideOpacity={0.7}
                  containerCustomStyle={{
                    marginTop: 0,
                    overflow: 'visible',
                  }}
                  contentContainerCustomStyle={{
                    paddingVertical: 4, // for custom animation
                  }}
                  // loop={Platform.OS == 'ios'?true:false}
                  loop={true}
                  //   loopClonesPerSide={2}
                  //   autoplay={true}
                  autoplayDelay={900}
                  autoplayInterval={3000}
                  //   onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index },()=>{
                  //     if(this.state.slider1.length-1 == index){
                  //       setTimeout(() => {
                  //         this.setState({ slider1ActiveSlide: 0 })
                  //       }, 2000);
                  //     }
                  //     // console.log(this.state.slider.length-1,index);
                  //   })}
                />

                <FlatList
                  style={{flex: 1}}
                  data={this.state.banners}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <>
                      {this.state.cloading && index > 2 ? (
                        <SkeletonPlaceholder>
                          <SkeletonPlaceholder.Item
                            flexDirection="column"
                            alignItems="center"
                            marginTop={7}
                            alignSelf="center"
                            height={
                              index == 0 || index == 3
                                ? (960 * width * 0.96) / 1280
                                : (603 * width * 0.96) / 1920
                            }
                            borderRadius={7}
                            width={width * 0.96}></SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                      ) : (
                        <View
                          style={{
                            width: width * 1,
                            elevation: 10,
                            marginTop: 8,
                          }}>
                          {index > 2 && (
                            <TouchableOpacity
                              activeOpacity={0.9}
                              // onPress={() => {
                              //   navigation.navigate('Detail', { data: {
                              //     id: item.pid,
                              //     name: item.pname,
                              //   } })
                              // }}
                              onPress={() => {
                                this.props.navigation.navigate('SubCategory', {
                                  item: item,
                                });
                              }}>
                              <Image
                                resizeMode={'contain'}
                                style={{
                                  height:
                                    index == 0 || index == 3
                                      ? (960 * width * 0.96) / 1280
                                      : (603 * width * 0.96) / 1920,
                                  width: width * 0.96,
                                  alignSelf: 'center',
                                  borderRadius: 7,
                                  backgroundColor: checkTheme(theme).light_gray,
                                }}
                                source={{uri: item.image}}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </>
                  )}
                  keyExtractor={(item, index) => String(index)}
                />
              </ScrollView>
            </SafeAreaView>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
