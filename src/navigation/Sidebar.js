import React, { Component } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, Dimensions, StatusBar, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import { heightPercentageToDP, heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { CommonActions } from '@react-navigation/native';
import { getDrawerStatusFromState } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkTheme } from '../common/checkTheme';
import Fonts from '../common/Fonts';

const Datasource = [

  {
    icon: require('../images/home.png'),
    title: 'Home',
    navigate: 'Home',
    visible: false,
    id: 0
  },
  {
    icon: require('../images/shop.png'),
    navigate: 'Products',
    title: 'Shop Now',
    visible: false,
    id: 10
  },
  {
    icon: require('../images/user.png'),
    title: 'My Profile',
    navigate: 'EditProfile',
    visible: false,
    id: 1
  },
  {
    icon: require('../images/calendar.png'),
    title: 'Orders history',
    navigate: 'Order',
    visible: false,
    id: 3
  },
  {
    icon: require('../images/bank.png'),
    title: 'Bank Details',
    navigate: 'BankDetails',
    visible: false,
    id: 10
  },
  {
    icon: require('../images/bell.png'),
    title: 'Notification',
    navigate: 'Notification',
    visible: false,
    id: 2
  },
  {
    icon: require('../images/contact-us.png'),
    title: 'Contact Us',
    navigate: 'Contact',
    visible: false,
    id: 5

  },
  {
    icon: require('../images/history.png'),
    title: 'About us',
    navigate: 'About',
    visible: false,
    id: 6
  },
  {
    icon: require('../images/Slider_37.png'),
    title: 'Privacy policy',
    navigate: 'Privacy',
    visible: false,
    id: 7
  },
  {
    icon: require('../images/Slider_37.png'),
    title: 'Terms condition',
    navigate: 'Terms',
    visible: false,
    id: 8
  },
  {
    icon: require('../images/slogout.png'),
    title: 'Logout',
    visible: false,
    id: 9

  }
];

const Datasource1 = [
  {
    icon: require('../images/slogout.png'),
    title: 'Login',
    visible: false,
    id: 6
  },
  {
    icon: require('../images/home.png'),
    title: 'Home',
    navigate: 'Home',
    visible: false,
    id: 0
  },

  {
    icon: require('../images/shop.png'),
    navigate: 'Products',
    title: 'Shop Now',
    visible: false,
    id: 1
  },
  {
    icon: require('../images/contact-us.png'),
    title: 'Contact Us',
    navigate: 'Contact',
    visible: false,
    id: 2

  },
  {
    icon: require('../images/history.png'),
    title: 'About us',
    navigate: 'About',
    visible: false,
    id: 3
  },
  {
    icon: require('../images/Slider_37.png'),
    title: 'Privacy policy',
    navigate: 'Privacy',
    visible: false,
    id: 4
  },
  {
    icon: require('../images/Slider_37.png'),
    title: 'Terms condition',
    navigate: 'Terms',
    visible: false,
    id: 5
  },

];

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
let isDone = true;

export default class Sidebar extends Component {

  state = {
    user: '', wallet: 0, name: '',
    mobile: '',
    userid: '', refresh: false, profile: null,
    avatarSource: null, visible: false, id: ''
  }


