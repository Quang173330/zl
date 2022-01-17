import React, { useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as colors from '../constants/colors';
import SearchAppBar from '../components/More/SearchAppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URI } from '../constants/config';

function SearchScreen({ navigation }) {
    const [users, setUsers] = useState([]);


    const handleSearch = async text => {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(URI + 'users/search', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                keyword: text
            })
        });
        const res = await response.json()
        console.log(res)
        setUsers(res.data)
        console.log(res.data)
    };

    const handleBack = () => {
        // dispatch(searchRequest({keyword: ''}));
        navigation.goBack();
    };

    const renderItem = ({ item }) => {
        const openChat = async () => {
            const token = await AsyncStorage.getItem('token');
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
            <View style={styles.userCard}>
                {item.avatar ? (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('OtherProfileScreen', { other: item })
                        }
                    >
                        <Image source={{ uri: item.avatar }} style={styles.imageAvatar} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('OtherProfileScreen', { other: item })
                        }
                    >
                        <View style={styles.textAvatar}>
                            <Text style={styles.text1}>{item.username}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                <Text style={styles.text2}>{item.username}</Text>
                <TouchableOpacity
                    style={styles.icon}
                    onPress={openChat}
                >
                    <Ionicons
                        name="chatbubbles-outline"
                        size={24}
                        color={colors.BLUE_GREY_400}
                    />
                </TouchableOpacity>
            </View>
        )
    };

    return (
        <View style={styles.container}>
            <SearchAppBar onSearch={handleSearch} onBack={handleBack} />
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={item => item._id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
        flex: 1,
    },
    userCard: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 15,
    },
    imageAvatar: {
        borderRadius: 20,
        height: 40,
        marginHorizontal: 15,
        width: 40,
    },
    textAvatar: {
        alignItems: 'center',
        backgroundColor: colors.LIGHT_BLUE_A400,
        borderRadius: 20,
        justifyContent: 'center',
        height: 40,
        marginHorizontal: 15,
        width: 40,
    },
    text1: {
        color: colors.WHITE,
        fontSize: 18,
        fontWeight: 'bold',
    },
    text2: {
        color: colors.GREY_900,
        flex: 1,
        fontSize: 16,
    },
    icon: {
        marginRight: 15,
    },
});

export default SearchScreen;
