import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import timeAgo from '../utils/timeAgo';
import * as colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import MessageAppBar from '../components/Message/MessageAppBar';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URI } from '../constants/config';
import PhoneAppBar from '../components/More/PhoneAppBar';

function PhoneScreen({ navigation }) {

  const [listFriends, setListFriends] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(async () => {
    const user = await AsyncStorage.getItem('user');
    setUser(JSON.parse(user));

    const token = await AsyncStorage.getItem('token');

    setToken(token)
    console.log(token)
    const response = await fetch(URI + 'friends/list', {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
    });
    const res = await response.json();
    setListFriends(res.data.friends);
  }, []); 

  const renderItem = ({ item }) => {
    // const partner =
    //   user.uid === item.lastSender.id ? item.lastReceiver : item.lastSender;
    const openChat = async () => {
      const response = await fetch(URI + 'chats/getChatId', {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          partnerId: item._id
        })
      });
      const res = await response.json();
      console.log(res)
      const chatId = res.data._id;
      navigation.navigate('ChatScreen', { chatId: chatId, username: item.username })
    }
    return (
      <TouchableOpacity
        onPress={openChat}
      >
        <View style={styles.conversationContainer}>
          {item.avatar == null ? (
            <Image source={{ uri: item.avatar }} style={styles.imageAvatar} />
          ) : (
            <View style={styles.textAvatar}>
              <Text style={styles.text1}>{item.username}</Text>
            </View>
          )}
          <View style={styles.divide}>
            <View style={styles.messageContainer}>
              <Text style={styles.text2}>{item.username}</Text>
            </View>
            <TouchableOpacity
              style={styles.button1}
            >
              <Ionicons name="call-outline" size={18} color={colors.GREY_400} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button1}
            >
              <Ionicons name="videocam-outline" size={18} color={colors.GREY_400} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <PhoneAppBar navigation={navigation} />
      <View style={styles.conversationsContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('FriendRequestScreen')}
        >
          <View style={styles.conversationContainer}>
            <TouchableOpacity
              style={styles.button1}
            >
              <Ionicons name="people-circle" size={55} color={colors.BLUE_500} />
            </TouchableOpacity>
            <View style={styles.divide}>
              <View style={styles.messageContainer}>
                <Text style={styles.text2}>Lời mời kết bạn</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
        >
          <View style={styles.conversationContainer}>
            <TouchableOpacity
              style={styles.button1}
            >
              <Ionicons name="call" size={50} color={colors.GREEN} />
            </TouchableOpacity>
            <View style={styles.divide}>
              <View style={styles.messageContainer}>
                <Text style={styles.text2}>Bạn từ danh bạ máy</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <FlatList
          data={listFriends}
          renderItem={renderItem}
          ListFooterComponent={
            <View style={styles.conversationsFooter}>
              <Text style={styles.textConversationsFooter}>
                Dễ dàng tìm kiếm và trò chuyện với bạn bè
              </Text>
              <TouchableOpacity
              // onPress={() => navigation.navigate('SearchScreen')}
              >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={[colors.LIGHT_BLUE_A700, colors.LIGHT_BLUE_A400]}
                  style={styles.button}>
                  <Text style={styles.textButton}>TÌM THÊM BẠN</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    flex: 1,
  },
  conversationsContainer: {
    flex: 1,
  },
  conversationContainer: {
    flexDirection: 'row',
  },
  imageAvatar: {
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  text2: {
    marginTop: 5,
    color: colors.GREY_900,
    fontSize: 16,
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
  divide: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  conversationsFooter: {
    alignItems: 'center',
  },
  textConversationsFooter: {
    color: colors.BLUE_GREY_400,
    fontSize: 14,
    marginVertical: 15,
  },
  button: {
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingVertical: 8,
  },
  button1: {
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  textButton: {
    color: colors.WHITE,
    fontSize: 14,
  },
});

export default PhoneScreen;