  componentDidUpdate() {
    const isOpen = getDrawerStatusFromState(this.props.state);
    //     if (isOpen == "open") {
    //       console.log(isOpen);
    //     AsyncStorage.getItem('profile').then(Data => {
    //       AsyncStorage.getItem('name').then(name => {
    //         AsyncStorage.getItem('phone').then(phone => {
    //           AsyncStorage.getItem('id').then(id => {

    //         this.setState({ profile: Data ? Data : null,  name: name, mobile:phone,id:id })
    //       })   
    //     })
    //   })
    // })
    //     }

    if (isOpen == "open" && isDone) {
      console.log(isOpen);
      AsyncStorage.getItem('user').then(user => {
        AsyncStorage.getItem('id').then(id => {
          console.log(user);
          if(id){
          this.setState({ name: JSON.parse(user).company_name, mobile: JSON.parse(user).phone, id: JSON.parse(id) })
          }
        })

      })
      isDone = false
    } else if (isOpen == "closed" && !isDone) {
      isDone = true
      console.log(isOpen);
    }
  }
  render() {
    const { navigation } = this.props
    const theme = "light"
    const activeRoute = this.props.state.routes[this.props.state.index].name;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent', position: "absolute", top: 0, bottom: 0, left: 0, right: 0, height: '100%', width: '100%' }}>
        <View style={{ flex: 1, overflow: 'visible', }}>
          <StatusBar barStyle='dark-content' translucent={true} backgroundColor={"transparent"} />
          <FlatList
            style={{ overflow: 'hidden', }}
            ListHeaderComponent={this.Header}
            data={this.state.id ? Datasource : Datasource1}
            renderItem={({ item, index }) =>
              <View style={{
                padding: 0, width: '100%',
                paddingVertical: 0, paddingLeft: 20,
                marginVertical: 0.5,
                borderRadius: 30,
                backgroundColor: activeRoute == item.navigate ? '#f2f2f2' : checkTheme(theme).white
                // borderBottomWidth:activeRoute == item.navigate ?  0 : 1, borderBottomColor: checkTheme(theme).white
              }}>

                <TouchableOpacity
                  onPress={() => {

                    if (item.title == 'Logout') {

                      AsyncStorage.removeItem('user')
                      AsyncStorage.removeItem('id')

                      this.props.navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{ name: "Login" }],
                        })
                      );
                    } else if (item.title == 'Login') {
                      this.props.navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{ name: "Login" }],
                        })
                      );
                    } else {

                      if (item.navigate == "Products") {
                        this.props.navigation.navigate(item.navigate, { subcat_data: { name: 'Shop Now' } })
                      } else {
                        this.props.navigation.navigate(item.navigate ? item.navigate : '')
                      }
                      // this.props.navigation.navigate(item.navigate ? item.navigate : '')
                      this.setState({ refresh: !this.state.refresh }, () => {
                        this.props.navigation.closeDrawer()
                      })
                    }
                  }}
                  style={{
                    paddingHorizontal: 0,
                    paddingVertical: 17,
                    alignItems: 'center',
                    width: '100%', flexDirection: 'row'
                  }}>
                  <Image
                    resizeMode={'contain'}
                    style={{
                      height: 25, width: 25,
                      tintColor: activeRoute == item.navigate ? checkTheme(theme).primary : checkTheme(theme).black,
                    }}
                    source={item.icon} />

                  <View style={{
                    flex: 0.90, paddingHorizontal: 10, marginLeft: 10,
                    justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'

                  }}>
                    <Text style={{
                      textAlign: 'left',
                      color: activeRoute == item.navigate ? checkTheme(theme).primary : checkTheme(theme).black,
                      fontFamily: activeRoute == item.navigate ? Fonts.SemiBold : Fonts.Regular, fontSize: 15
                    }}>{item.title}</Text>


                  </View>
                </TouchableOpacity>
              </View>
            }
            keyExtractor={(item, index) => String(index)}
          />
          {/* <Image style={{ height: height * .35, width: '100%', position: 'absolute', bottom: 0, zIndex: -1, right: 0 }}
            resizeMode="cover" source={require('../images/back4.png')} /> */}

        </View>

      </SafeAreaView>
    )
  }
  Header = () => {
    const theme = "light"
    return (
      <View
        style={{
          flexDirection: 'row',
          width: Platform.OS == "ios" ? "100%" : '105%',
          backgroundColor: checkTheme(theme).secondary,
          alignItems: 'center',
          padding: 5,
          height: heightPercentageToDP('20%'),
          alignSelf: 'center',
          borderTopRightRadius: 50,
          paddingHorizontal: 20,
          justifyContent: 'space-between'
        }}>
        {this.state.id ?
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 10, }}>
              <Image style={{
                height: 90, width: 90, borderRadius: 45,


              }}
                source={this.state.profile ? { uri: this.state.profile } : require('../images/logoplaceholder.png')} />
              <View style={{ flex: 1, flexDirection: 'column', marginLeft: 10 }}>
                <Text style={{ fontSize: 18, fontFamily: Fonts.SemiBold, color: 'white', paddingTop: 0 }}>{this.state.name}</Text>
                <Text style={{ fontSize: 14, fontFamily: Fonts.Regular, color: 'white', paddingTop: 6 }}>{this.state.mobile}</Text>
              </View>
            </View>
          </> :
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 10, }}>
            <Image style={{
              height: 90, width: 90, borderRadius: 45,


            }}
              source={require('../images/logoplaceholder.png')} />
            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
              {/* <Text style={{ fontSize: 20, fontFamily: Fonts.Regular, color: 'white', paddingTop: 6 }}>Welcome</Text> */}

              <Text style={{ fontSize: 18, fontFamily: Fonts.SemiBold, color: 'white', paddingTop: 0 }}> Welcome</Text>
            </View>
          </View>

        }
      </View>
    )
  }
}


