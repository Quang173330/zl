import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as colors from '../../constants/colors';

function MyProfileAppBar({ navigation, user }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" size={24} color={colors.GREY_800} />
            </TouchableOpacity>
            {user?.photoURL != null ? (
                <Image source={{ uri: user?.photoURL }} style={styles.imageAvatar} />
            ) : (
                <View style={styles.textAvatar}>
                    <Text style={styles.text1}>{user?.username}</Text>
                </View>
            )}
            <Text style={styles.text2}>{user?.username}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        elevation: 3,
        flexDirection: 'row',
        paddingVertical: 4,
    },
    back: {
        marginLeft: 15,
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
        fontSize: 18,
    },
});

export default MyProfileAppBar;
