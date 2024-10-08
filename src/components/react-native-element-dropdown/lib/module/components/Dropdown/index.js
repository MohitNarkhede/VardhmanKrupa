function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Keyboard, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View, I18nManager } from 'react-native';
import CInput from '../TextInput';
import { useDeviceOrientation } from '../../useDeviceOrientation';
import { useDetectDevice } from '../../toolkits';
import { styles } from './styles';
import _ from 'lodash';
const {
  isTablet,
  isIOS
} = useDetectDevice;

const ic_down = require('../../assets/down.png');

const defaultProps = {
  placeholder: 'Select item',
  activeColor: '#F6F7F8',
  data: [],
  style: {},
  selectedTextProps: {}
};
const DropdownComponent = /*#__PURE__*/React.forwardRef((props, currentRef) => {
  const orientation = useDeviceOrientation();
  const {
    testID,
    itemTestIDField,
    onChange,
    style,
    containerStyle,
    placeholderStyle,
    selectedTextStyle,
    inputSearchStyle,
    iconStyle,
    selectedTextProps,
    data,
    labelField,
    valueField,
    value,
    activeColor,
    fontFamily,
    iconColor = 'gray',
    searchPlaceholder,
    placeholder,
    search = false,
    maxHeight = 340,
    disable = false,
    keyboardAvoiding = true,
    renderLeftIcon,
    renderRightIcon,
    renderItem,
    renderInputSearch,
    onFocus,
    onBlur,
    autoScroll = true,
    showsVerticalScrollIndicator = true,
    dropdownPosition = 'auto',
    flatListProps,
    searchQuery,
    statusBarIsTranslucent,
    backgroundColor
  } = props;
  const ref = useRef(null);
  const refList = useRef(null);
  const [visible, setVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState(null);
  const [listData, setListData] = useState(data);
  const [position, setPosition] = useState();
  const [focus, setFocus] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const {
    width: W,
    height: H
  } = Dimensions.get('window');
  const styleContainerVertical = useMemo(() => {
    return {
      backgroundColor: 'rgba(0,0,0,0.1)',
      alignItems: 'center'
    };
  }, []);
  const styleHorizontal = useMemo(() => {
    return {
      marginBottom: 20,
      width: W / 2,
      alignSelf: 'center'
    };
  }, [W]);
  useImperativeHandle(currentRef, () => {
    return {
      open: eventOpen,
      close: eventClose
    };
  });
  useEffect(() => {
    setListData([...data]);
  }, [data]);

  const eventOpen = () => {
    if (!disable) {
      setVisible(true);

      if (onFocus) {
        onFocus();
      }
    }
  };

  const eventClose = useCallback(() => {
    if (!disable) {
      setVisible(false);

      if (onBlur) {
        onBlur();
      }
    }
  }, [disable, onBlur]);
  const font = useCallback(() => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily
      };
    } else {
      return {};
    }
  }, [fontFamily]);

  const _measure = useCallback(() => {
    if (ref && ref !== null && ref !== void 0 && ref.current) {
      ref.current.measure((_width, _height, px, py, fx, fy) => {
        const isFull = orientation === 'LANDSCAPE' && !isTablet;
        const w = Math.floor(px);
        const top = isFull ? 20 : Math.floor(py) + Math.floor(fy) + 2;
        const bottom = H - top;
        const left = I18nManager.isRTL ? W - Math.floor(px) - Math.floor(fx) : Math.floor(fx);
        setPosition({
          isFull,
          w,
          top,
          bottom: Math.floor(bottom),
          left,
          height: Math.floor(py)
        });
      });
    }
  }, [H, W, orientation]);

  const onKeyboardDidShow = useCallback(e => {
    _measure();

    setKeyboardHeight(e.endCoordinates.height);
  }, [_measure]);

  const onKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  useEffect(() => {
    const susbcriptionKeyboardDidShow = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const susbcriptionKeyboardDidHide = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      if (typeof (susbcriptionKeyboardDidShow === null || susbcriptionKeyboardDidShow === void 0 ? void 0 : susbcriptionKeyboardDidShow.remove) === 'function') {
        susbcriptionKeyboardDidShow.remove();
      } else {
        Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
      }

      if (typeof (susbcriptionKeyboardDidHide === null || susbcriptionKeyboardDidHide === void 0 ? void 0 : susbcriptionKeyboardDidHide.remove) === 'function') {
        susbcriptionKeyboardDidHide.remove();
      } else {
        Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
      }
    };
  }, [onKeyboardDidShow]);
  const getValue = useCallback(() => {
    const getItem = data.filter(e => _.isEqual(value, _.get(e, valueField)));

    if (getItem.length > 0) {
      setCurrentValue(getItem[0]);
    } else {
      setCurrentValue(null);
    }
  }, [data, value, valueField]);
  useEffect(() => {
    getValue();
  }, [value, data, getValue]);
  const scrollIndex = useCallback(() => {
    if (autoScroll && data.length > 0 && listData.length === data.length) {
      setTimeout(() => {
        if (refList && refList !== null && refList !== void 0 && refList.current) {
          const index = _.findIndex(listData, e => _.isEqual(value, _.get(e, valueField)));

          if (index > -1 && index <= listData.length - 1) {
            var _refList$current;

            refList === null || refList === void 0 ? void 0 : (_refList$current = refList.current) === null || _refList$current === void 0 ? void 0 : _refList$current.scrollToIndex({
              index: index,
              animated: false
            });
          }
        }
      }, 200);
    }
  }, [autoScroll, data.length, listData, value, valueField]);
  const showOrClose = useCallback(() => {
    if (!disable) {
      _measure();

      setVisible(!visible);
      setListData(data);

      if (!visible) {
        if (onFocus) {
          onFocus();
        }
      } else {
        if (onBlur) {
          onBlur();
        }
      }
    }

    scrollIndex();
  }, [_measure, data, disable, onBlur, onFocus, scrollIndex, visible]);
  const onSearch = useCallback(text => {
    if (text.length > 0) {
      const defaultFilterFunction = e => {
        var _$get;

        const item = (_$get = _.get(e, labelField)) === null || _$get === void 0 ? void 0 : _$get.toLowerCase().replace(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const key = text.toLowerCase().replace(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return item.indexOf(key) >= 0;
      };

      const propSearchFunction = e => {
        const labelText = _.get(e, labelField);

        return searchQuery === null || searchQuery === void 0 ? void 0 : searchQuery(text, labelText);
      };

      const dataSearch = data.filter(searchQuery ? propSearchFunction : defaultFilterFunction);
      setListData(dataSearch);
    } else {
      setListData(data);
    }
  }, [data, labelField, searchQuery]);
  const onSelect = useCallback(item => {
    onSearch('');
    setCurrentValue(item);
    onChange(item);
    eventClose();
  }, [eventClose, onChange, onSearch]);

  const _renderDropdown = () => {
    const isSelected = currentValue && _.get(currentValue, valueField);

    return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
      testID: testID,
      onPress: showOrClose
    }, /*#__PURE__*/React.createElement(View, {
      style: styles.dropdown
    }, renderLeftIcon === null || renderLeftIcon === void 0 ? void 0 : renderLeftIcon(), /*#__PURE__*/React.createElement(Text, _extends({
      style: [styles.textItem, isSelected !== null ? selectedTextStyle : placeholderStyle, font()]
    }, selectedTextProps), isSelected !== null ? _.get(currentValue, labelField) : placeholder), renderRightIcon ? renderRightIcon() : /*#__PURE__*/React.createElement(Image, {
      source: ic_down,
      style: [styles.icon, {
        tintColor: iconColor
      }, iconStyle]
    })));
  };

  const _renderItem = useCallback(_ref => {
    let {
      item,
      index
    } = _ref;

    const isSelected = currentValue && _.get(currentValue, valueField);

    const selected = _.isEqual(_.get(item, valueField), isSelected);

    return /*#__PURE__*/React.createElement(TouchableOpacity, {
      testID: _.get(item, itemTestIDField || labelField),
      key: index,
      onPress: () => onSelect(item),
      style: [selected && {
        backgroundColor: activeColor
      }]
    }, renderItem ? renderItem(item, selected) : /*#__PURE__*/React.createElement(View, {
      style: styles.item
    }, /*#__PURE__*/React.createElement(Text, {
      style: [styles.textItem, font()]
    }, _.get(item, labelField))));
  }, [activeColor, currentValue, font, itemTestIDField, labelField, onSelect, renderItem, valueField]);

  const renderSearch = useCallback(() => {
    if (search) {
      if (renderInputSearch) {
        return renderInputSearch(text => {
          onSearch(text);
        });
      } else {
        return /*#__PURE__*/React.createElement(CInput, {
          testID: testID + ' input',
          style: [styles.input, inputSearchStyle],
          inputStyle: [inputSearchStyle, font()],
          autoCorrect: false,
          keyboardType: isIOS ? 'default' : 'visible-password',
          placeholder: searchPlaceholder,
          onChangeText: onSearch,
          placeholderTextColor: "gray",
          iconStyle: [{
            tintColor: iconColor
          }, iconStyle],
          onFocus: () => setFocus(true),
          onBlur: () => {
            setFocus(false);
          }
        });
      }
    }

    return null;
  }, [font, iconColor, iconStyle, inputSearchStyle, onSearch, renderInputSearch, search, searchPlaceholder, testID]);

  const _renderListTop = useCallback(() => {
    return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, null, /*#__PURE__*/React.createElement(View, {
      style: styles.flexShrink
    }, /*#__PURE__*/React.createElement(FlatList, _extends({
      testID: testID + ' flatlist'
    }, flatListProps, {
      keyboardShouldPersistTaps: "handled",
      ref: refList,
      onScrollToIndexFailed: scrollIndex,
      data: listData,
      inverted: true,
      renderItem: _renderItem,
      keyExtractor: (_item, index) => index.toString(),
      showsVerticalScrollIndicator: showsVerticalScrollIndicator
    })), renderSearch()));
  }, [_renderItem, flatListProps, listData, renderSearch, scrollIndex, showsVerticalScrollIndicator, testID]);

  const _renderListBottom = useCallback(() => {
    return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, null, /*#__PURE__*/React.createElement(View, {
      style: styles.flexShrink
    }, renderSearch(), /*#__PURE__*/React.createElement(FlatList, _extends({
      testID: testID + ' flatlist'
    }, flatListProps, {
      keyboardShouldPersistTaps: "handled",
      ref: refList,
      onScrollToIndexFailed: scrollIndex,
      data: listData,
      renderItem: _renderItem,
      keyExtractor: (_item, index) => index.toString(),
      showsVerticalScrollIndicator: showsVerticalScrollIndicator
    }))));
  }, [_renderItem, flatListProps, listData, renderSearch, scrollIndex, showsVerticalScrollIndicator, testID]);

  const _renderModal = useCallback(() => {
    if (visible && position) {
      const {
        isFull,
        w,
        top,
        bottom,
        left,
        height
      } = position;

      if (w && top && bottom) {
        const styleVertical = {
          left: left,
          maxHeight: maxHeight
        };
        const isTopPosition = dropdownPosition === 'auto' ? bottom < (isIOS ? 200 : search ? 310 : 300) : dropdownPosition === 'top' ? true : false;
        let topHeight = isTopPosition ? top - height : top;
        let keyboardStyle = {};

        if (keyboardAvoiding) {
          if (renderInputSearch) {
            if (keyboardHeight > 0 && bottom < keyboardHeight + height) {
              if (isTopPosition) {
                topHeight = H - keyboardHeight;
              } else {
                keyboardStyle = {
                  backgroundColor: 'rgba(0,0,0,0.1)'
                };
                topHeight = H - keyboardHeight - 55;
              }
            }
          } else {
            if (focus && keyboardHeight > 0 && bottom < keyboardHeight + height) {
              if (isTopPosition) {
                topHeight = H - keyboardHeight;
              } else {
                keyboardStyle = {
                  backgroundColor: 'rgba(0,0,0,0.1)'
                };
                topHeight = H - keyboardHeight - 55;
              }
            }
          }
        }

        return /*#__PURE__*/React.createElement(Modal, {
          transparent: true,
          statusBarTranslucent: statusBarIsTranslucent,
          visible: visible,
          supportedOrientations: ['landscape', 'portrait'],
          onRequestClose: showOrClose
        }, /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
          onPress: showOrClose
        }, /*#__PURE__*/React.createElement(View, {
          style: [styles.flex1, isFull && styleContainerVertical, backgroundColor && {
            backgroundColor: backgroundColor
          }, keyboardStyle]
        }, /*#__PURE__*/React.createElement(View, {
          style: [styles.wrapTop, {
            height: topHeight,
            width: w
          }]
        }, isTopPosition && /*#__PURE__*/React.createElement(View, {
          style: [{
            width: w
          }, styles.container, containerStyle, isFull ? styleHorizontal : styleVertical]
        }, _renderListTop())), /*#__PURE__*/React.createElement(View, {
          style: styles.flex1
        }, !isTopPosition && /*#__PURE__*/React.createElement(View, {
          style: [{
            width: w
          }, styles.container, containerStyle, isFull ? styleHorizontal : styleVertical]
        }, _renderListBottom())))));
      }

      return null;
    }

    return null;
  }, [visible, position, maxHeight, dropdownPosition, search, keyboardAvoiding, statusBarIsTranslucent, showOrClose, styleContainerVertical, backgroundColor, containerStyle, styleHorizontal, _renderListTop, _renderListBottom, renderInputSearch, keyboardHeight, H, focus]);

  return /*#__PURE__*/React.createElement(View, {
    style: [styles.mainWrap, style],
    ref: ref,
    onLayout: _measure
  }, _renderDropdown(), _renderModal());
});
DropdownComponent.defaultProps = defaultProps;
export default DropdownComponent;
//# sourceMappingURL=index.js.map