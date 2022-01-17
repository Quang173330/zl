import React, {useRef, useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as colors from '../../constants/colors';

function SearchAppBar({onSearch, onBack}) {
  const [keyword, setKeyword] = useState('');
  const typingTimeoutRef = useRef(null);

  const handleKeywordChange = text => {
    setKeyword(text);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onSearch(text);
    }, 600);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[colors.BLUE_A400, colors.LIGHT_BLUE_A400]}
        style={styles.bar}>
        <TouchableOpacity style={styles.icon} onPress={onBack}>
          <Ionicons name="arrow-back-outline" size={24} color={colors.WHITE} />
        </TouchableOpacity>
        <TextInput
          placeholder="Tìm kiếm"
          autoFocus={true}
          returnKeyType="search"
          style={styles.textInput}
          placeholderTextColor={colors.WHITE}
          value={keyword}
          onChangeText={handleKeywordChange}
        />
        {keyword !== '' && (
          <TouchableOpacity style={styles.icon} onPress={() => setKeyword('')}>
            <Ionicons name="close-outline" size={24} color={colors.WHITE} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="qr-code-outline" size={24} color={colors.WHITE} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    elevation: 5,
  },
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 10,
  },
  textInput: {
    color: colors.WHITE,
    flex: 1,
    fontSize: 16,
  },
});

export default SearchAppBar;
