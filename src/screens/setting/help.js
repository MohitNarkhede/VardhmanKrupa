
import React from 'react';
import {
    Text,
    View,
    Image,
    StatusBar,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    ScrollView
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

const renderItem = { h2: { textAlign: 'left', marginTop: 16, color: 'black' }, p: { textAlign: 'left', color: 'black' } }

export default class Help extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: "loading",
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
        const res = await FetchAPI(API.help, "POST", Request);
        console.log(res);
        if (res.status == "success") {
            this.setState({
                loading: false,
                dataSource: res.data[0].content,


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


                                <View style={{ height: this.props.route.params?.top ? 75 : 55, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: checkTheme(theme).medium_gray, paddingVertical: 10, paddingTop: this.props.route.params?.top ? 30 : 10, }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ flex: 0.25, padding: 5, }}>
                                        <Image style={{ height: 25, width: 25 }} resizeMode="contain" source={require('../../images/arrowleft.png')} />
                                    </TouchableOpacity>
                                    <View style={{ flex: 0.50, alignItems: 'center', justifyContent: 'center', }}>
                                        <Text style={{ fontFamily: Fonts.SemiBold, textAlign: 'center', color: checkTheme(theme).black, fontSize: FontSize.medium, }}>{"Help"}</Text>
                                    </View>
                                    <View style={{ flex: 0.25, }} />
                                </View>



                                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 10, }}>

                                    <ScrollView>
                                        <View style={{ padding: 10 }}>
                                            {/* <HTML
                                                tagsStyles={renderItem}
                                                containerStyle={{ color: checkTheme(theme).black, width: widthPercentageToDP('90%'), alignItems:'center', justifyContent:'center' }}
                                                source={{ html: this.state.dataSource ? this.state.dataSource : '' }}
                                                imagesMaxWidth={Dimensions.get("window").width*.9}
                                                contentWidth={Dimensions.get("window").width*.9}
                                            /> */}

                                            <Text style={{fontSize: FontSize.small, fontFamily: Fonts.Regular, color: checkTheme(theme).black, textAlign:'left'}}>
                                                {this.state.dataSource}
                                            </Text>
                                        </View>
                                        <View style={{ height: 20 }}></View>
                                    </ScrollView>
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
