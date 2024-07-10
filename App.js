import React from 'react';
import { Text, View, LogBox, SafeAreaView, Platform } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import AsyncStorage from '@react-native-async-storage/async-storage';

import ThemeProvider from './src/components/ThemeProvider';
import { navigationRef } from './src/navigation/RootNavigation';

import Splash from './src/screens/splash';
import Login from './src/screens/auth/login';
import SignupOne from './src/screens/auth/signupone';
import Verification from './src/screens/auth/verification';
import BottomTab from './src/navigation/bottomtab';
import Setting from './src/screens/profile/setting';

import EditProfile from './src/screens/profile/editprofile';
import Privacy from './src/screens/setting/privacy';
// import Support from './src/screens/setting/support';
// import Help from './src/screens/setting/help';
// import Faqs from './src/screens/setting/faqs';
import messaging from '@react-native-firebase/messaging';
import Maintenance from './src/screens/Maintenance';
import Success from './src/screens/main/success';
import Sidebar from './src/navigation/Sidebar';
import { checkTheme } from './src/common/checkTheme';
import SubCategory from './src/screens/main/subcategory';
import Terms from './src/screens/setting/terms';
import About from './src/screens/setting/about';
import Products from './src/screens/main/products';
import Cart from './src/screens/main/cart';
import Order from './src/screens/MyOrder/order';
import OrderDetails from './src/screens/MyOrder/orderdetails';
import Contact from './src/screens/setting/contact';
import Search from './src/screens/search/search';
import Notification from './src/screens/main/notification';
import ProductsDetail from './src/screens/main/productdetail';
import BankDetails from './src/screens/main/bankdetails';
import Request from './src/screens/auth/request';
import Rate from './src/screens/main/rate';
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = {textTransform: 'capitalize'};
Text.defaultProps.allowFontScaling = false;
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();



function HomeDrawer() {
  return (
      <Drawer.Navigator
      screenOptions={{
        swipeEnabled: false,
        drawerStyle: { width: '70%', borderTopRightRadius: Platform.OS == "ios" ? 0 : 50, borderBottomRightRadius: Platform.OS == "ios" ? 0 : 50, borderTopWidth:1, borderRightWidth:1, borderColor: checkTheme('light').acent, overflow:'hidden'},
        overlayColor: 'rgba(0,0,0,0.5)',
      }}
        initialRouteName="Home" drawerContent={(props) => <Sidebar {...props} />}>
       <Drawer.Screen name="Home" component={BottomTab} options={{headerShown: false}} />
      </Drawer.Navigator>
  );
}

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.routeNameRef  = React.createRef();
  }


 async componentDidMount() {

    LogBox.ignoreLogs([
      "Invariant Violation:",
      ])
      let device = await messaging().isDeviceRegisteredForRemoteMessages;
      console.log("device", device);
      if(device){

      } else {
        await messaging().registerDeviceForRemoteMessages();
      }
    AsyncStorage.getItem('themeMode').then(theme => {
      if (!theme) {
        AsyncStorage.setItem('themeMode', 'light');

      }
      AsyncStorage.getItem('timeout').then(timeout => {
        if (!timeout) {
          AsyncStorage.setItem('timeout', '60000');
  
        }
      })
    })

  }


  render() {
    const { navigation } = this.props
    return (
      <ThemeProvider>
        <NavigationContainer 
        ref={navigationRef}
       
        >
          <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} navigationOptions={{ animationEnabled: false, headerShown: false, header: null }} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignupOne" component={SignupOne} /> 
          <Stack.Screen name="Home" component={HomeDrawer} />
          <Stack.Screen name="Verification" component={Verification} />
          <Stack.Screen name="SubCategory" component={SubCategory} />
          <Stack.Screen name="Products" component={Products} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="Privacy" component={Privacy} />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="Terms" component={Terms} />
          {/* <Stack.Screen name="Support" component={Support} />
          <Stack.Screen name="Help" component={Help} />
          <Stack.Screen name="Faqs" component={Faqs} /> */}
          <Stack.Screen name="Maintenance" component={Maintenance} />
          <Stack.Screen name="Success" component={Success} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="Order" component={Order} />
          <Stack.Screen name="OrderDetails" component={OrderDetails} />
          <Stack.Screen name="Contact" component={Contact} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="ProductDetail" component={ProductsDetail} />
          <Stack.Screen name="BankDetails" component={BankDetails} />
          <Stack.Screen name="Request" component={Request} />
          <Stack.Screen name="Rate" component={Rate} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    );
  }

  // return (
  //   <View>
  //     <Text>Hello</Text>
  //   </View>
  // );


}