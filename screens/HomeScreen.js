import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {windowHeight, windowWidth} from '../constants/dimensions';
import * as colors from '../constants/colors';

function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/carousel1.jpg')}
              style={styles.image}
            />
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/carousel2.jpg')}
              style={styles.image}
            />
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/carousel3.jpg')}
              style={styles.image}
            />
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/carousel4.jpg')}
              style={styles.image}
            />
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/carousel5.jpg')}
              style={styles.image}
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <View style={styles.btn1}>
            <Text style={styles.txt1}>ĐĂNG NHẬP</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUpScreen')}>
          <View style={styles.btn2}>
            <Text style={styles.txt2}>ĐĂNG KÝ</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 35,
    backgroundColor: colors.WHITE,
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    height: (windowHeight * 3) / 5,
    resizeMode: 'stretch',
    width: windowWidth,
  },
  bottomContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  btn1: {
    alignItems: 'center',
    backgroundColor: colors.LIGHT_BLUE_A400,
    borderRadius: 50,
    marginVertical: 8,
    paddingVertical: 15,
    width: (windowWidth * 2) / 3,
  },
  btn2: {
    alignItems: 'center',
    backgroundColor: colors.BLUE_GREY_50,
    borderRadius: 50,
    marginVertical: 8,
    paddingVertical: 15,
    width: (windowWidth * 2) / 3,
  },
  txt1: {
    color: colors.WHITE,
    fontWeight: 'bold',
  },
  txt2: {
    color: colors.GREY_900,
    fontWeight: 'bold',
  },
});

export default HomeScreen;