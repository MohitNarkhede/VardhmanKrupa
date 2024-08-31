import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange,
  removeOrientationListener,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import {checkTheme} from '../../common/checkTheme';
import Fonts from '../../common/Fonts';
import {FloatingLabelInput} from '../floatinglabel';
import SmallButton from '../smallbutton';
import API from '../../common/Api';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FetchAPI from '../../common/FetchAPI';
import {CommonActions} from '@react-navigation/native';
import {Alert} from 'react-native';
import Loader from '../../common/Loader';
import ImageResizer from '@bam.tech/react-native-image-resizer';

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

export default class CartList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
      loading1: false,
      qty: 1,
      remark: '',
      img: '',
      image: '',
    };
  }
  componentDidMount() {
    if (this.props.item.quantity > 1 || this.props.item.remark) {
      this.setState({
        qty: parseInt(this.props.item.quantity),
        remark: this.props.item.remark,
      });
    }
    if (this.props.item.image && this.state.image == '') {
      this.resize(this.props.item.image);
    }
    // listenOrientationChange(this);
  }

  resize = async imageUri => {
    if (!imageUri) return;
    try {
      let result = await ImageResizer.createResizedImage(
        imageUri,
        width * 0.23,
        width * 0.23,
        'JPEG',
        50,
        0,
        undefined,
        false,
        {
          mode: 'contain',
          onlyScaleDown: true,
        },
      );

      this.setState({image: result.uri});
    } catch (error) {
      console.log('eeee', error);
    }
  };

  addcartAPI = async item => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      product_id: item.id,
      quantity: this.state.qty,
      weight: item.weight,
      remark: this.state.remark,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        product_id: item.id,
        quantity: this.state.qty,
        weight: item.weight,
        remark: this.state.remark,
      };
    }
    console.log(JSON.stringify(Request));
    this.setState({loading: true});
    const res = await FetchAPI(API.add_cart, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      if (item.product_in_cart == 1) {
        this.props.item.product_in_cart = 0;
      } else {
        this.props.item.product_in_cart = 1;
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

  removeAPI = async item => {
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      cart_id: item.id,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        cart_id: item.id,
      };
    }
    console.log(JSON.stringify(Request));
    this.setState({loading1: true});
    const res = await FetchAPI(API.remove_cart, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.props.removeCart(item);
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

  updateQtyAPI = async item => {
    item.quantity = this.state.qty;
    let id = await AsyncStorage.getItem('id');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 1,
      token: JSON.parse(token),
      product_id: item.product_id,
      quantity: this.state.qty,
    };
    if (id) {
      Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(id),
        product_id: item.product_id,
        quantity: this.state.qty,
      };
    }
    console.log(JSON.stringify(Request));
    // this.setState({ loading1: true })
    const res = await FetchAPI(API.update_quantity, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      // setTimeout(() => {
      //     Toast.show(res.message)
      // }, 100);
      this.props.onRefresh();
      this.props.UpdateQty(item, this.state.qty);
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
    const {navigation} = this.props;
    const rowID = this.props.index;
    const rowData = this.props.item;
    const dataSource = this.props.dataSource;
    const theme = 'light';
    return (
      <View
        style={{
          flex: 1,
          borderRadius: 10,
          shadowOffset: {width: 5, height: 10},
          // shadowColor: Colors.light_gray,
          shadowOpacity: 0.5,
          // elevation:1,
          // flex:1,
          elevation: 1,
          backgroundColor: '#fff',
          // height: height * 0.48,

          // borderWidth:1,
          // borderColor:Colors.light_gray,
          overflow: 'hidden',
          margin: 5,
        }}
        key={rowID}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            //  paddingBottom: 5,
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{flex: 1, flexDirection: 'row', overflow: 'hidden'}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              {this.state.image ? (
                <Image
                //   defaultSource={require('../../images/logoplaceholder.png')}
                  resizeMode="contain"
                  resizeMethod="scale"
                  style={{
                    height: width * 0.23,
                    width: width * 0.23,
                    margin: 10,
                    borderRadius: 10,
                  }}
                  source={{uri: this.state.image}}
                  onError={e => {
                    console.log('Error', e.nativeEvent);
                  }}
                />
              ) : (
                <Image
                  defaultSource={require('../../images/logoplaceholder.png')}
                  resizeMode="contain"
                  resizeMethod="scale"
                  style={{
                    height: width * 0.23,
                    width: width * 0.23,
                    margin: 10,
                    borderRadius: 10,
                  }}
                  source={require('../../images/logoplaceholder.png')}
                  onError={e => {
                    console.log('Error', e.nativeEvent);
                  }}
                />
              )}
              {/* <TouchableOpacity
                                activeOpacity={0.8} onPress={() => {this.favAPI(rowData)}} style={{ alignItems: 'center', justifyContent: 'center',  width: 25, height: 25, borderRadius: 5, backgroundColor: "#fff" }}>
                                <Image
                                    style={{ height: 16, width: 16, alignSelf: 'center', }}
                                    resizeMode="contain"
                                    source={ rowData.favorite == 0 ? require('../../images/heart.png') : require('../../images/fillheart.png')} />
                            </TouchableOpacity> */}
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                paddingHorizontal: 4,
                marginVertical: 5,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 5,
                }}>
                <View style={{flex: 1, flexDirection: 'column'}}>
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
                        paddingLeft: 10,
                        fontFamily: Fonts.Light,
                        textAlign: 'left',
                      }}>
                      Weight: {rowData.weight} gm
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
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
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 25,
                    height: 25,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                  }}>
                  <Image
                    style={{height: 20, width: 20, alignSelf: 'center'}}
                    resizeMode="contain"
                    source={require('../../images/close.png')}
                  />
                </TouchableOpacity>
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
                  value={this.state.remark}
                  keyboardType="default"
                  onChangeText={value => {
                    rowData.remark = value;
                    this.setState({remark: value});
                  }}
                />
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
                          return false;
                        } else {
                          this.setState({qty: this.state.qty - 1}, () => {
                            this.updateQtyAPI(rowData);
                          });
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
                        // , isprice: value
                        // var value = parseInt(this.state.isprice) + parseInt(this.props.route.params.data.price[this.state.id].value)
                        this.setState({qty: this.state.qty + 1}, () => {
                          this.updateQtyAPI(rowData);
                        });
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
                </View>
              </View>
              {rowData.size_status == 1 ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                  }}>
                  <FloatingLabelInput
                    label="Size"
                    cart={true}
                    value={this.state.size}
                    maxLength={3}
                    keyboardType="numeric"
                    onChangeText={value => {
                      rowData.size = value;
                      this.setState({size: value});
                    }}
                  />
                </View>
              ) : null}

              {/* <SmallButton visible={this.state.loading} disable={rowData.product_in_cart == 0 ? false : true} text={rowData.product_in_cart == 0 ? "Add to Cart" :  "Added"} onPress={() => {
                                this.addcartAPI(rowData)
                            }} /> */}
            </View>
          </TouchableOpacity>
        </View>
        <Loader loading={this.state.loading1} />
      </View>
    );
  }
}
