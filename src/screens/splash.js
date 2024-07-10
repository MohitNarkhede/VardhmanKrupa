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
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Platform,
} from 'react-native';
import Colors from '../common/Colors';
import {CommonActions} from '@react-navigation/native';
import {ThemeContext} from '../components/ThemeProvider';
import {checkTheme} from '../common/checkTheme';
const {width, height} = Dimensions.get('window');
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import VersionInfo from 'react-native-version-info';
import API from '../common/Api';
import FetchAPI from '../common/FetchAPI';
import NetInfo from '@react-native-community/netinfo';
import timeout from '../common/timeout';
import Toast from 'react-native-simple-toast';
import Fonts from '../common/Fonts';
import AnimatedTyping from '../components/AnimatedTyping';
import DeviceInfo from 'react-native-device-info';
let androidurl = '';
let iosurl = '';

export default class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      modalVisible: false,

      // apiLevel: null,
      // os: '',
      // version: '',
      // currentAppVersion: '',
      // battery: null,
      // brand: '',
      // carrier: '',
      // device: '',
      // ip: '',
      // macAddress: '',
      // manufacturer: '',
      // model: '',
    };
  }

  async componentDidMount() {
    // const deviceInfo = await this.getDeviceInfo();
    // this.setState({
    //   apiLevel: deviceInfo.apilevel,
    //   os: deviceInfo.os,
    //   version: deviceInfo.version,
    //   currentAppVersion: deviceInfo.appversion,
    //   battery: deviceInfo.battery,
    //   brand: deviceInfo.brand,
    //   carrier: deviceInfo.carrier,
    //   device: deviceInfo.device,
    //   ip: deviceInfo.ip,
    //   macAddress: deviceInfo.mac_address,
    //   manufacturer: deviceInfo.manufacturer,
    //   model: deviceInfo.model,
    // });

    const authorizationStatus = await messaging().requestPermission();
    const registerStatus = await messaging().registerDeviceForRemoteMessages();

    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
    }

    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      // console.log(
      //   'Notification caused app to open from background state:',
      //   JSON.parse(remoteMessage.data.custom).link,
      // );
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('Get Initial;:', remoteMessage);
      });

    PushNotification.createChannel(
      {
        channelId: 'vardhmankrupa', // (required)
        channelName: 'VardhmanKrupa', // (required)
        channelDescription: 'VardhmanKrupa', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );

    messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);

      if (Platform.OS == 'android') {
        PushNotification.localNotification({
          id: 111, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
          title: remoteMessage.notification.title, // (optional)
          channelId: 'vardhmankrupa',
          // autoCancel: true,
          bigPictureUrl: remoteMessage.notification?.android?.imageUrl,
          largeIconUrl: remoteMessage.notification?.android?.imageUrl,
          largeIcon: remoteMessage.notification.android.imageUrl,
          smallIcon: 'ic_launcher_notification',
          message: remoteMessage.notification.body, // (required)
          userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
          playSound: true, // (optional) default: true
          soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          priority: 'high',
          importance: 'high',
        });
      } else {
        try {
          const options = {
            channelId: 'vardhmankrupa',
            bigPictureUrl: remoteMessage.data.image,
            title: remoteMessage.notification.title,
            message: remoteMessage.notification.body,
            userInfo: {
              image: remoteMessage.data.image,
            },
            priority: 'high',
            importance: 'high',
          };

          PushNotification.localNotification(options);
          console.log('call me');
        } catch (err) {
          console.log(err);
        }
      }
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    messaging()
      .requestPermission()
      .then(async () => {
        let token = await messaging().getToken();
        console.log(token);
        setTimeout(() => {
          this.redirect(token);
        }, 1500);
      })
      .catch(error => {
        setTimeout(() => {
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
        }, 2000);
        console.log('firebase error', error);
      });
  }

  // getDeviceInfo = async () => {
  //   const apiLevel = DeviceInfo.getApiLevelSync();
  //   const os = Platform.OS === 'android' ? 'android' : 'ios';
  //   const version = DeviceInfo.getSystemVersion();
  //   const currentAppVersion = DeviceInfo.getVersion();
  //   const battery = await DeviceInfo.getBatteryLevel();
  //   const brand = DeviceInfo.getBrand();
  //   const carrier = DeviceInfo.getCarrierSync();
  //   const device = DeviceInfo.getDeviceId();
  //   const ip = await DeviceInfo.getIpAddress();
  //   const macAddress = await DeviceInfo.getMacAddress();
  //   const manufacturer = DeviceInfo.getManufacturerSync();
  //   const model = DeviceInfo.getModel();
  //   console.log(apiLevel,os,version,currentAppVersion,battery,brand,carrier,device,ip,macAddress,manufacturer,model);
  //   return {
  //     apilevel: apiLevel,
  //     version: version,
  //     os: os,
  //     appversion: currentAppVersion,
  //     battery: battery,
  //     brand: brand,
  //     carrier: carrier,
  //     device: device,
  //     ip: ip,
  //     mac_address: macAddress,
  //     manufacturer: manufacturer,
  //     model: model,
  //   };
  // };

  redirect = async token => {
    AsyncStorage.setItem('token', JSON.stringify(token));
    console.log(token);
    if (token) {
      this.appVersion();
    }
  };

  navigateFinal = res => {
    AsyncStorage.getItem('id').then(id => {
      if (id) {
        if (res?.data?.status == 0) {
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'Request',
                    params: {
                      title: res?.title,
                      desc: res?.desc,
                      user_request_status: res?.user_request_status,
                    },
                  },
                ],
              }),
            );
        } else {
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Home'}],
              }),
            );
        }
      } else {
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
      }
    });
  };

  checklogin = async () => {
    let user = await AsyncStorage.getItem('user');
    let token = await AsyncStorage.getItem('token');
    console.log(user);
    if (user) {
      this.setState({loading: true});
      var Request = {
        security: 0,
        token: JSON.parse(token),
        id: JSON.parse(user).id,
        phone: JSON.parse(user).phone,
      };
      console.log(JSON.stringify(Request));
      const res = await FetchAPI(API.login, 'POST', Request);
      console.log(res);
      if (res.status == 'success') {
        this.navigateFinal(res);
        AsyncStorage.setItem('user', JSON.stringify(res.data));
        AsyncStorage.setItem('id', JSON.stringify(res.data.id));
      } else {
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
        this.setState({loading: false, phoneerror: res.message});
      }
    } else {
      this.navigateFinal();
    }
  };

  appVersion = async () => {
    AsyncStorage.getItem('id').then(id => {
      AsyncStorage.getItem('token').then(token => {
        var Request = {
          security: 1,
          token: JSON.parse(token),
        };

        console.log(JSON.stringify(Request));
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            timeout(
              20000,
              fetch(API.appversion, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(Request),
              })
                .then(res => res.json())
                .then(res => {
                  console.log('App Version RESPONCE:::  ', res);
                  if (res.status == 'success') {
                    AsyncStorage.setItem('logo', res.logo);
                    AsyncStorage.setItem('android_url', res.android_url);
                    AsyncStorage.setItem('ios_url', res.ios_url);
                    AsyncStorage.setItem('phone', res.phone);
                    AsyncStorage.setItem('whatsapp', res.whatsapp);
                    AsyncStorage.setItem('rate_url', res.rate_url);
                    androidurl = res.android_url;
                    iosurl = res.ios_url;

                    if (Platform.OS == 'android') {
                      if (res.android_maintenance == 1) {
                        setTimeout(() => {
                          this.props.navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [{name: 'Maintenance'}],
                            }),
                          );
                        }, 1000);
                      } else {
                        if (res.android_forcecheck == 1) {
                          if (VersionInfo.appVersion != res.android_version) {
                            this.setModalVisible(true);
                          } else {
                            this.checklogin();
                          }
                        } else {
                          this.checklogin();
                        }
                      }
                    } else {
                      if (res.ios_maintenance == 1) {
                        setTimeout(() => {
                          this.props.navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [{name: 'Maintenance'}],
                            }),
                          );
                        }, 1000);
                      } else {
                        if (res.ios_forcecheck == 1) {
                          if (VersionInfo.appVersion != res.ios_version) {
                            this.setModalVisible(true);
                          } else {
                            this.checklogin();
                          }
                        } else {
                          this.checklogin();
                        }
                      }
                    }
                  } else if (res.status == 'failed') {
                    this.setState({loading: false});
                    AsyncStorage.removeItem('id');

                    this.props.navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Login'}],
                      }),
                    );
                  } else {
                      this.props.navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{name: 'Login'}],
                        }),
                      );

                    this.setState({data: res, loading: false});
                  }
                })
                .catch(e => {
                  this.setState({loading: false});
                  console.log(e);
                    this.props.navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Login'}],
                      }),
                    );
                  Toast.show('Something went wrong...', Toast.SHORT);
                }),
            ).catch(e => {
              console.log(e);
                this.props.navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Login'}],
                  }),
                );
              this.setState({loading: false});
            });
          } else {
            this.setState({loading: false});
              this.props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                }),
              );
          }
        });
      });
    });
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {context => {
          const theme = context.theme;
          return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <StatusBar hidden />
                <Animatable.View
                  delay={1500}
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  animation={'fadeIn'}>
                  <Image
                    resizeMode={'contain'}
                    style={{
                      height: (888 * width * 0.8) / 3334,
                      width: width * 0.8,
                      alignSelf: 'center',
                    }}
                    source={require('../images/logo.png')}
                  />
                </Animatable.View>
                <View style={{flexDirection: 'row'}}>
                  {/* <Animatable.View delay={2000} animation={"lightSpeedIn"}>
              <Text style={{ paddingHorizontal:10, letterSpacing:0.2, color: checkTheme(theme).black, fontSize:15, marginTop:15, fontFamily: Fonts.Regular}}>
                  Speed 
                  </Text>
                </Animatable.View>
                <Animatable.View delay={2500} animation={"flipInY"}>
                <Text animation={"slideInUp"} delay={1000} style={{paddingHorizontal:10, letterSpacing:0.2, color: checkTheme(theme).black, fontSize:15, marginTop:15, fontFamily: Fonts.Regular}}>
                  Quality
                </Text>
                </Animatable.View>
                <Animatable.View delay={3000} animation={"fadeInRight"}>
                <Text animation={"slideInUp"} delay={1500} style={{paddingHorizontal:10, letterSpacing:0.2, color: checkTheme(theme).black, fontSize:15, marginTop:15, fontFamily: Fonts.Regular}}>
                  Design
                </Text>
                </Animatable.View> */}
                  <AnimatedTyping text={['Speed     Quality     Design']} />
                </View>
              </View>
              <Animatable.View
                delay={500}
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                animation={'bounceIn'}>
                <Image
                  style={{
                    height: height * 0.35,
                    width: width,
                    position: 'absolute',
                    bottom: 0,
                    zIndex: -1,
                    right: 0,
                  }}
                  resizeMode="cover"
                  source={require('../images/back4.png')}
                />
              </Animatable.View>
              {/* <Animatable.View delay={500} style={{ height: '10%', backgroundColor:checkTheme(theme).secondary,  alignItems:'center', justifyContent:'center' }}
              animation={"slideInUp"}
              > 
            </Animatable.View> */}
              <Modal
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}>
                <View style={styles.ModalContainer}>
                  <View
                    style={[
                      styles.netAlert,
                      {backgroundColor: checkTheme(theme).white},
                    ]}>
                    <View style={styles.netAlertContent}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          marginTop: 10,
                        }}>
                        <Image
                          resizeMode="cover"
                          source={require('../images/update.png')}
                          style={{width: width * 1, height: width * 1}}
                        />
                      </View>
                      <Text
                        style={[
                          styles.netAlertTitle,
                          {color: checkTheme(theme).black},
                        ]}>
                        Updated Required
                      </Text>
                      <Text
                        style={[
                          styles.netAlertDesc,
                          {color: checkTheme(theme).dark_gray},
                        ]}>
                        Please update our app for an improved experience!! This
                        version is no longer supported.
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => this.get()}
                      style={{
                        padding: 12,
                        marginHorizontal: width * 0.08,
                        backgroundColor: checkTheme(theme).secondary,
                        marginVertical: 20,
                        borderRadius: 5,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: checkTheme(theme).white,
                          fontSize: 16,
                        }}>
                        Update Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </SafeAreaView>
          );
        }}
      </ThemeContext.Consumer>
    );
  }

  get = () => {
    if (Platform.OS == 'android') {
      Linking.openURL(androidurl);
    } else if (Platform.OS == 'ios') {
      Linking.openURL(iosurl);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
  },
  ModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  netAlert: {
    overflow: 'hidden',
    borderRadius: 10,
    shadowRadius: 10,
    width: width,
    height: height,
    borderColor: '#f1f1f1',
    borderWidth: 1,
  },
  netAlertContent: {
    flex: 1,
    padding: 20,
  },
  netAlertTitle: {
    fontSize: 20,
    paddingTop: 20,

    textAlign: 'center',
    // fontFamily: Fonts.Bold,
  },
  netAlertDesc: {
    fontSize: 16,
    paddingTop: 10,
    alignSelf: 'center',
    width: width * 0.8,

    // fontFamily: Fonts.Regular,
    paddingVertical: 5,
    textAlign: 'center',
  },
});