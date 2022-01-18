import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as colors from '../constants/colors';
import { windowWidth } from '../constants/dimensions';
import timeAgo from '../utils/timeAgo';
import CommentAppBar from '../components/Diary/CommentAppBar';
import { URI } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CommentScreen({ navigation, route }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [post, setPost] = useState(null);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    const handleLike = () => {

    };

    useEffect(async () => {
        const user = await AsyncStorage.getItem('user');
        setUser(JSON.parse(user));

        const token = await AsyncStorage.getItem('token');
        setToken(token);
        const postId = route.params.postId
        console.log(postId)
        console.log('a')
        const response = await fetch(URI + 'posts/show/' + postId, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + token,

            },
        });
        console.log(response);
        const res = await response.json();
        setPost(res.data)

        const responseComments = await fetch(URI + 'postComment/list/' + postId, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + token,

            },
        });
        const resComments = await responseComments.json();
        setComments(resComments.data)
        console.log('aaaa')
        console.log(resComments)
    }, []);

    const handleComment = async () => {
        const postId = route.params.postId
        const response = await fetch(URI + 'postComment/create/' + postId, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                content: comment
            }),
        });
        const json = await response.json();
        comments.push(json.data)
        setComments(comments);
        setComment('');
        console.log(json);
    };

    const renderItem = ({ item, key }) => {
        return (
            <View style={styles.commentContainer}>
                {item.user.avatar != null ? (
                    <TouchableOpacity
                        // onPress={() => {
                        //     if (item.user._id === user._id) {
                        //         navigation.navigate('MyProfileScreen');
                        //     } else {
                        //         navigation.navigate('OtherProfileScreen', { other: item.user });
                        //     }
                        // }}
                    >
                        <Image
                            source={{ uri: 'https://picsum.photos/200' }}
                            style={styles.imageAvatar}
                        />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        // onPress={() => {
                        //     if (item.user.id === user.uid) {
                        //         navigation.navigate('MyProfileScreen');
                        //     } else {
                        //         navigation.navigate('OtherProfileScreen', { other: item.user });
                        //     }
                        // }}
                        >
                        <Image
                            source={{ uri: 'https://picsum.photos/200' }}
                            style={styles.imageAvatar}
                        />
                    </TouchableOpacity>
                )}
                <View style={styles.commentContent}>
                    <Text style={styles.text2}>{item.user.username}</Text>
                    <Text style={styles.text3}>{item.content}</Text>
                    <Text style={styles.text4}>{timeAgo(new Date(item.createdAt))}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <CommentAppBar navigation={navigation} />
            <FlatList
                ListEmptyComponent={
                    <Image
                        source={require('../assets/images/comment.jpg')}
                        style={styles.imageComment}
                    />
                }
                ListHeaderComponent={
                    <View style={styles.heartContainer}>
                        <TouchableOpacity style={styles.buttonLike} onPress={handleLike}>
                            <Ionicons
                                name={post?.isLike ? 'heart' : 'heart-outline'}
                                size={28}
                                color={post?.isLike ? colors.RED_600 : colors.GREY_600}
                            />
                            <Text style={styles.text5}>{post?.like.length}</Text>
                        </TouchableOpacity>
                    </View>
                }
                data={comments}
                renderItem={renderItem}
                // keyExtractor={(_, index) => index.toString()}
            />
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.icon}>
                    <Ionicons name="happy-outline" size={28} color={colors.GREY_600} />
                </TouchableOpacity>
                <TextInput
                    placeholder="Nhập bình luận"
                    style={styles.input}
                    value={comment}
                    onChangeText={text => setComment(text)}
                />
                <TouchableOpacity style={styles.icon}>
                    <Ionicons name="image-outline" size={28} color={colors.GREY_600} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.icon}
                    disabled={!comment}
                    onPress={handleComment}>
                    <Ionicons
                        name="send"
                        size={28}
                        color={comment ? colors.LIGHT_BLUE_A700 : colors.GREY_300}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
        flex: 1,
    },
    inputContainer: {
        alignItems: 'center',
        backgroundColor: colors.GREY_50,
        flexDirection: 'row',
        marginBottom:7
    },
    input: {
        color: colors.GREY_900,
        flex: 1,
        fontSize: 18,
    },
    icon: {
        marginHorizontal: 10,
    },
    commentContainer: {
        flexDirection: 'row',
        paddingTop: 15,
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
    commentContent: {
        flex: 1,
        borderBottomColor: colors.GREY_300,
        borderBottomWidth: 0.75,
        paddingRight: 15,
    },
    text2: {
        color: colors.GREY_900,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    text3: {
        color: colors.GREY_900,
        fontSize: 16,
        marginBottom: 2,
    },
    text4: {
        color: colors.BLUE_GREY_400,
        fontSize: 14,
        marginBottom: 15,
    },
    heartContainer: {
        borderBottomColor: colors.GREY_300,
        borderBottomWidth: 0.75,
        padding: 15,
    },
    buttonLike: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    text5: {
        color: colors.GREY_900,
        fontSize: 18,
        marginLeft: 5,
    },
    imageComment: {
        height: (windowWidth / 945) * 268,
        width: windowWidth,
    },
});

export default CommentScreen;
