import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {
  ColorSchemeName,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from '../theme/index';
import {get, save} from '../local-storage/storage';

const HomeScreen = () => {
  const [themeValue, setThemeValue] = useState<ColorSchemeName>('light');
  //   const [initialValue, setInitialValue] = useState(0);
  const [selectedId, setSelectedId] = useState<string | undefined>('light');
  const themes = useColorScheme();
  //   const data = [
  //     {
  //       label: 'Light Mode',
  //       value: 'light',
  //     },
  //     {
  //       label: 'Dark Mode',
  //       value: 'dark',
  //     },
  //     {
  //       label: 'System Default',
  //       value: 'default',
  //     },
  //   ];

  const data: RadioButtonProps[] = useMemo(
    () => [
      {
        id: 'light', // acts as primary key, should be unique and non-empty string
        label: 'Light Mode',
        value: 'light',
      },
      {
        id: 'dark',
        label: 'Dark Mode',
        value: 'dark',
      },
      {
        id: 'default',
        label: 'System Default',
        value: 'default',
      },
    ],
    [],
  );

  const themeOperations = (theme: string | ColorSchemeName) => {
    switch (theme) {
      case 'dark':
        setTheme(theme, false);
        setSelectedId(theme);
        return;
      case 'light':
        setTheme(theme, false);
        setSelectedId(theme);
        return;
      case 'default':
        setTheme(themes, true);
        setSelectedId(theme);
        return;
    }
  };

  const getAppTheme = useCallback(async () => {
    const theme = await get('Theme');
    const isDefault = await get('IsDefault');
    isDefault ? themeOperations('default') : themeOperations(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback(
    async (theme: ColorSchemeName, isDefault: boolean) => {
      save('Theme', theme);
      save('IsDefault', isDefault);
      setThemeValue(theme);
    },
    [],
  );

  useEffect(() => {
    getAppTheme();
  }, [getAppTheme]);

  const styles = styling(themeValue);

  const currentTheme = getTheme(themeValue);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>
        This is demo of default dark/light theme with switch/Buttons using asycn
        storage.
      </Text>
      <TextInput
        style={styles.textInputStyle}
        placeholder="Type here"
        placeholderTextColor={Colors[currentTheme]?.gray}
      />
      <TouchableOpacity style={styles.touchableStyle}>
        <Text style={styles.buttonTextStyle}>Button</Text>
      </TouchableOpacity>
      <RadioGroup
        radioButtons={data}
        onPress={selected => themeOperations(selected)}
        selectedId={selectedId}
      />
      {/* <RadioButtonRN
        data={data}
        selectedBtn={e => themeOperations(e?.value)}
        initial={initialValue}
        activeColor={Colors[currentTheme]?.activeColor}
        deactiveColor={Colors[currentTheme]?.deactiveColor}
        boxActiveBgColor={Colors[currentTheme]?.boxActiveColor}
        boxDeactiveBgColor={Colors[currentTheme]?.themeColor}
        textColor={Colors[currentTheme]?.white}
      /> */}
    </View>
  );
};

export default HomeScreen;

const getTheme = (theme: ColorSchemeName) => {
  return theme != 'dark' && theme != 'light' ? 'light' : theme;
};

const styling = (theme: ColorSchemeName) => {
  const currenTheme = getTheme(theme);
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: Colors[currenTheme].themeColor,
      paddingHorizontal: 20,
    },
    textStyle: {
      color: Colors[currenTheme]?.white,
    },
    textInputStyle: {
      borderColor: Colors[currenTheme]?.gray,
      padding: 10,
      borderWidth: 2,
      borderRadius: 5,
      width: '100%',
      marginTop: 20,
      color: Colors[currenTheme]?.white,
    },
    touchableStyle: {
      backgroundColor: Colors[currenTheme]?.sky,
      padding: 10,
      borderRadius: 6,
      width: '100%',
      height: 57,
      justifyContent: 'center',
      marginTop: 20,
    },
    buttonTextStyle: {
      textAlign: 'center',
      color: Colors[currenTheme]?.commonWhite,
      fontSize: 20,
      fontWeight: '500',
    },
  });
};
