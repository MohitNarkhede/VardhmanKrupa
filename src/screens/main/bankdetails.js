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
import Clipboard from '@react-native-clipboard/clipboard';

const SLIDER_1_FIRST_ITEM = 0;

export default class BankDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scrollheader: false,
      greeting: 'Hello, ',
      loading: false,
      data: [{}, {}],
      cart_count: 0,
    };
  }

  async componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    this.bankAPI();
    let user = await AsyncStorage.getItem('user');
    // console.log(user.first_name);
    // let first_name = JSON.parse(user).first_name;
    // this.setState({ greeting: this.generateGreetings() })
  }

  bankAPI = async () => {
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
    const res = await FetchAPI(API.bank_details, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({data: res.data, loading: false});
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
      this.setState({loading: false, data: [], msg: res.message});
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
                    {'Bank Details'}
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
                  data={this.state.data}
                  // ListHeaderComponent={
                  //     <Text style={{textAlign:'left', color: checkTheme(theme).black, fontSize:18, paddingLeft:10, marginTop:20, fontFamily: Fonts.Black}}>Bank Details Of VardhmanKrupa</Text>
                  // }
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
                              borderRadius={5}
                              marginTop={27}
                              alignSelf="center"
                              width={widthPercentageToDP('96%')}
                              height={220}
                            />
                          </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            marginTop: 20,
                            justifyContent: 'center',
                          }}>
                          <View
                            // inner // <- enable shadow inside of neomorph
                            // useArt
                            // swapShadows // <- change zIndex of each shadow color
                            style={{
                              flexDirection: 'row',
                              marginVertical: 5,
                              backgroundColor: '#fff',
                              alignItems: 'center',
                              justifyContent: 'center',
                              shadowOffset: {width: 10, height: 10},
                              shadowOpacity: 1,
                              shadowColor: 'grey',
                              shadowRadius: 10,
                              borderRadius: 5,
                              // height: heightPercentageToDP('6%'),
                              width: widthPercentageToDP('95%'),
                              alignSelf: 'center',
                              justifyContent: 'center',
                            }}>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'column',
                                marginTop: 10,
                                alignSelf: 'center',
                              }}>
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: 'row',
                                  borderColor: checkTheme(theme).dark_gray,
                                  borderBottomWidth: 1,
                                  padding: 10,
                                }}>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    color: checkTheme(theme).black,
                                    fontSize: 16,
                                    fontFamily: Fonts.Regular,
                                  }}>
                                  Name -{' '}
                                </Text>
                                <Text
                                  style={{
                                    flex: 1,
                                    textAlign: 'left',
                                    color: checkTheme(theme).primary,
                                    fontSize: 16,
                                    fontFamily: Fonts.Bold,
                                  }}>
                                  {item.ac_name}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Clipboard.setString(item.ac_name);
                                  }}
                                  style={{padding: 2}}>
                                  <Image
                                    style={{height: 20, width: 20}}
                                    source={require('../../images/copy.png')}
                                  />
                                </TouchableOpacity>
                              </View>

                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: 'row',
                                  borderColor: checkTheme(theme).dark_gray,
                                  borderBottomWidth: 1,
                                  padding: 10,
                                }}>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    color: checkTheme(theme).black,
                                    fontSize: 16,
                                    fontFamily: Fonts.Regular,
                                  }}>
                                  Bank -{' '}
                                </Text>
                                <Text
                                  style={{
                                    flex: 1,
                                    textAlign: 'left',
                                    color: checkTheme(theme).black,
                                    fontSize: 16,
                                    fontFamily: Fonts.Bold,
                                  }}>
                                  {item.bank}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Clipboard.setString(item.bank);
                                  }}
                                  style={{padding: 2}}>
                                  <Image
                                    style={{height: 20, width: 20}}
                                    source={require('../../images/copy.png')}
                                  />
                                </TouchableOpacity>
                              </View>

                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: 'row',
                                  borderColor: checkTheme(theme).dark_gray,
                                  borderBottomWidth: 1,
                                  padding: 10,
                                }}>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    color: checkTheme(theme).black,
                                    fontSize: 16,
                                    fontFamily: Fonts.Regular,
                                  }}>
                                  Branch -{' '}
                                </Text>
                                <Text
                                  style={{
                                    flex: 1,
                                    textAlign: 'left',
                                    color: checkTheme(theme).black,
                                    fontSize: 16,
                                    fontFamily: Fonts.Regular,
                                  }}>
                                  {item.branch}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Clipboard.setString(item.branch);
                                  }}
                                  style={{padding: 2}}>
                                  <Image
                                    style={{height: 20, width: 20}}
                                    source={require('../../images/copy.png')}
                                  />
                                </TouchableOpacity>
                              </View>

                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: 'row',
                                  borderColor: checkTheme(theme).dark_gray,
                                  borderBottomWidth: 1,
                                  padding: 10,
                                }}>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    color: checkTheme(theme).black,
                                    fontSize: 16,
                                    fontFamily: Fonts.Regular,
                                  }}>
                                  A/C No. -{' '}
                                </Text>
                                <Text
                                  style={{
                                    flex: 1,
                                    textAlign: 'left',
                                    color: checkTheme(theme).black,
                                    fontSize: 16,
                                    fontFamily: Fonts.Bold,
                                  }}>
                                  {item.ac_no}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Clipboard.setString(item.ac_no);
                                  }}
                                  style={{padding: 2}}>
                                  <Image
                                    style={{height: 20, width: 20}}
                                    source={require('../../images/copy.png')}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: 'row',
                                  padding: 10,
                                }}>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    color: checkTheme(theme).black,
                                    fontSize: 16,
                                    fontFamily: Fonts.Regular,
                                  }}>
                                  IFSC Code -{' '}
                                </Text>
                                <Text
                                  style={{
                                    flex: 1,
                                    textAlign: 'left',
                                    color: checkTheme(theme).black,
                                    fontSize: 16,
                                    fontFamily: Fonts.Bold,
                                  }}>
                                  {item.ifsc_code}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    Clipboard.setString(item.ifsc_code);
                                  }}
                                  style={{padding: 2}}>
                                  <Image
                                    style={{height: 20, width: 20}}
                                    source={require('../../images/copy.png')}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
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
