"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _TextInput = _interopRequireDefault(require("../TextInput"));

var _useDeviceOrientation = require("../../useDeviceOrientation");

var _toolkits = require("../../toolkits");

var _styles = require("./styles");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const {
  isTablet,
  isIOS
} = _toolkits.useDetectDevice;

const ic_down = require('../../assets/down.png');

const defaultProps = {
  placeholder: 'Select item',
  activeColor: '#F6F7F8',
  data: [],
  style: {},
  selectedTextProps: {}
};

const DropdownComponent = /*#__PURE__*/_react.default.forwardRef((props, currentRef) => {
  const orientation = (0, _useDeviceOrientation.useDeviceOrientation)();
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
  const ref = (0, _react.useRef)(null);
  const refList = (0, _react.useRef)(null);
  const [visible, setVisible] = (0, _react.useState)(false);
  const [currentValue, setCurrentValue] = (0, _react.useState)(null);
  const [listData, setListData] = (0, _react.useState)(data);
  const [position, setPosition] = (0, _react.useState)();
  const [focus, setFocus] = (0, _react.useState)(false);
  const [keyboardHeight, setKeyboardHeight] = (0, _react.useState)(0);

  const {
    width: W,
    height: H
  } = _reactNative.Dimensions.get('window');

  const styleContainerVertical = (0, _react.useMemo)(() => {
    return {
      backgroundColor: 'rgba(0,0,0,0.1)',
      alignItems: 'center'
    };
  }, []);
  const styleHorizontal = (0, _react.useMemo)(() => {
    return {
      marginBottom: 20,
      width: W / 2,
      alignSelf: 'center'
    };
  }, [W]);
  (0, _react.useImperativeHandle)(currentRef, () => {
    return {
      open: eventOpen,
      close: eventClose
    };
  });
  (0, _react.useEffect)(() => {
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

  const eventClose = (0, _react.useCallback)(() => {
    if (!disable) {
      setVisible(false);

      if (onBlur) {
        onBlur();
      }
    }
  }, [disable, onBlur]);
  const font = (0, _react.useCallback)(() => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily
      };
    } else {
      return {};
    }
  }, [fontFamily]);

  const _measure = (0, _react.useCallback)(() => {
    if (ref && ref !== null && ref !== void 0 && ref.current) {
      ref.current.measure((_width, _height, px, py, fx, fy) => {
        const isFull = orientation === 'LANDSCAPE' && !isTablet;
        const w = Math.floor(px);
        const top = isFull ? 20 : Math.floor(py) + Math.floor(fy) + 2;
        const bottom = H - top;
        const left = _reactNative.I18nManager.isRTL ? W - Math.floor(px) - Math.floor(fx) : Math.floor(fx);
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

  const onKeyboardDidShow = (0, _react.useCallback)(e => {
    _measure();

    setKeyboardHeight(e.endCoordinates.height);
  }, [_measure]);

  const onKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  (0, _react.useEffect)(() => {
    const susbcriptionKeyboardDidShow = _reactNative.Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);

    const susbcriptionKeyboardDidHide = _reactNative.Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

    return () => {
      if (typeof (susbcriptionKeyboardDidShow === null || susbcriptionKeyboardDidShow === void 0 ? void 0 : susbcriptionKeyboardDidShow.remove) === 'function') {
        susbcriptionKeyboardDidShow.remove();
      } else {
        _reactNative.Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
      }

      if (typeof (susbcriptionKeyboardDidHide === null || susbcriptionKeyboardDidHide === void 0 ? void 0 : susbcriptionKeyboardDidHide.remove) === 'function') {
        susbcriptionKeyboardDidHide.remove();
      } else {
        _reactNative.Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
      }
    };
  }, [onKeyboardDidShow]);
  const getValue = (0, _react.useCallback)(() => {
    const getItem = data.filter(e => _lodash.default.isEqual(value, _lodash.default.get(e, valueField)));

    if (getItem.length > 0) {
      setCurrentValue(getItem[0]);
    } else {
      setCurrentValue(null);
    }
  }, [data, value, valueField]);
  (0, _react.useEffect)(() => {
    getValue();
  }, [value, data, getValue]);
  const scrollIndex = (0, _react.useCallback)(() => {
    if (autoScroll && data.length > 0 && listData.length === data.length) {
      setTimeout(() => {
        if (refList && refList !== null && refList !== void 0 && refList.current) {
          const index = _lodash.default.findIndex(listData, e => _lodash.default.isEqual(value, _lodash.default.get(e, valueField)));

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
  const showOrClose = (0, _react.useCallback)(() => {
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
  const onSearch = (0, _react.useCallback)(text => {
    if (text.length > 0) {
      const defaultFilterFunction = e => {
        var _$get;

        const item = (_$get = _lodash.default.get(e, labelField)) === null || _$get === void 0 ? void 0 : _$get.toLowerCase().replace(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const key = text.toLowerCase().replace(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return item.indexOf(key) >= 0;
      };

      const propSearchFunction = e => {
        const labelText = _lodash.default.get(e, labelField);

        return searchQuery === null || searchQuery === void 0 ? void 0 : searchQuery(text, labelText);
      };

      const dataSearch = data.filter(searchQuery ? propSearchFunction : defaultFilterFunction);
      setListData(dataSearch);
    } else {
      setListData(data);
    }
  }, [data, labelField, searchQuery]);
  const onSelect = (0, _react.useCallback)(item => {
    onSearch('');
    setCurrentValue(item);
    onChange(item);
    eventClose();
  }, [eventClose, onChange, onSearch]);

  const _renderDropdown = () => {
    const isSelected = currentValue && _lodash.default.get(currentValue, valueField);

    return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, {
      testID: testID,
      onPress: showOrClose
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _styles.styles.dropdown
    }, renderLeftIcon === null || renderLeftIcon === void 0 ? void 0 : renderLeftIcon(), /*#__PURE__*/_react.default.createElement(_reactNative.Text, _extends({
      style: [_styles.styles.textItem, isSelected !== null ? selectedTextStyle : placeholderStyle, font()]
    }, selectedTextProps), isSelected !== null ? _lodash.default.get(currentValue, labelField) : placeholder), renderRightIcon ? renderRightIcon() : /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
      source: ic_down,
      style: [_styles.styles.icon, {
        tintColor: iconColor
      }, iconStyle]
    })));
  };

  const _renderItem = (0, _react.useCallback)(_ref => {
    let {
      item,
      index
    } = _ref;

    const isSelected = currentValue && _lodash.default.get(currentValue, valueField);

    const selected = _lodash.default.isEqual(_lodash.default.get(item, valueField), isSelected);

    return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
      testID: _lodash.default.get(item, itemTestIDField || labelField),
      key: index,
      onPress: () => onSelect(item),
      style: [selected && {
        backgroundColor: activeColor
      }]
    }, renderItem ? renderItem(item, selected) : /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _styles.styles.item
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: [_styles.styles.textItem, font()]
    }, _lodash.default.get(item, labelField))));
  }, [activeColor, currentValue, font, itemTestIDField, labelField, onSelect, renderItem, valueField]);

  const renderSearch = (0, _react.useCallback)(() => {
    if (search) {
      if (renderInputSearch) {
        return renderInputSearch(text => {
          onSearch(text);
        });
      } else {
        return /*#__PURE__*/_react.default.createElement(_TextInput.default, {
          testID: testID + ' input',
          style: [_styles.styles.input, inputSearchStyle],
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

  const _renderListTop = (0, _react.useCallback)(() => {
    return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, null, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _styles.styles.flexShrink
    }, /*#__PURE__*/_react.default.createElement(_reactNative.FlatList, _extends({
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

  const _renderListBottom = (0, _react.useCallback)(() => {
    return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, null, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _styles.styles.flexShrink
    }, renderSearch(), /*#__PURE__*/_react.default.createElement(_reactNative.FlatList, _extends({
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

  const _renderModal = (0, _react.useCallback)(() => {
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

        return /*#__PURE__*/_react.default.createElement(_reactNative.Modal, {
          transparent: true,
          statusBarTranslucent: statusBarIsTranslucent,
          visible: visible,
          supportedOrientations: ['landscape', 'portrait'],
          onRequestClose: showOrClose
        }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, {
          onPress: showOrClose
        }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
          style: [_styles.styles.flex1, isFull && styleContainerVertical, backgroundColor && {
            backgroundColor: backgroundColor
          }, keyboardStyle]
        }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
          style: [_styles.styles.wrapTop, {
            height: topHeight,
            width: w
          }]
        }, isTopPosition && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
          style: [{
            width: w
          }, _styles.styles.container, containerStyle, isFull ? styleHorizontal : styleVertical]
        }, _renderListTop())), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
          style: _styles.styles.flex1
        }, !isTopPosition && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
          style: [{
            width: w
          }, _styles.styles.container, containerStyle, isFull ? styleHorizontal : styleVertical]
        }, _renderListBottom())))));
      }

      return null;
    }

    return null;
  }, [visible, position, maxHeight, dropdownPosition, search, keyboardAvoiding, statusBarIsTranslucent, showOrClose, styleContainerVertical, backgroundColor, containerStyle, styleHorizontal, _renderListTop, _renderListBottom, renderInputSearch, keyboardHeight, H, focus]);

  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [_styles.styles.mainWrap, style],
    ref: ref,
    onLayout: _measure
  }, _renderDropdown(), _renderModal());
});

DropdownComponent.defaultProps = defaultProps;
var _default = DropdownComponent;
exports.default = _default;
//# sourceMappingURL=index.js.map