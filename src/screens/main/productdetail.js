import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange,
  removeOrientationListener,
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import {checkTheme} from '../../common/checkTheme';
import Fonts from '../../common/Fonts';
import API from '../../common/Api';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import ImageZoom from 'react-native-image-pan-zoom';
import ViewShot, {captureRef} from 'react-native-view-shot';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import SmallButton from '../../components/smallbutton';
import FetchAPI from '../../common/FetchAPI';
import {SafeAreaView} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  root: {
    width: '43%',
    borderRadius: 10,
    marginLeft: 13,
    paddingBottom: 10,

    backgroundColor: '#fff',
    margin: 10,
  },
});

export default class ProductsDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      refresh: false,
      remark: '',
      img: '',
      index: this.props.route.params.index,
      modalVisible: false,
      previewSource: null,
      error: null,
      res: null,
      value: {
        format: 'jpg',
        quality: 0.9,
      },
      cart: [],
      hdimage: this.props.route.params.item.hdimage,
      product_id: this.props.route.params.item.id,
      weight: this.props.route.params.item.weight,
      name: this.props.route.params.item.name,
      category: this.props.route.params.item.category,
      qty: parseInt(this.props.route.params.item.quantity),
      product_in_cart: this.props.route.params.item.product_in_cart,
      product_count: this.props.route.params.product_count,
      cart_id: this.props.route.params.item.cart_id,
      remark: this.props.route.params.item.remark,
    };
  }
  componentDidMount() {
    AsyncStorage.getItem('cart').then(cart => {
      if (cart) {
        this.setState({cart: JSON.parse(cart)});
      }
    });
    // listenOrientationChange(this);
  }

  addcartAPI = async item => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      product_id: this.state.product_id,
      quantity: this.state.qty,
      weight: this.state.weight,
      remark: this.state.remark,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        product_id: this.state.product_id,
        quantity: this.state.qty,
        weight: this.state.weight,
        remark: this.state.remark,
      };
    }
    console.log(JSON.stringify(Request));
    this.setState({loading: true});
    const res = await FetchAPI(API.add_cart, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      if (this.state.product_in_cart == 1) {
        this.setState({product_in_cart: 0});
      } else {
        this.setState({product_in_cart: 1});
      }

      this.setState({loading: false, cart_id: res.cart_id}, () => {
        this.addCart();
      });
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
      if (this.state.product_in_cart == 1) {
        this.setState({product_in_cart: 0});
      } else {
        this.setState({product_in_cart: 1});
      }
      this.setState({loading: false});
    }
  };

  addCart = () => {
    let cartArray = [];
    AsyncStorage.getItem('cart').then(cart => {
      console.log('cart => ', cart);

      if (cart) {
        cartArray = JSON.parse(cart);
        console.log('cartArray cart 1 ==> ', cartArray);
        var obj = {
          id: cartArray[cartArray.length - 1].id + 1,
          pid: this.state.product_id,
          quantity: this.state.qty,
          remark: this.state.remark,
          cart_id: this.state.cart_id,
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
          pid: this.state.product_id,
          quantity: this.state.qty,
          remark: this.state.remark,
          cart_id: this.state.cart_id,
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

  favAPI = async item => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      product_id: this.state.product_id,
      type: item.favorite == 1 ? 2 : 1,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        product_id: this.state.product_id,
        type: item.favorite == 1 ? 2 : 1,
      };
    }
    console.log(JSON.stringify(Request));
    this.setState({loading1: true});
    const res = await FetchAPI(API.add_remove_wishlist, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      if (this.state.favorite == 1) {
        this.state.favorite = 0;
      } else {
        this.state.favorite = 1;
      }
      this.setState({loading1: false});
    } else if (res.status == 'failed') {
      AsyncStorage.removeItem('id');
      AsyncStorage.removeItem('user');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
      this.setState({loading1: false});
    } else {
      // Toast.show(res.message)
      if (this.state.favorite == 1) {
        this.state.favorite = 0;
      } else {
        this.state.favorite = 1;
      }
      this.setState({loading1: false});
    }
  };

  remove = () => {
    for (let i = 0; i < this.state.cart.length; i++) {
      if (this.state.cart[i].pid == this.state.product_id) {
        // this.state.cart.splice(i, 1);
        this.state.cart[i].product_in_cart = 0;
        this.setState({refresh: !this.state.refresh}, () => {
          if (this.state.cart.length > 0) {
            console.log('kakak', this.state.cart);
            AsyncStorage.setItem('cart', JSON.stringify(this.state.cart));
          } else {
            AsyncStorage.removeItem('cart');
            this.setState({cart: []});
          }
        });
      }
    }
  };

  removeAPI = async item => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      cart_id: this.state.cart_id,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        cart_id: this.state.cart_id,
      };
    }
    console.log(JSON.stringify(Request));
    this.setState({loading1: true});
    const res = await FetchAPI(API.remove_cart, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      setTimeout(() => {
        Toast.show(res.message);
      }, 100);
      this.setState({loading1: false, product_in_cart: 0}, () => {
        this.remove();
      });
    } else if (res.status == 'failed') {
      AsyncStorage.removeItem('id');
      AsyncStorage.removeItem('user');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
      this.setState({loading1: false});
    } else {
      Toast.show(res.message);

      this.setState({loading1: false});
    }
  };

  UpdateQty = () => {
    if (this.state.cart) {
      for (let i = 0; i < this.state.cart.length; i++) {
        if (this.state.cart[i].pid == this.state.product_id) {
          this.state.cart[i].quantity = this.state.qty;
          this.setState({refresh: !this.state.refresh}, () => {
            console.log('helloqw', this.state.cart);
            AsyncStorage.setItem('cart', JSON.stringify(this.state.cart));
          });
        }
      }
    }
  };

  updateQtyAPI = async () => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      product_id: this.state.product_id,
      quantity: this.state.qty,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        product_id: this.state.product_id,
        quantity: this.state.qty,
      };
    }
    console.log(JSON.stringify(Request));
    // this.setState({ loading1: true })
    const res = await FetchAPI(API.update_quantity, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.UpdateQty();
      // setTimeout(() => {
      //     Toast.show(res.message)
      // }, 100);
      this.setState({loading1: false});
    } else if (res.status == 'failed') {
      AsyncStorage.removeItem('id');
      AsyncStorage.removeItem('user');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
      this.setState({loading1: false});
    } else {
      setTimeout(() => {
        Toast.show(res.message);
      }, 100);

      this.setState({loading1: false});
    }
  };

  productAPI = async index => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      category: this.props.route.params.cat_ids,
      subcategory: this.props.route.params.subcat_ids,
      start: parseInt(this.state.index),
      end: 1,
      weight_min: this.props.route.params.weight_min,
      weight_max: this.props.route.params.weight_max,
      new_arrival: this.props.route.params.new_arrival,
      trending: this.props.route.params.trending,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        category: this.props.route.params.cat_ids,
        subcategory: this.props.route.params.subcat_ids,
        start: parseInt(this.state.index),
        end: 1,
        weight_min: this.props.route.params.weight_min,
        weight_max: this.props.route.params.weight_max,
        new_arrival: this.props.route.params.new_arrival,
        trending: this.props.route.params.trending,
      };
    }
    console.log(JSON.stringify(Request));
    this.setState({loading2: true});
    const res = await FetchAPI(API.shop, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({
        hdimage: res.data[0].hdimage,
        weight: res.data[0].weight,
        name: res.data[0].name,
        category: res.data[0].category,
        qty: parseInt(res.data[0].quantity),
        product_in_cart: res.data[0].product_in_cart,
        cart_id: res.data[0].cart_id,
        product_id: res.data[0].id,
        loading2: false,
      });
    } else if (res.status == 'failed') {
      AsyncStorage.removeItem('id');
      AsyncStorage.removeItem('user');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
      this.setState({loading2: false});
    } else {
      // Toast.show(res.message)

      this.setState({loading2: false});
    }
  };

  wishlistAPI = async index => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      start: parseInt(this.state.index),
      end: 1,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        start: parseInt(this.state.index),
        end: 1,
      };
    }
    console.log(JSON.stringify(Request));
    this.setState({loading2: true});
    const res = await FetchAPI(API.wishlist, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({
        hdimage: res.data[0].hdimage,
        weight: res.data[0].weight,
        name: res.data[0].name,
        category: res.data[0].category,
        qty: parseInt(res.data[0].quantity),
        product_in_cart: res.data[0].product_in_cart,
        cart_id: res.data[0].cart_id,
        product_id: res.data[0].id,
        loading2: false,
      });
    } else if (res.status == 'failed') {
      AsyncStorage.removeItem('id');
      AsyncStorage.removeItem('user');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
      this.setState({loading2: false});
    } else {
      // Toast.show(res.message)

      this.setState({loading2: false});
    }
  };

  searchAPI = async index => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      category: this.props.route.params.cat_ids,
      subcategory: this.props.route.params.subcat_ids,
      start: parseInt(this.state.index),
      end: 1,
      weight_min: this.props.route.params.weight_min,
      weight_max: this.props.route.params.weight_max,
      new_arrival: this.props.route.params.new_arrival,
      trending: this.props.route.params.trending,
      value: this.props.route.params.value,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        category: this.props.route.params.cat_ids,
        subcategory: this.props.route.params.subcat_ids,
        start: parseInt(this.state.index),
        end: 1,
        weight_min: this.props.route.params.weight_min,
        weight_max: this.props.route.params.weight_max,
        new_arrival: this.props.route.params.new_arrival,
        trending: this.props.route.params.trending,
        value: this.props.route.params.value,
      };
    }
    console.log(JSON.stringify(Request));
    this.setState({loading2: true});
    const res = await FetchAPI(API.search, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({
        hdimage: res.data[0].hdimage,
        weight: res.data[0].weight,
        name: res.data[0].name,
        category: res.data[0].category,
        qty: parseInt(res.data[0].quantity),
        product_in_cart: res.data[0].product_in_cart,
        cart_id: res.data[0].cart_id,
        product_id: res.data[0].id,
        loading2: false,
      });
    } else if (res.status == 'failed') {
      AsyncStorage.removeItem('id');
      AsyncStorage.removeItem('user');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
      this.setState({loading2: false});
    } else {
      // Toast.show(res.message)

      this.setState({loading2: false});
    }
  };

  onCapture = () => {
    captureRef(this.ref, this.state.value)
      .then(res =>
        this.state.value.result !== 'file'
          ? res
          : new Promise((success, failure) =>
              // just a test to ensure res can be used in Image.getSize
              Image.getSize(
                res,
                (width, height) => (
                  console.log(res, width, height), success(res)
                ),
                failure,
              ),
            ),
      )
      .then(res => {
        console.log(res);
        this.setState({
          error: null,
          res,
          previewSource: {uri: res},
        });

        CameraRoll.save(res)
          .then(
            Toast.show('Photo download successfully and added to camera roll!'),
          )
          .catch(err => console.log('err:', err));
      })
      .catch(
        error => (
          console.log(error),
          this.setState({error, res: null, previewSource: null})
        ),
      );
  };

  render() {
    const theme = 'light';
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <View
          style={{
            height: heightPercentageToDP('100%'),
            width: widthPercentageToDP('100%'),
            backgroundColor: '#fff',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              marginTop: Platform.OS == 'ios' ? 10 : 25,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.onCapture();
              }}
              style={{
                margin: 10,
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                width: 40,
              }}>
              <Image
                style={{height: 30, width: 30, tintColor: '#000'}}
                resizeMode="contain"
                source={require('../../images/download.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
              style={{
                margin: 10,
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                width: 40,
              }}>
              <Image
                style={{height: 30, width: 30, tintColor: '#000'}}
                resizeMode="contain"
                source={require('../../images/close.png')}
              />
            </TouchableOpacity>
          </View>
          <ViewShot
            style={{
              backgroundColor: 'white',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}
            collapsable={false}
            ref={ref => (this.ref = ref)}
            options={{format: 'jpg', quality: 1}}>
            <View
              style={{
                // flex:1,
                flexDirection: 'column',
                paddingBottom: 10,
                backgorundColor: '#fff',
              }}>
              {this.state.loading2 ? (
                <ActivityIndicator
                  size="small"
                  style={{
                    height: heightPercentageToDP('70%'),
                    width: widthPercentageToDP('100%'),
                  }}
                  color={'black'}
                />
              ) : (
                <ImageZoom
                  cropWidth={widthPercentageToDP('100%')}
                  cropHeight={heightPercentageToDP('70%')}
                  imageWidth={widthPercentageToDP('100%')}
                  imageHeight={(1280 * width) / 1280}
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
                  key={`image-${this.state.index}`}>
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      defaultSource={require('../../images/logoplaceholder.png')}
                      resizeMode="contain"
                      style={{
                        height: (1280 * width) / 1280,
                        width: width,
                        margin: 10,
                      }}
                      source={{uri: this.state.hdimage}}
                    />
                  </View>
                </ImageZoom>
              )}
              <View
                style={{
                  flexDirection: 'column',
                  paddingHorizontal: 4,
                  marginTop: 10,
                }}>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 14,
                    color: '#000',
                    fontFamily: Fonts.SemiBold,
                    textAlign: 'left',
                    paddingHorizontal: 10,
                  }}>
                  {this.state.name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      color: '#000',
                      fontFamily: Fonts.Light,
                      textAlign: 'left',
                      paddingRight: 10,
                    }}>
                    {this.state.category}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 12,
                      color: '#000',
                      fontFamily: Fonts.Light,
                      textAlign: 'left',
                    }}>
                    Weight: {this.state.weight} gm
                  </Text>
                </View>
              </View>
            </View>
          </ViewShot>
          {this.state.loading2 ? null : (
            <View
              style={{
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
                  onPress={() => {
                    if (this.state.qty == 1) {
                      if (this.state.product_in_cart != 0) {
                        Alert.alert(
                          'Remove from Cart',
                          'Are you sure want to remove this product from cart?',
                          [
                            {
                              text: 'No',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                            {
                              text: 'Yes',
                              onPress: () => {
                                this.removeAPI();
                              },
                            },
                          ],
                        );
                      }
                    } else {
                      if (this.state.product_in_cart == 0) {
                        this.setState({qty: this.state.qty - 1}, () => {});
                      } else {
                        this.setState({qty: this.state.qty - 1}, () => {
                          this.updateQtyAPI();
                        });
                      }
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
                  {this.state.qty}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    if (this.state.product_in_cart == 0) {
                      this.setState({qty: this.state.qty + 1}, () => {});
                    } else {
                      this.setState({qty: this.state.qty + 1}, () => {
                        this.updateQtyAPI();
                      });
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
                      color: checkTheme('light').white,
                      fontFamily: Fonts.Bold,
                      fontSize: 15,
                    }}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>

              <SmallButton
                visible={this.state.loading}
                disable={this.state.product_in_cart == 0 ? false : true}
                text={this.state.product_in_cart == 0 ? 'Add to Cart' : 'Added'}
                onPress={() => {
                  this.addcartAPI();
                }}
              />
            </View>
          )}
        </View>

        <View
          style={{
            flex: 1,
            position: 'absolute',
            top: heightPercentageToDP('50%') - 20,
            width: widthPercentageToDP('100%'),
          }}>
          {this.state.index + 1 == this.state.product_count ? null : (
            <TouchableOpacity
              onPress={() => {
                this.setState({index: this.state.index + 1}, () => {
                  if (this.props.route.params.type == 'shop') {
                    this.productAPI();
                  } else if (this.props.route.params.type == 'wishlist') {
                    this.wishlistAPI();
                  } else if (this.props.route.params.type == 'search') {
                    this.searchAPI();
                  }
                });
              }}
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                right: 20,
                backgroundColor: checkTheme(theme).secondary,
              }}>
              <Image
                style={{
                  height: 16,
                  width: 16,
                  tintColor: checkTheme(theme).white,
                }}
                resizeMode="contain"
                source={require('../../images/next.png')}
              />
            </TouchableOpacity>
          )}
          {this.state.index == 0 ? null : (
            <TouchableOpacity
              onPress={() => {
                this.setState({index: this.state.index - 1}, () => {
                  if (this.props.route.params.type == 'shop') {
                    this.productAPI();
                  } else if (this.props.route.params.type == 'wishlist') {
                    this.wishlistAPI();
                  } else if (this.props.route.params.type == 'search') {
                    this.searchAPI();
                  }
                });
              }}
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                left: 20,
                backgroundColor: checkTheme(theme).secondary,
              }}>
              <Image
                style={{
                  height: 16,
                  width: 16,
                  tintColor: checkTheme(theme).white,
                }}
                resizeMode="contain"
                source={require('../../images/prev.png')}
              />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }
}
