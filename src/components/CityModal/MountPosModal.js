import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, View, FlatList, TouchableOpacity, Text, TextInput, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';


import styles from './modalStyle';
import Fonts from '../../common/Fonts';
import { checkTheme } from '../../common/checkTheme';
import { ThemeContext } from '../ThemeProvider';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SimpleToast from 'react-native-simple-toast';



export default class MountPosModal extends Component {
  constructor (props, ctx) {
    super(props, ctx)

    this.state = {
      filter: '',
      loading: false,
      ds: props.options,
      noResult:"No result found"
    }
  }

static contextType = ThemeContext
;

  componentWillReceiveProps (newProps) {
    if ((!this.props.visible && newProps.visible) || (this.props.options !== newProps.options)) {
      this.setState({
        filter: '',
        ds: newProps.options,
      })
    }
  }

  render () {
    const {
      title,
      titleTextStyle,
      overlayStyle,
      cancelContainerStyle,
      renderList,
      keyExtractor,
      renderCancelButton,
      visible,
      modal,
      onCancel
    } = this.props

    const renderedTitle = (!title) ? null : (
      <Text style={[titleTextStyle || styles.titleTextStyle, {color: checkTheme(this.context.theme).primary}]}>{title}</Text>
    )

    return (
      <Modal
        onRequestClose={onCancel}
        {...modal}
        visible={visible}
        supportedOrientations={['portrait', 'landscape']}
      >
        
        <View style={[overlayStyle || styles.overlay]}>
        {/* <KeyboardAwareScrollView> */}
      
          {/* {renderedTitle} */}
          {(renderList || this.renderList)()}
          {/* </KeyboardAwareScrollView> */}

        </View>
      </Modal>
    )
  }

  renderList = () => {
    const {
      showFilter,
      autoFocus,
      listContainerStyle,
      androidUnderlineColor,
      placeholderText,
      placeholderTextColor,
      filterTextInputContainerStyle,
      filterTextInputStyle,
    } = this.props;

    const filter = (!showFilter) ? null : (
        <View style={{ flexDirection:'column', }}>
        <View style={{ flexDirection:'row',  marginHorizontal:10, }}>
        <View style={{   borderWidth: 1, flex:1, marginRight:10, borderRadius: 10, borderColor: checkTheme(this.context.theme).light_gray, flexDirection:'row', elevation: 1, backgroundColor: checkTheme(this.context.theme).white,}}>
         <TextInput
          onChangeText={(text)=> {this.setState({mountpos: text })}}
           autoCorrect={false}
           blurOnSubmit={true}
           allowFontScaling={false}
           autoFocus={true}
           autoCapitalize="none"
           underlineColorAndroid={androidUnderlineColor}
           placeholderTextColor={placeholderTextColor}
           placeholder={"Enter Mounting Position"}
           style={[filterTextInputStyle || styles.filterTextInput, {color: checkTheme(this.context.theme).black,  }]} />
           
       </View>
       <TouchableOpacity onPress={()=> {
           if(!this.state.mountpos){
            SimpleToast.show('Please enter mounting position', Toast.LONG)
           } else {
            this.props.onAdd(this.state.mountpos)
           }
       }}
         activeOpacity={0.7}
         style={{
             width: widthPercentageToDP('25%'),
     backgroundColor: checkTheme(this.context.theme).primary,
    //  paddingVertical: 10,
    borderRadius: 10, 
    marginVertical:4,
     justifyContent:'center',
     alignItems:'center',
    //  paddingHorizontal: 20,
         }}
       >
 
         <Text style={{fontFamily: Fonts.Light, fontSize:16, color: checkTheme(this.context.theme).white, }}>ADD</Text>
       </TouchableOpacity>
     
       </View>

<View style={{alignItems:'center', justifyContent:'center', marginVertical:15}}>
<Text style={{fontFamily: Fonts.Light, fontSize:16, color: checkTheme(this.context.theme).black, letterSpacing:2}}>OR</Text>
</View>

      <View style={[filterTextInputContainerStyle || styles.filterTextInputContainer, { borderWidth: 1, borderRadius: 10, borderColor: checkTheme(this.context.theme).light_gray, elevation: 1, backgroundColor: checkTheme(this.context.theme).white,}]}>
        <TextInput
          onChangeText={this.onFilterChange}
          autoCorrect={false}
          blurOnSubmit={true}
          allowFontScaling={false}
          autoFocus={false}
          autoCapitalize="none"
          underlineColorAndroid={androidUnderlineColor}
          placeholderTextColor={placeholderTextColor}
          placeholder={placeholderText}
          style={[filterTextInputStyle || styles.filterTextInput, {color: checkTheme(this.context.theme).black, }]} />
      </View>
      </View>
    )

    return (
      <View style={[listContainerStyle || styles.listContainer, {backgroundColor: checkTheme(this.context.theme).background}]}>
 
      
          {(this.renderCancelButton || this.renderCancelButton)()}
       
        {filter}
        {this.renderOptionList()}
      </View>
    )
  }

