
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


export default class Faqs extends React.Component {
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
        const res = await FetchAPI(API.faqs, "POST", Request);
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


                                <View style={{ height:55, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: checkTheme(theme).medium_gray, paddingVertical: 10 }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ flex: 0.25, padding: 5, }}>
                                        <Image style={{ height: 25, width: 25 }} resizeMode="contain" source={require('../../images/arrowleft.png')} />
                                    </TouchableOpacity>
                                    <View style={{ flex: 0.50, alignItems: 'center', justifyContent: 'center', }}>
                                        <Text style={{ fontFamily: Fonts.SemiBold, textAlign: 'center', color: checkTheme(theme).black, fontSize: FontSize.medium, }}>{"FAQ's"}</Text>
                                    </View>
                                    <View style={{ flex: 0.25, }} />
                                </View>



                                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 10, }}>

                                <FlatList
              style={{  marginTop: 10, width: widthPercentageToDP('90%'), alignSelf: 'center', }}
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
                  }} activeOpacity={0.8} style={{ flex: 1, backgroundColor: checkTheme(theme).light_gray, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 6, marginBottom: item.open ? 0 : 2 }}>
                    <Text style={{ flex :1, fontFamily: Fonts.Regular, fontSize: 16, textAlign: 'left', color: checkTheme(theme).primarydark, }}>
                      {item.question}
                    </Text>
                    {item.open ?
                      <Text style={{ fontFamily: Fonts.Bold, fontSize: 35, marginHorizontal:10, textAlign: 'center', color: checkTheme(theme).primary, }}>
                        -
                      </Text>
                      :
                      <Text style={{ fontFamily: Fonts.Bold, fontSize: 35, marginHorizontal:10, textAlign: 'center', color: checkTheme(theme).primary, }}>
                        +
                      </Text>
                    }
                  </TouchableOpacity>
                  {item.open ?
                  <View  style={{ flex: 1, borderColor: '#f2f2f2', flexDirection: 'row', borderWidth:1,   alignItems: 'center', padding: 10,  }}>
                    <Text style={{ fontFamily: Fonts.Light, fontSize: 14, textAlign: 'left', color: checkTheme(theme).black, }}>
                      {item.answer}
                    </Text>
                    
                  </View>
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
