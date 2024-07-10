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
  FlatList,
  TouchableHighlight,
} from 'react-native';
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
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default class Request extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      title: this.props.route.params.title,
      desc: this.props.route.params.desc,
      user_request_status: this.props.route.params.user_request_status,
    };
  }

  async componentDidMount() {}

  requestAPI = async () => {
    let id = await AsyncStorage.getItem('id');
    let user = await AsyncStorage.getItem('user');
    let token = await AsyncStorage.getItem('token');
    var Request = {
      security: 0,
      user_id: JSON.parse(id),
      id: JSON.parse(id),
      token: JSON.parse(token),
    };
    this.setState({loading: true});
    const res = await FetchAPI(API.user_request, 'POST', Request);
    console.log(res);
    if (res.status == 'success') {
      this.setState({
        loading: false,
        title: res.title,
        desc: res.desc,
        user_request_status: res.user_request_status,
      });
    } else {
      Toast.show(res.message);
      this.setState({loading: false});
    }
  };

  render() {
    let {user} = this.state;
    return (
      <ThemeContext.Consumer>
        {context => {
          const theme = context.theme;
          return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
              <StatusBar
                backgroundColor={checkTheme(theme).white}
                barStyle="dark-content"
              />
              <Loader loading={this.state.loading} />
              <KeyboardAwareScrollView>
                <View
                  style={{
                    margin: widthPercentageToDP('5%'),
                    position: 'relative',
                    zIndex: 9999,
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      resizeMode={'contain'}
                      style={{
                        height: heightPercentageToDP('45%'),
                        width: widthPercentageToDP('95%'),
                        marginTop: -10,
                        alignSelf: 'center',
                      }}
                      source={require('../../images/request.jpg')}
                    />

                    <Text
                      style={{
                        fontFamily: Fonts.Bold,
                        color: checkTheme(theme).primarydark,
                        fontSize: 25,
                        marginTop: 25,
                      }}>
                      {this.state.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <Text
                        style={{
                          width: widthPercentageToDP('65%'),
                          textAlign: 'center',
                          fontFamily: Fonts.Regular,
                          color: this.state.user_request_status == 0
                            ? 'red'
                            : checkTheme(theme).dark_gray,
                          fontSize: FontSize.medium,
                        }}>
                        {this.state.desc}
                      </Text>
                    </View>
                  </View>
                </View>
              </KeyboardAwareScrollView>
              {this.state.user_request_status == null && (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Button
                    visible={this.state.loading}
                    disable={false}
                    text="Request"
                    onPress={() => {
                      this.requestAPI();
                    }}
                  />
                </View>
              )}
              {this.state.user_request_status == 1 && (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Button
                    visible={this.state.loading}
                    disable={false}
                    text="Reload"
                    onPress={() => {
                      this.props.navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{name: 'Splash'}],
                        }),
                      );
                    }}
                  />
                </View>
              )}
            </SafeAreaView>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
