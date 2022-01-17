import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as colors from '../../constants/colors';

function PhoneAppBar({navigation}) {
  return (
    <View style={styles.container}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[colors.BLUE_A400, colors.LIGHT_BLUE_A400]}
        style={styles.bar}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => navigation.navigate('SearchScreen')}
        >
          <Ionicons name="search-outline" size={24} color={colors.WHITE} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => navigation.navigate('SearchScreen')}
        >
          <Text style={styles.text}>Tìm bạn bè,...</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="person-add-outline" size={24} color={colors.WHITE} />
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
    paddingVertical: 12,
  },
  icon: {
    marginHorizontal: 10,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: colors.BLUE_200,
  },
});

export default PhoneAppBar;
