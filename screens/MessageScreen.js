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
import MessageAppBar from '../components/Message/MessageAppBar';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URI } from '../constants/config';

function MessageScreen({ navigation }) {

  const [conversations, setConversations] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(async () => {
    const user = await AsyncStorage.getItem('user');
    setUser(JSON.parse(user));

    const token = await AsyncStorage.getItem('token');
    setToken(token)
    const response = await fetch(URI + 'chats/getListChats', {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
        },
    });
    const res = await response.json();
    setConversations(res.data);
    console.log(res.data)
    console.log(conversations);
  }, []);

  const renderItem = ({ item }) => {
    // const partner =
    //   user.uid === item.lastSender.id ? item.lastReceiver : item.lastSender;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ChatScreen', { chatId: item.id, username: item.username })}
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
              <Text style={styles.text3} numberOfLines={1}>
                {item.lastContent}
              </Text>
            </View>
            <Text style={styles.text4}>{timeAgo(new Date(item.time))}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <MessageAppBar navigation={navigation} />
      <View style={styles.conversationsContainer}>
        <FlatList
          data={conversations}
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
    flex: 1,
  },
  text2: {
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
    borderBottomColor: colors.GREY_300,
    borderBottomWidth: 0.75,
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 15,
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
  textButton: {
    color: colors.WHITE,
    fontSize: 14,
  },
});

export default MessageScreen;
