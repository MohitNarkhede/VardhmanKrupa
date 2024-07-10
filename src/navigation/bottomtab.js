import React from 'react';
import { Image, View, Text, Platform, Dimensions, StyleSheet, Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { heightPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Home from '../screens/main/home';
import { checkTheme } from '../common/checkTheme';
import { ThemeContext } from '../components/ThemeProvider';
import Fonts from '../common/Fonts';
let URL = "";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Setting from '../screens/profile/setting';
import { DrawerActions } from '@react-navigation/native';
import { FloatingAction } from "../components/react-native-floating-action";
import Category from '../screens/main/category';
import Favourite from '../screens/main/favourite';
import Terms from '../screens/setting/terms';
const Tab = createBottomTabNavigator();
const dimen = Dimensions.get('window');
const items = [
    { label: 'Do a little dance' },
    { label: 'Make a lil love' },
    { label: 'Get down tonight' },
  ];

  
let sociallogin = 1;

const actions = [
    {
      text: "Whatsapp",
      icon: require('../images/whatsapp.png'),
      name: "Whatsapp",
      position: 1,
      screenName: "Whatsapp",
    },
    {
      text: "Call",
      icon: require('../images/telephone.png'),
      name: "Call",
      position: 2,
      screenName: "Call",
    },
    {
      text: "Notification",
      icon: require('../images/bell.png'),
      name: "Notification",
      position: 3,
      screenName: "Notification",
    },
  ];

export default class BottomTab extends React.Component {
    async componentDidMount() {
    let phone = await AsyncStorage.getItem('phone');
    let whatsapp = await AsyncStorage.getItem('whatsapp');
    this.setState({phone, whatsapp})
    }
    state = {
        isMenuOpen: false,
      };
    
      handleMenuToggle = isMenuOpen =>
        this.setState({ isMenuOpen });
    
        handleItemPress = (item, index) =>
        console.log('pressed item', item);


    render() {
        return (
            <ThemeContext.Consumer>{(context) => {

                const theme = context.theme;
                return (
                    <View style={styles.container}>
                    <Tab.Navigator
                        initialRouteName="Dashboard"
                       
                        screenOptions={{
                            keyboardHidesTabBar: true,
                            tabBarStyle: {
                                // paddingVertical:10,
                                paddingTop:  Platform.OS == 'ios' ? ((dimen.height === 780 || dimen.width === 780)
                                || (dimen.height === 812 || dimen.width === 812)
                                || (dimen.height === 844 || dimen.width === 844)
                                || (dimen.height === 896 || dimen.width === 896)
                                || (dimen.height === 926 || dimen.width === 926)) ? 28 : 8 : 8,
                                backgroundColor: "#4d4e4e",
                                alignItems: 'center',
                                borderRadius: 40,
                                bottom: Platform.OS == 'ios' ? ((dimen.height === 780 || dimen.width === 780)
                                    || (dimen.height === 812 || dimen.width === 812)
                                    || (dimen.height === 844 || dimen.width === 844)
                                    || (dimen.height === 896 || dimen.width === 896)
                                    || (dimen.height === 926 || dimen.width === 926)) ? 20 : 5 : 5,
                                left: 20,
                                right: 20,
                                position: 'absolute',
                                justifyContent: 'center',
                                height: Platform.OS == 'ios' ? ((dimen.height === 780 || dimen.width === 780)
                                    || (dimen.height === 812 || dimen.width === 812)
                                    || (dimen.height === 844 || dimen.width === 844)
                                    || (dimen.height === 896 || dimen.width === 896)
                                    || (dimen.height === 926 || dimen.width === 926)) ? 70 : 60 : 65,
                                shadowColor: '#7F5DF0',
                                shadowOffset: {
                                    width: 0,
                                    height: 10
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 40,
                                elevation: 5
                            },
                            headerShown: false,
                            
                        }}>
                        <Tab.Screen
                            name={'Dashboard'}
                            component={Home}
                            options={{
                                tabBarLabel: '',
                                tabBarIcon: ({ color, focused }) => (
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image
                                            source={require('../images/home.png')}
                                            style={{ tintColor: focused ? checkTheme(theme).primary : "#B7B7B7", marginTop: 5, height: focused ? 22 : 22, width: focused ? 22 : 22, alignItems: 'center' }}
                                            resizeMode="contain"
                                        />
                                        {/* {focused &&
                                            <Text style={{ fontSize: 12, fontFamily: Fonts.Regular, color: focused ? checkTheme(theme).primary : "#B7B7B7", marginTop: focused ? 3 : 3 }}>Home</Text>
                                        } */}
                                    </View>
                                ),
                            }}
                        />

                        <Tab.Screen
                            name={'Category'}
                            component={Category}
                            options={{
                                tabBarLabel: '',
                                tabBarIcon: ({ color, focused }) => (
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image
                                            source={require('../images/category.png')}
                                            style={{ tintColor: focused ? checkTheme(theme).primary : "#B7B7B7", marginTop: 5, height: focused ? 22 : 22, width: focused ? 22 : 22, alignItems: 'center' }}
                                            resizeMode="contain"
                                        />
                                        {/* {focused &&
                                            <Text style={{ fontSize: 12, fontFamily: Fonts.Regular, color: focused ? checkTheme(theme).primary : "#B7B7B7", marginTop: focused ? 3 : 3 }}>Category</Text>
                                        } */}
                                    </View>
                                ),
                            }}
                        />
                        <Tab.Screen
                            name={'Favourite'}
                            component={Favourite}
                            options={{
                                tabBarLabel: '',
                                tabBarIcon: ({ color, focused }) => (
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image
                                            source={focused ? require('../images/fillheart.png') : require('../images/heart.png')}
                                            style={{ tintColor: focused ? checkTheme(theme).primary : "#B7B7B7", marginTop: 5, height: focused ? 26 : 22, width: focused ? 26 : 22, alignItems: 'center' }}
                                            resizeMode="contain"
                                        />
                                        {/* {focused &&
                                            <Text style={{ fontSize: 12, fontFamily: Fonts.Regular, color: focused ? checkTheme(theme).primary : "#B7B7B7", marginTop: focused ? 3 : 3 }}>Favourite</Text>
                                        } */}
                                    </View>
                                ),
                            }}
                        />
                        <Tab.Screen
                            name={'Terms'}
                            component={Terms}
                            options={{
                                tabBarLabel: '',
                                tabBarIcon: ({ color, focused }) => (
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        {/* <Image
                                            source={require('../images/user.png')}
                                            style={{ tintColor: focused ? checkTheme(theme).primary : "#B7B7B7", marginTop: 5, height: focused ? 22 : 22, width: focused ? 22 : 22, alignItems: 'center' }}
                                            resizeMode="contain"
                                        /> */}
                                        {/* {focused &&
                                            <Text style={{ fontSize: 12, fontFamily: Fonts.Regular, color: focused ? checkTheme(theme).primary : "#B7B7B7", marginTop: focused ? 3 : 3 }}>Profile</Text>
                                        } */}
                                    </View>
                                ),
                            }}
                            listeners={({ navigation }) => ({
                                tabPress: e => {
                                this.action.animateButton();

                                  e.preventDefault()
                                }
                            })}

                        />
                        <Tab.Screen
                            name={'More'}
                            component={Setting}
                           
                            options={{
                                tabBarLabel: '',
                                unmountOnBlur: true,
                                tabBarIcon: ({ color, focused }) => (
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image
                                            source={require('../images/menu.png')}
                                            style={{ tintColor: focused ? checkTheme(theme).primary : "#B7B7B7", marginTop: 5, height: focused ? 22 : 22, width: focused ? 22 : 22, alignItems: 'center' }}
                                            resizeMode="contain"
                                        />
                                        {/* {focused &&
                                            <Text style={{ fontSize: 12, fontFamily: Fonts.Regular, color: focused ? checkTheme(theme).primary : "#B7B7B7", marginTop: focused ? 3 : 3 }}>More</Text>
                                        } */}
                                    </View>
                                ),
                            }}
                            listeners={({ navigation }) => ({
                                tabPress: e => {
                                  navigation.dispatch(DrawerActions.openDrawer())

                                  e.preventDefault()
                                }
                            })}
                        />
                    </Tab.Navigator>

                    <FloatingAction
        actions={actions}
        positionStyle={{ bottom:  Platform.OS == 'ios' ? ((dimen.height === 780 || dimen.width === 780)
        || (dimen.height === 812 || dimen.width === 812)
        || (dimen.height === 844 || dimen.width === 844)
        || (dimen.height === 896 || dimen.width === 896)
        || (dimen.height === 926 || dimen.width === 926)) ? 30 : 10 : 12, right: Dimensions.get('screen').width * .25, position: 'absolute', zIndex: 999, }}
        ref={ref => {
            this.action = ref;
        }}
        iconMain={require('../images/minimize.png')}
        overlayColor={'rgba(0,0,0,0.8)'}
        color={"transparent"}
        onPressItem={name => {
            if(name == "Whatsapp"){
                Linking.openURL('https://wa.me/91' + this.state.whatsapp)
            } else if(name == "Call"){
                Linking.openURL('tel:$:' + this.state.phone)
            } else {
                this.props.navigation.navigate('Notification')
            }
            this.action.animateButton();
        }}
      />


                  </View>
                );
            }}
            </ThemeContext.Consumer>
        )
    }
}
const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      position: 'relative',
    },
  });

  