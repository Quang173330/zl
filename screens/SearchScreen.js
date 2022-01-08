import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as colors from '../constants/colors';
import SearchAppBar from './SearchAppBar';

function SearchScreen({ navigation }) {

    const handleBack = () => {
        // dispatch(searchRequest({keyword: ''}));
        navigation.goBack();
    };

    //   const renderItem = ({item}) => (
    //     <View style={styles.userCard}>
    //       {item.avatar ? (
    //         <TouchableOpacity
    //           onPress={() =>
    //             navigation.navigate('OtherProfileScreen', {other: item})
    //           }>
    //           <Image source={{uri: item.avatar}} style={styles.imageAvatar} />
    //         </TouchableOpacity>
    //       ) : (
    //         <TouchableOpacity
    //           onPress={() =>
    //             navigation.navigate('OtherProfileScreen', {other: item})
    //           }>
    //           <View style={styles.textAvatar}>
    //             <Text style={styles.text1}>{item.name[0]}</Text>
    //           </View>
    //         </TouchableOpacity>
    //       )}
    //       <Text style={styles.text2}>{item.name}</Text>
    //       <TouchableOpacity
    //         style={styles.icon}
    //         onPress={() => navigation.navigate('ChatScreen', {user: item})}>
    //         <Ionicons
    //           name="chatbubbles-outline"
    //           size={24}
    //           color={colors.BLUE_GREY_400}
    //         />
    //       </TouchableOpacity>
    //     </View>
    //   );

    return (
        <View style={styles.container}>

            <SearchAppBar onBack={handleBack} />
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