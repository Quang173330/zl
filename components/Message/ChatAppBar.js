import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as colors from '../../constants/colors';
import { Zocial } from '@expo/vector-icons'; 

function ChatAppBar({navigation, user,socket}) {
  return (
    <View style={styles.container}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[colors.BLUE_A400, colors.LIGHT_BLUE_A400]}
        style={styles.bar}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            socket.disconnect()
            navigation.goBack()
          }}>
          <Ionicons name="arrow-back-outline" size={24} color={colors.WHITE} />
        </TouchableOpacity>
        <Text style={styles.text}>{user}</Text>
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
  text: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatAppBar;
