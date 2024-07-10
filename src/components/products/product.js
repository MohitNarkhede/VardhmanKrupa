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
  TextInput,
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
import SmallButton from '../smallbutton';
import API from '../../common/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FetchAPI from '../../common/FetchAPI';
import {CommonActions} from '@react-navigation/native';

const width = Dimensions.get('window').width;

export default class ProductsList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      qty: parseInt(props?.item?.quantity),
      remark: '',
      index: parseInt(props?.index) + 1,
      finalindex: parseInt(props?.index),
    };
  }
  componentDidMount() {
    if (this.props.item.remark) {
      this.setState({remark: this.props.item.remark});
    }
  }

  componentDidUpdate() {
    if (
      parseInt(this.props.item.quantity) != parseInt(this.state.quantity) &&
      this.props.item.product_in_cart == 1
    ) {
      this.setState({
        qty: parseInt(this.props.item.quantity),
      });
    } else if (this.props.item.quantity != this.state.quantity) {
      this.setState({
        qty: parseInt(this.props.item.quantity)
          ? parseInt(this.props.item.quantity)
          : 1,
      });
    }
  }

  addcartAPI = async (item, type) => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      product_id:
        type == 'model'
          ? this.props.products[this.state.finalindex].id
          : item.id,
      quantity:
        type == 'model'
          ? this.props.products[this.state.finalindex].quantity
          : this.state.qty,
      weight:
        type == 'model'
          ? this.props.products[this.state.finalindex].weight
          : item.weight,
      remark: this.state.remark,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        product_id:
          type == 'model'
            ? this.props.products[this.state.finalindex].id
            : item.id,
        quantity:
          type == 'model'
            ? this.props.products[this.state.finalindex].quantity
            : this.state.qty,
        weight:
          type == 'model'
            ? this.props.products[this.state.finalindex].weight
            : item.weight,
        remark: this.state.remark,
      };
    }
    console.log(JSON.stringify(Request));
    this.setState({loading: true});
    const res = await FetchAPI(API.add_cart, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      if (type == 'model') {
        this.props.products[this.state.finalindex].cart_id = res.cart_id;
        if (this.props.products[this.state.finalindex].product_in_cart == 1) {
          this.props.products[this.state.finalindex].product_in_cart = 0;
        } else {
          this.props.products[this.state.finalindex].product_in_cart = 1;
        }
        this.props.onRefresh();
      } else {
        item.cart_id = res.cart_id;
        if (item.product_in_cart == 1) {
          this.props.item.product_in_cart = 0;
        } else {
          this.props.item.product_in_cart = 1;
        }
        this.props.onAddCart(this.state.remark, res.cart_id);
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
      if (item.product_in_cart == 1) {
        this.props.item.product_in_cart = 0;
      } else {
        this.props.item.product_in_cart = 1;
      }
      this.setState({loading: false});
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
    this.setState({loading1: true});
    const res = await FetchAPI(API.add_remove_wishlist, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      if (item.favorite == 1) {
        this.props.item.favorite = 0;
      } else {
        this.props.item.favorite = 1;
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
      if (item.favorite == 1) {
        this.props.item.favorite = 0;
      } else {
        this.props.item.favorite = 1;
      }
      this.setState({loading1: false});
    }
  };

  removeAPI = async item => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      cart_id: item.cart_id,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        cart_id: item.cart_id,
      };
    }
    console.log(JSON.stringify(Request));
    this.setState({loading1: true});
    const res = await FetchAPI(API.remove_cart, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.props.onRemoveCart();
      item.product_in_cart = 0;
      setTimeout(() => {
        Toast.show(res.message);
      }, 100);
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
      Toast.show(res.message);

      this.setState({loading1: false});
    }
  };

  updateQtyAPI = async (item, type) => {
    item.quantity = this.state.qty;
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      product_id: item.id,
      quantity:
        type == 'model'
          ? this.props.products[this.state.finalindex].quantity
          : this.state.qty,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        product_id: item.id,
        quantity:
          type == 'model'
            ? this.props.products[this.state.finalindex].quantity
            : this.state.qty,
      };
    }
    console.log(JSON.stringify(Request));
    // this.setState({ loading1: true })
    const res = await FetchAPI(API.update_quantity, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      if (type == 'model') {
        this.props.products[this.state.finalindex].quantity =
          parseInt(this.props.products[this.state.finalindex].quantity) - 1;
      }
      this.props.UpdateQty(this.props.item, this.state.qty);
      this.props.onRefresh();
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

  render() {
    const rowID = this.props.index;
    const rowData = this.props.item;
    return (
      <View
        style={{
          width: width * 0.42,
          borderRadius: 10,
          marginLeft: 20,
          shadowOffset: {width: 5, height: 10},
          shadowColor: '#f2f2f2',
          shadowOpacity: 0.5,
          elevation: 3,

          margin: 5,
        }}
        key={rowID}>
        <View
          style={{
            flexDirection: 'column',
            borderRadius: 10,
            backgroundColor: '#f2f2f2',
            paddingBottom: 10,
            borderWidth: 1,
            borderColor: '#f2f2f2',
            overflow: 'hidden',
          }}>
          <View style={{flexDirection: 'column', overflow: 'hidden'}}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                this.props.navigation.navigate('ProductDetail', {
                  item: rowData,
                  index: rowID,
                  product_count: this.props.product_count,
                  type: this.props.type,
                  cat_ids: this.props.cat_ids,
                  subcat_ids: this.props.subcat_ids,
                  weight_min: this.props.weight_min,
                  weight_max: this.props.weight_max,
                  new_arrival: this.props.new_arrival,
                  trending: this.props.trending,
                  value: this.props.value,
                });
              }}
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                defaultSource={require('../../images/logoplaceholder.png')}
                resizeMode="contain"
                style={{
                  height: (400 * (width * 0.42)) / 400,
                  width: width * 0.42,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  alignSelf: 'center',
                }}
                source={{uri: rowData.image}}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  this.favAPI(rowData);
                }}
                style={{
                  top: 10,
                  right: 10,
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
                    rowData.favorite == 0
                      ? require('../../images/heart.png')
                      : require('../../images/fillheart.png')
                  }
                />
              </TouchableOpacity>
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                paddingHorizontal: 4,
                marginTop: 5,
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
                {rowData.name}
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    fontSize: 12,
                    color: '#000',
                    fontFamily: Fonts.Light,
                    textAlign: 'left',
                    paddingRight: 10,
                  }}>
                  {rowData.category}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 12,
                    color: '#000',
                    fontFamily: Fonts.Light,
                    textAlign: 'left',
                    marginLeft: 4,
                  }}>
                  {rowData.weight} gm
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
                <TextInput
                  style={{
                    flexDirection: 'row',
                    borderColor: 'gray',
                    borderWidth: 1,
                    height: 35,
                    width: '100%',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    marginVertical: 6,
                    alignContent: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    color: '#000',
                    paddingVertical: 5,
                    fontFamily: Fonts.Regular,
                    zIndex: 10,
                    fontSize:12
                  }}
                  value={this.state.remark}
                  keyboardType="default"
                  onChangeText={value => {
                    this.setState({remark: value});
                  }}
                  placeholder={'Any Remark...'}
                  placeholderTextColor={'gray'}
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
                    onPress={() => {
                      if (this.state.qty == 1) {
                        if (rowData.product_in_cart != 0) {
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
                                  this.removeAPI(rowData);
                                },
                              },
                            ],
                          );
                        }
                      } else {
                        if (rowData.product_in_cart == 0) {
                          this.setState({qty: this.state.qty - 1});
                          this.props.item.quantity =
                            parseInt(this.props.item.quantity) - 1;
                        } else {
                          this.setState({qty: this.state.qty - 1}, () => {
                            this.props.item.quantity =
                              parseInt(this.props.item.quantity) - 1;
                            this.updateQtyAPI(rowData, '');
                          });
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
                      if (rowData.product_in_cart == 0) {
                        this.setState({qty: this.state.qty + 1});
                        this.props.item.quantity =
                          parseInt(this.props.item.quantity) + 1;
                      } else {
                        this.setState({qty: this.state.qty + 1}, () => {
                          this.props.item.quantity =
                            parseInt(this.props.item.quantity) + 1;
                          this.updateQtyAPI(rowData, '');
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
                  containerStyle={{
                    height: hp('3.5%'),
                    width: wp('16%'),
                  }}
                  visible={this.state.loading}
                  disable={rowData.product_in_cart == 0 ? false : true}
                  text={rowData.product_in_cart == 0 ? 'ADD' : 'Added'}
                  onPress={() => {
                    this.addcartAPI(rowData, '');
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
