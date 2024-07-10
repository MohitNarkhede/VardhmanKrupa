
import React from 'react';
import {
    Text,
    View,
    Image,
    StatusBar,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    FlatList
} from 'react-native';
import API from '../../common/Api';
import Toast from 'react-native-simple-toast';
import Fonts from '../../common/Fonts';
const { width, height } = Dimensions.get('window')
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FloatingLabelInput } from '../../components/floatinglabel';
import { checkTheme } from '../../common/checkTheme';
import { ThemeContext } from '../../components/ThemeProvider';
import FontSize from '../../common/FontSize';
import FetchAPI from '../../common/FetchAPI';
import Loader from '../../common/Loader';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class Support extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            loading: true
        }
    }

    componentDidMount() {
        this.privacy()
    }

    privacy = async () => {

        var Request = {
            security: 1,
        }
        this.setState({ loading: true })
        const res = await FetchAPI(API.supports, "POST", Request);
        console.log(res);
        if (res.status == "success") {
            this.setState({
                loading: false,
                dataSource: res.data,


            })

        } else {
            Toast.show(res.message)
            this.setState({ loading: false, dataSource: [] })
        }
    }

    add_support = async (sid) => {
        let id = await AsyncStorage.getItem('id')
        var Request = {
            security: 1,
            user_id: JSON.parse(id),
            support_id: sid
        }
        this.setState({ loading: true })
        const res = await FetchAPI(API.user_support_add, "POST", Request);
        console.log(res);
        if (res.status == "success") {
            this.setState({
                loading: false
            })
            Toast.show(res.message)
        } else {
            Toast.show(res.message)
            this.setState({ loading: false, dataSource: [] })
        }
    }


    render() {
        let { user } = this.state;
        return (
            <ThemeContext.Consumer>{(context) => {
                const theme = context.theme;
                return (
                    <SafeAreaView style={{ flex: 1, backgroundColor: "white", }}>
                        <StatusBar backgroundColor={checkTheme(theme).white} barStyle="dark-content" />
                        <Loader loading={this.state.loading} />
                            <View style={{ position: 'relative', zIndex: 9999 }}>


                                <View style={{ height: this.props.route.params?.top ? 75 : 55, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: checkTheme(theme).medium_gray, paddingVertical: 10, paddingTop: this.props.route.params?.top ? 30 : 10, }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ flex: 0.25, padding: 5, }}>
                                        <Image style={{ height: 25, width: 25 }} resizeMode="contain" source={require('../../images/arrowleft.png')} />
                                    </TouchableOpacity>
                                    <View style={{ flex: 0.50, alignItems: 'center', justifyContent: 'center', }}>
                                        <Text style={{ fontFamily: Fonts.SemiBold, textAlign: 'center', color: checkTheme(theme).black, fontSize: FontSize.medium, }}>{"Support"}</Text>
                                    </View>
                                    <View style={{ flex: 0.25, }} />
                                </View>



                                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center',  }}>

                                <FlatList
              style={{   width: widthPercentageToDP('100%'), alignSelf: 'center', }}
              data={this.state.dataSource}
              extraData={this.state}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item, index }) => (
                <View style={{ flex: 1, backgroundColor: '#fff', flexDirection: 'column',  }}>
                  <TouchableOpacity onPress={()=> {
                    if(item.open){
                      item.open = false;
                    } else {
                      item.open = true;
                    }
                  this.setState({refresh: !this.state.refresh})
                  }} activeOpacity={0.8} style={{ flex: 1, borderBottomWidth: 1, borderColor: checkTheme(theme).medium_gray, paddingVertical:20, backgroundColor: checkTheme(theme).white, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8, paddingHorizontal:15, marginBottom: item.open ? 0 : 2 }}>
                    <Text style={{ flex :1, fontFamily: Fonts.Regular, fontSize: 16, textAlign: 'left', color: checkTheme(theme).black, }}>
                      {item.question}
                    </Text>
                      <Image style={{height:20, width:20, tintColor: checkTheme(theme).black}} resizeMode="contain" source={item.open ? require('../../images/arrowdown.png') : require('../../images/right.png')} />
                     
                  </TouchableOpacity>
                  {item.open ?
                  <TouchableOpacity onPress={()=> {this.add_support(item.id)}}  style={{ flex: 1, borderBottomWidth: 1, paddingVertical:20, borderColor: checkTheme(theme).medium_gray, backgroundColor: "#E8F8F8", flexDirection: 'row', alignItems: 'center', padding: 10, paddingHorizontal:20  }}>
                    <Text style={{ fontFamily: Fonts.Light, fontSize: 14, textAlign: 'left', color: checkTheme(theme).black, }}>
                      {item.answer}
                    </Text>
                    
                  </TouchableOpacity>
                  : null }
                </View>
              )}
            />

                                </View>


                            </View>
                        <Image
                            resizeMode={'contain'}
                            style={{ height: 141 * width / 512, width: width, bottom: 0, right: 0, position: 'absolute', zIndex: -1 }}
                            source={require('../../images/settingbottom.png')} />
                    </SafeAreaView>
                )
            }}
            </ThemeContext.Consumer>
        )
    }


}
