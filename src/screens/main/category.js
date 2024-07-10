
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
    Platform
} from 'react-native';
import Colors from '../../common/Colors';
import { CommonActions } from "@react-navigation/native";
import NetInfo from '@react-native-community/netinfo';
import API from '../../common/Api';
import Loader from '../../common/Loader';
import timeout from '../../common/timeout';
import Toast from 'react-native-simple-toast';
import Fonts from '../../common/Fonts';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Button from '../../components/button';
const { width, height } = Dimensions.get('window')
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FloatingLabelInput } from '../../components/floatinglabel';
import Background from '../../components/background';
import { checkTheme } from '../../common/checkTheme';
import { ThemeContext } from '../../components/ThemeProvider';
import FontSize from '../../common/FontSize';
import FetchAPI from '../../common/FetchAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Carousel from 'react-native-snap-carousel';
import SmallButton from '../../components/smallbutton';
const SLIDER_1_FIRST_ITEM = 0;

export default class Category extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            scrollheader: false,
            greeting: 'Hello, ',
            loading: false,
            categories:[{},{},{},{},{}],
            cart_count:0,
        }

    }

    async componentDidMount() {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

        this.categoriesAPI()
        this.in4 = this.props.navigation.addListener('focus', async () => {
            this.countAPI()
        })
        let user = await AsyncStorage.getItem('user');
        // console.log(user.first_name);    
        // let first_name = JSON.parse(user).first_name;
        this.setState({ greeting: this.generateGreetings() })
    }

    componentWillUnmount() {
        this.in4()
    }

    countAPI = async () => {
        let id = await AsyncStorage.getItem('id')
        let token = await AsyncStorage.getItem('token')
        var Request = {
            security: 1,
            token: JSON.parse(token)
        }
        if (id) {
            Request = {
                security: 0,
                token: JSON.parse(token),
                id: JSON.parse(id)
            }
        }
        console.log(JSON.stringify(Request));
        console.log(API.cart_count);
        const res = await FetchAPI(API.cart_count, "POST", Request);
        console.log(res);
        if (res.status == "success") {
            this.setState({ cart_count: res.cart_count, })
        } else if (res.status == "failed") {
            AsyncStorage.removeItem('id');
            AsyncStorage.removeItem('user');
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                }),
            );
            this.setState({ cart_count: 0 })
        } else {
            // Toast.show(res.message)
            this.setState({ cart_count: 0 })
        }
    }


    generateGreetings = () => {

        var currentHour = moment().format("HH");
        console.log(currentHour);
        if (currentHour >= 3 && currentHour < 12) {
            return "Good Morning ";
        } else if (currentHour >= 12 && currentHour < 16) {
            return "Good Afternoon ";
        } else if (currentHour >= 16 && currentHour < 20) {
            return "Good Evening ";
        } else if (currentHour >= 20 && currentHour < 3) {
            return "Hello ";
        } else {
            return "Hello ";
        }

    }

    generateImages = () => {

        var currentHour = moment().format("HH");
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

    }




    categoriesAPI = async () => {
        let id = await AsyncStorage.getItem('id')
        let token = await AsyncStorage.getItem('token')
        var Request = {
            security: 1,
            token: JSON.parse(token)
        }
        if (id) {
            Request = {
                security: 0,
                token: JSON.parse(token),
                id: JSON.parse(id)
            }
        }
        this.setState({ loading: true })
        const res = await FetchAPI(API.categories, "POST", Request);
        console.log(res);
        if (res.status == "success") {
            this.setState({ categories: res.data, loading: false })
        } else if (res.status == "failed") {
            AsyncStorage.removeItem('id');
            AsyncStorage.removeItem('user');
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                }),
            );
            this.setState({ loading: false, })
        } else {
            // Toast.show(res.message)
            this.setState({ loading: false, categories: [] })
        }
    }




    render() {
        let { user } = this.state;
        return (
            <ThemeContext.Consumer>{(context) => {

                const theme = context.theme;
                return (
                    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2", }}>
                        <StatusBar backgroundColor={checkTheme(theme).light_gray} barStyle="dark-content" />
                        {/* <Loader loading={this.state.loading} /> */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: widthPercentageToDP('5%'), paddingTop: Platform.OS == "ios" ? 15 : 45, paddingBottom: 10 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                <Image style={{ height: 25, width: 25 }} resizeMode="contain" source={this.generateImages()} />
                                <Text style={{ fontFamily: Fonts.SemiBold, fontSize: FontSize.medium, marginLeft: 10, color: checkTheme(theme).black }}>{this.state.greeting}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Search')} style={{ paddingHorizontal: 10 }}>
                                <Image style={{ height: 25, width: 25 }} resizeMode="contain" source={require('../../images/search.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Cart')} style={{ paddingHorizontal: 10 }}>
                                <Image style={{ height: 25, width: 25 }} resizeMode="contain" source={require('../../images/bag.png')} />
                                {this.state.cart_count != 0 &&
                                    <View style={{ top: -5, right: 0, position: 'absolute', height: 20, minWidth: 20, borderRadius: 10, backgroundColor: checkTheme(theme).secondary, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: Fonts.SemiBold, fontSize: 10, paddingHorizontal: 2, color: checkTheme(theme).white }}>{this.state.cart_count}</Text>
                                    </View>
                                }
                            </TouchableOpacity>

                        </View>
                        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
         
                            <FlatList
                                style={{ flex: 1, }}
                                data={this.state.categories}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => (
                                    <>
                                    {this.state.loading ?
                                        <SkeletonPlaceholder>
                                            <SkeletonPlaceholder.Item flexDirection="column" alignItems="center" >
                                                <SkeletonPlaceholder.Item borderRadius={7} marginTop={7} alignSelf="center"  width={widthPercentageToDP('96%')} height={634 * width * .96 / 1920} />
                                            </SkeletonPlaceholder.Item>
                                        </SkeletonPlaceholder>
                                        :

                                    <View style={{
                                        width: width * 1,
                                        elevation: 10,
                                        marginTop: 8,

                                    }}>
                                            <TouchableOpacity
                                                activeOpacity={0.9}
                                                // onPress={() => {
                                                //   navigation.navigate('Detail', { data: {
                                                //     id: item.pid,
                                                //     name: item.pname,
                                                //   } })
                                                // }}
                                                onPress={() => {
                                                   
                                                        this.props.navigation.navigate('SubCategory', { item: item })
                                                    

                                                }}

                                            >
                                                <Image resizeMode={'contain'}
                                                    style={{ height: 634 * width * .96 / 1920, backgroundColor:'red', width: width * .96, alignSelf: 'center', borderRadius: 10, backgroundColor: checkTheme(theme).light_gray }}
                                                    source={{ uri: item.image }} />
                                            </TouchableOpacity>
                                        
                                    </View>
                                            }
                                            </>
                                )}
                                keyExtractor={(item, index) => String(index)}
                            />

                        </ScrollView>
                    </SafeAreaView>
                )
            }}

            </ThemeContext.Consumer>
        )
    }


}