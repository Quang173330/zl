/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { windowHeight, windowWidth } from '../constants/dimensions';
import timeAgo from '../utils/timeAgo';
import * as colors from '../constants/colors';
import { URI } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileAppBar from '../components/More/ProfileAppBar';

function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  useEffect(async () => {
    const token = await AsyncStorage.getItem('token');
    setToken(token)
    const userResponse = await fetch(URI + 'users/show', {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Bearer " + token,

      },
    });
    const userResult = await userResponse.json();
    setUser(userResult.data)
    console.log(user)
  }, []);

  return (
    <View style={styles.container}>
      <ProfileAppBar navigation={navigation} />
      <TouchableOpacity
        style={styles.user}
        onPress={() => navigation.navigate('MyProfileScreen')}
      >
        <View style={styles.conversationContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/200' }}
            style={styles.imageAvatar}
          />
          <View style={styles.divide}>
            <View style={styles.messageContainer}>
              <Text style={styles.text2}>{user?.username}</Text>
              <Text style={styles.text3} numberOfLines={1}>
                Xem trang cá nhân
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button1}
          >
            <Ionicons name="repeat-outline" size={24} color={colors.BLUE_500} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.user}>
        <View style={styles.listSettings}>
          <TouchableOpacity
            style={styles.button1}
          >
            <Ionicons name="qr-code-outline" size={18} color={colors.BLUE_500} />
          </TouchableOpacity>
          <View style={styles.divide}>
            <View style={styles.messageContainer}>
              <Text style={styles.text5}>Ví QR</Text>
              <Text style={styles.text3} numberOfLines={1}>
                Lưu trữ và xuất trình các mã QR quan trọng
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.listSettings}>
          <TouchableOpacity
            style={styles.button1}
          >
            <Ionicons name="cloudy-outline" size={18} color={colors.BLUE_500} />
          </TouchableOpacity>
          <View style={styles.divide}>
            <View style={styles.messageContainer}>
              <Text style={styles.text5}>Cloud của tôi</Text>
              <Text style={styles.text3} numberOfLines={1}>
                Lưu trữ các tin nhắn quan trọng
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.listSetting1}>
          <TouchableOpacity
            style={styles.button1}
          >
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.BLUE_500} />
          </TouchableOpacity>
          <View style={styles.divide}>
            <View style={styles.messageContainer}>
              <Text style={styles.text5}>Tài khoản bảo mật</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.listSetting1}>
          <TouchableOpacity
            style={styles.button1}
          >
            <Ionicons name="lock-closed-outline" size={18} color={colors.BLUE_500} />
          </TouchableOpacity>
          <View style={styles.divide}>
            <View style={styles.messageContainer}>
              <Text style={styles.text5}>Quyền riêng tư</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  listSetting1: {
    marginTop: 10,
    height: 70,
    flexDirection: 'row',
    backgroundColor: colors.WHITE
  },
  listSettings: {
    marginTop: 10,
    height: 70,
    flexDirection: 'row',
    backgroundColor: colors.WHITE
  },
  conversationContainer: {
    height: 90,
    flexDirection: 'row',
    backgroundColor: colors.WHITE
  },

  container: {
    backgroundColor: colors.GREY_300,
    flex: 1,
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    flex: 1,
    justifyContent: 'center',
  },
  modalView: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
  },
  changeAvatar: {
    height: windowWidth * (284 / 1080),
    width: windowWidth * (750 / 1080),
  },
  text1Modal: {
    alignSelf: 'flex-start',
    color: colors.GREY_900,
    fontSize: 18,
    fontWeight: 'bold',
    margin: 15,
  },
  modalLine: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    paddingVertical: 8,
  },
  modalIcon: {
    marginHorizontal: 15,
  },
  text2Modal: {
    color: colors.GREY_900,
    fontSize: 18,
  },
  cancelModal: {
    alignSelf: 'flex-end',
    margin: 15,
  },
  backgroundImageContainer: {
    backgroundColor: colors.GREY_300,
  },
  backgroundImage: {
    height: windowHeight / 4,
    width: windowWidth,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -windowWidth / 6,
  },
  imageAvatar: {
    marginTop: 22,
    borderRadius: 20,
    height: 40,
    margin: 15,
    width: 40,
  },
  textAvatar: {
    alignItems: 'center',
    backgroundColor: colors.LIGHT_BLUE_A400,
    borderRadius: 20,
    justifyContent: 'center',
    height: 40,
    margin: 15,
    width: 40,
  },
  text1: {
    color: colors.WHITE,
    fontSize: 60,
    fontWeight: 'bold',
  },
  text5: {
    color: colors.GREY_900,
    fontSize: 16,
  },
  text2: {
    color: colors.GREY_900,
    fontSize: 20,
  },
  text3: {
    color: colors.BLUE_GREY_400,
    fontSize: 12,
  },
  text4: {
    color: colors.BLUE_GREY_400,
    fontSize: 12,
    marginRight: 15,
  },
  postDiary: {
    backgroundColor: colors.WHITE,
    marginLeft: 20,
    marginRight: 20,
    marginVertical: 15,
    padding: 10,
  },
  textPostDiary: {
    color: colors.BLUE_GREY_300,
    fontSize: 16,
  },
  diaryContainer: {
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  diaryTime: {
    alignSelf: 'flex-start',
    backgroundColor: colors.BLUE_GREY_100,
    borderRadius: 5,
    color: colors.GREY_900,
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 1,
  },
  diary: {
    backgroundColor: colors.WHITE,
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    marginTop: 10,
  },
  actionsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 15,
  },
  action: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 25,
  },
  textAction: {
    color: colors.GREY_900,
    fontSize: 18,
    marginLeft: 5,
  },
  imageProfile: {
    height: (windowWidth / 1080) * 402,
    width: windowWidth,
  },
  text4: {
    color: colors.BLUE_GREY_400,
    fontSize: 14,
    marginHorizontal: 50,
    marginTop: 10,
    textAlign: 'center',
  },
  messageContainer: {
    flex: 1,
  },
  divide: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 25,
  },
  button1: {
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
});

export default ProfileScreen;