  renderOptionList = () => {
    const {
      noResultsText,
      flatListViewProps,
      keyExtractor,
      keyboardShouldPersistTaps
    } = this.props

    const { ds } = this.state
    if(this.state.loading) {
        return(
            <View style={styles.noResults}>
            <ActivityIndicator size="large" color={'black'} animating={this.state.loading} />
            </View>
        )
            }
    else if (ds.length == 0) {
      return (
       
            <View style={styles.noResults}>
              <Text style={[styles.noResultsText, {color: checkTheme(this.context.theme).medium_gray}]}>{this.state.noResult}</Text>
            </View>
         
      )
    } else {
      return (
        <FlatList
          keyExtractor={keyExtractor||this.keyExtractor}
          {...flatListViewProps}
          data={ds}
          renderItem={(item)=> this.renderOption(item.item)}
          keyboardShouldPersistTaps="always"
        />
      )
    }
  }

  renderOption = (item) => {
   
    
    const {
      selectedOption,
      renderOption,
        optionTextStyle,
      selectedOptionTextStyle
    } = this.props

    const { id, name } = item

    let style = styles.optionStyle
    let textStyle = optionTextStyle||styles.optionTextStyle

    if (id === selectedOption) {
      style = styles.selectedOptionStyle
      textStyle = selectedOptionTextStyle ||styles.selectedOptionTextStyle
    }
    if (renderOption) {
      return renderOption(item, id === selectedOption)
    } else {

      return (
<View>
       
        <TouchableOpacity activeOpacity={0.7}
          style={[style, {flexDirection:'row', flex:1,  paddingHorizontal:20 }]}
          onPress={() => this.props.onSelect(id, name)}
        >
        <Text style={[textStyle, {fontFamily: Fonts.Regular, color: checkTheme(this.context.theme).black}]}>{name}</Text>

        </TouchableOpacity>



</View>
      )
    }
  }
  keyExtractor = (item, index) => item.id;

  renderCancelButton = () => {
    const {
      cancelButtonStyle,
      cancelButtonTextStyle,
      cancelButtonText
    } = this.props

    return (
      <TouchableOpacity onPress={this.props.onCancel}
        activeOpacity={0.7}
        style={cancelButtonStyle || styles.cancelButton}
      >

<Text style={[styles.titleTextStyle, {color: checkTheme(this.context.theme).primary}]}>{this.props.title}</Text>
        <Text style={{fontFamily: Fonts.Light, fontSize:16, color: checkTheme(this.context.theme).black, letterSpacing:2}}>CLOSE</Text>
      </TouchableOpacity>
    )
  }

  onFilterChange = (text) => {
    const { options } = this.props


      const filter = text.toLowerCase()

      // apply filter to incoming data
      const filtered = (!filter.length)
        ? options
        : options.filter(({ searchKey, name, id }) => (
          0 <= name.toLowerCase().indexOf(filter) ||
            (searchKey && 0 <= searchKey.toLowerCase().indexOf(filter))
        ))
  
      this.setState({
        filter: text.toLowerCase(),
        ds: filtered
      })
    
       
 
  }
}

MountPosModal.propTypes = {
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  placeholderText: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  androidUnderlineColor: PropTypes.string,
  cancelButtonText: PropTypes.string,
  title: PropTypes.string,
  noResultsText: PropTypes.string,
  visible: PropTypes.bool,
  showFilter: PropTypes.bool,
  modal: PropTypes.object,
  selectedOption: PropTypes.string,
  renderOption: PropTypes.func,
  renderCancelButton: PropTypes.func,
  renderList: PropTypes.func,
  flatListViewProps: PropTypes.object,
  filterTextInputContainerStyle: PropTypes.any,
  filterTextInputStyle: PropTypes.any,
  cancelContainerStyle: PropTypes.any,
  cancelButtonStyle: PropTypes.any,
  cancelButtonTextStyle: PropTypes.any,
  titleTextStyle: PropTypes.any,
  overlayStyle: PropTypes.any,
  listContainerStyle: PropTypes.any,
  optionTextStyle:PropTypes.any,
  selectedOptionTextStyle:PropTypes.any,
  keyboardShouldPersistTaps: PropTypes.string
}

MountPosModal.defaultProps = {
  placeholderText: 'Search Data Center...',
  placeholderTextColor: '#ccc',
  androidUnderlineColor: 'rgba(0,0,0,0)',
  cancelButtonText: 'Close',
  noResultsText: 'No matches',
  visible: false,
  showFilter: true,
  keyboardShouldPersistTaps: 'never'
}
