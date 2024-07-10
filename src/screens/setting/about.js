
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
import HTML from "react-native-render-html";
import Loader from '../../common/Loader';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const renderItem = { h2: { textAlign: 'left', color: 'black' }, p: { textAlign: 'left', color: 'black', }, strong: {color: 'black'}, li: {color:'gray', }  }

export default class About extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: "loading",
            loading: true
        }
    }

    componentDidMount() {
        this.about()
    }

    about = async () => {

        var Request = {
            security: 1,
        }
        this.setState({ loading: true })
        const res = await FetchAPI(API.about, "POST", Request);
        console.log(res);
        if (res.status == "success") {
            this.setState({
                loading: false,
                dataSource: res.data.desc,
                image: res.data.image,
                title: res.data.title

            })

        } else {
            Toast.show(res.message)
            this.setState({ loading: false, dataSource: 'No data found' })
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


                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: widthPercentageToDP('2%'), paddingRight: widthPercentageToDP('5%'), paddingTop: Platform.OS == "ios" ? 15 : 35, paddingBottom: 10 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                <TouchableOpacity onPress={()=> this.props.navigation.goBack()} style={{padding:5}}>
                                <Image style={{ height: 28, width: 28, tintColor: checkTheme(theme).black }} resizeMode="contain" source={require('../../images/leftarrow.png')} />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: Fonts.SemiBold, fontSize: FontSize.medium,  color: checkTheme(theme).black }}>{"About"}</Text>
                            </View>

                        </View>


                                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 10, }}>

                                    <ScrollView>
                                        <View style={{ padding: 5, width: widthPercentageToDP('90%'), alignSelf:'center', paddingBottom:100 }}>
                                        <Image
                  source={{ uri: this.state.image}}
                  resizeMode="contain"
                  style={{
                    height: 200,
                    width: '100%',
                    borderRadius: 20,
                    backgroundColor: checkTheme(theme).light_gray
                  }}
                />
                                                <Text style={{ fontFamily: Fonts.SemiBold, fontSize: FontSize.medium,  color: checkTheme(theme).black, paddingVertical:5, }}>{this.state.title}</Text>

                                            <HTML
                                                tagsStyles={renderItem}
                                                containerStyle={{ color: checkTheme(theme).black, alignItems:'center', justifyContent:'center' }}
                                                source={{ html: this.state.dataSource ? this.state.dataSource : '' }}
                                                imagesMaxWidth={Dimensions.get("window").width*.9}
                                                contentWidth={Dimensions.get("window").width*.9}
                                            />
                                        </View>
                                        <View style={{ height: 20 }}></View>
                                    </ScrollView>
                                </View>


                            </View>
                            <Image style={{ height: height * .35, width: width, position: 'absolute', bottom: 0, zIndex: -1, right: 0 }}
          resizeMode="cover" source={require('../../images/back4.png')} />

                    </SafeAreaView>
                )
            }}
            </ThemeContext.Consumer>
        )
    }


}
