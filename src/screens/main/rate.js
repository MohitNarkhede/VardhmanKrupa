import React, {PureComponent} from 'react';
import {
  View,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {ThemeContext} from '../../components/ThemeProvider';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import Fonts from '../../common/Fonts';
import FontSize from '../../common/FontSize';
import {checkTheme} from '../../common/checkTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class Rate extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      rate_url: '',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('rate_url').then(rate_url => {
      this.setState({rate_url});
    });
  }

  render() {
    //console.log("rate_url"+rate_url)
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
                    {'Live Rate'}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: '#f1f1f1',
                  flexDirection: 'column',
                }}>
                {/* <Loader loading={this.state.loading} /> */}
                {this.state.rate_url && (
                  <WebView
                    source={{uri: this.state.rate_url}}
                    style={{height: height * 0.8, width: width}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                  />
                )}
              </View>
            </SafeAreaView>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
