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
import {Neomorph} from 'react-native-neomorph-shadows-fixes';

const SLIDER_1_FIRST_ITEM = 0;

export default class Order extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scrollheader: false,
      greeting: 'Hello, ',
      loading: false,
      orders: [{}, {}, {}, {}, {}],
      cart_count: 0,
    };
  }

  async componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    this.ordersAPI();
    let user = await AsyncStorage.getItem('user');
    // console.log(user.first_name);
    // let first_name = JSON.parse(user).first_name;
    // this.setState({ greeting: this.generateGreetings() })
  }

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

  ordersAPI = async () => {
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
    this.setState({loading: true});
    const res = await FetchAPI(API.myorders, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({orders: res.data, loading: false});
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
      this.setState({loading: false, orders: [], msg: res.message});
    }
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
                  paddingLeft: widthPercentageToDP('2%'),
                  paddingRight: widthPercentageToDP('5%'),
                  paddingTop: Platform.OS == 'ios' ? 15 : 35,
                  paddingBottom: 10,
                }}>
                <View
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={{padding: 5}}>
                    <Image
                      style={{
                        height: 28,
                        width: 28,
                        tintColor: checkTheme(theme).black,
                      }}
                      resizeMode="contain"
                      source={require('../../images/leftarrow.png')}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: Fonts.SemiBold,
                      fontSize: FontSize.medium,
                      color: checkTheme(theme).black,
                    }}>
                    {'Orders'}
                  </Text>
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
              <ScrollView contentContainerStyle={{paddingBottom: 20}}>
                <FlatList
                  style={{flex: 1}}
                  data={this.state.orders}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: this.state.loading ? 0 : height - 150,
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SemiBold,
                          fontSize: 14,
                          color: checkTheme(theme).black,
                        }}>
                        {this.state.msg}
                      </Text>
                    </View>
                  }
                  renderItem={({item, index}) => (
                    <>
                      {this.state.loading ? (
                        <SkeletonPlaceholder>
                          <SkeletonPlaceholder.Item
                            flexDirection="column"
                            alignItems="center">
                            <SkeletonPlaceholder.Item
                              borderRadius={20}
                              marginTop={7}
                              alignSelf="center"
                              width={widthPercentageToDP('96%')}
                              height={(700 * width * 0.96) / 1920}
                            />
                          </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                      ) : (
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => {
                            this.props.navigation.navigate('OrderDetails', {
                              item: item,
                            });
                          }}
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View
                            inner // <- enable shadow inside of neomorph
                            useArt
                            // swapShadows // <- change zIndex of each shadow color
                            style={{
                              flexDirection: 'row',
                              marginVertical: 5,
                              backgroundColor: '#fff',
                              alignItems: 'center',
                              shadowOffset: {width: 10, height: 10},
                              shadowOpacity: 1,
                              shadowColor: 'grey',
                              shadowRadius: 10,
                              borderRadius: 20,
                              // height: heightPercentageToDP('6%'),
                              width: widthPercentageToDP('95%'),
                              alignSelf: 'center',
                              justifyContent: 'center',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                paddingHorizontal: 2,
                              }}>
                              {/* <View style={{ flex: 0.30, }}>
                                              <Image
                                                style={{ height: hp('12%'), width: wp('30%'), borderRadius: 10 }}
                                                source={{ uri: item.image }}
                                              />
                                            </View> */}
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: 'column',
                                  marginLeft: 18,
                                  paddingBottom: 10,
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingTop: 6,
                                  }}>
                                  <View
                                    style={{flexDirection: 'column', flex: 1}}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                      }}>
                                      <Text
                                        style={[
                                          styles.Text1,
                                          {
                                            color: checkTheme(theme).primary,
                                            fontFamily: Fonts.Bold,
                                            fontSize: 18,
                                          },
                                        ]}>
                                        Order No. {item.orderno}
                                      </Text>
                                      <Text
                                        numberOfLines={1}
                                        style={[
                                          styles.Text1,
                                          {
                                            alignSelf: 'flex-end',
                                            paddingHorizontal: 10,
                                          },
                                        ]}>
                                        {item.order_date}
                                      </Text>
                                    </View>

                                    <Text
                                      numberOfLines={1}
                                      style={[styles.Text1]}>
                                      Metal Color: {item.metal_color_name}
                                    </Text>

                                    <Text style={styles.Text2}>
                                      Metal Purity: {item.purity_name}
                                    </Text>
                                  </View>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <Text numberOfLines={1} style={styles.Text1}>
                                    Weight :{item.weight}
                                  </Text>
                                  <Text
                                    numberOfLines={1}
                                    style={[styles.Text1, {paddingLeft: 15}]}>
                                    Quantity: {item.qty}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  {/* <Text numberOfLines={1} style={styles.Text1}>Total Product :{item.pcount}</Text> */}
                                  <Text
                                    numberOfLines={1}
                                    style={[styles.Text2]}>
                                    Remark: {item.remark}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
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
const styles = StyleSheet.create({
  Text1: {
    fontFamily: Fonts.Regular,
    color: 'black',
    paddingVertical: 1.5,
    fontSize: 12,
  },
  Text2: {
    fontFamily: Fonts.Bold,
    color: 'black',
    paddingVertical: 1.5,
    fontSize: 14,
  },
});
