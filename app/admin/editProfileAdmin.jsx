import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContext'
import { GetUserImageSrc, uploadFile } from '../../services/imageService'
import { Image } from 'expo-image'
import Icon from '../../assets/icons'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { updateUser } from '../../services/userService'
import { router, useLocalSearchParams, useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'

const EditProfileAdmin = () => {
  const { userId, userName, image, email, address, phoneNumber, bio } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState({
    name: '',
    phoneNumber: '',
    image: '',
    bio: '',
    address: '',
    email: '',

  });
  useEffect(() => {
    if (userId) {
      setUser({
        name: userName || '',
        phoneNumber: phoneNumber || '',
        image: image || null,
        address: address || '',
        bio: bio || '',
        email: email || '',
      });
    }
  }, [])
  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }
  }

  const onsubmit = async () => {
    let userData = { ...user };
    let { name, phoneNumber, address, image, bio, email } = userData;
    if (!name || !phoneNumber || !address || !bio || !image || !email) {
      Alert.alert("Profile", "Please fill all the fields");
      return;
    }
    setLoading(true);

    if (typeof image == 'object') {
      //upload image
      let imageRes = await uploadFile('profiles', image?.uri, true);
      if (imageRes.success) userData.image = imageRes.data;
      else userData = null;
    }
    const res = await updateUser(userId, userData);
    setLoading(false);

    if (res.success) {
    //   setUserData({ ...currentUser, ...userData });
      router.back();
    }
  }

  let imageSource = user.image && typeof user.image == 'object' ? user.image.uri : GetUserImageSrc(user.image)
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Chỉnh sửa trang cá nhân" />
          {/* form */}

          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar}></Image>
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon name="camera" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Làm ơn điền đầy đủ thông tin
            </Text>
            <Input
              icon={<Icon name="user" />}
              placeholder='Enter your name'
              value={user.name}
              onChangeText={value => setUser({ ...user, name: value })}
            />

            <Input
              icon={<Icon name="call" />}
              placeholder='Enter your phone number'
              value={user.phoneNumber}
              onChangeText={value => setUser({ ...user, phoneNumber: value })}
            />

            <Input
              icon={<Icon name="location" />}
              placeholder='Enter your address'
              value={user.address}
              onChangeText={value => setUser({ ...user, address: value })}
            />

            <Input
              icon={<Icon name="mail" />}
              placeholder='Enter your email'
              value={user.email}
              onChangeText={value => setUser({ ...user, email: value })}
            />

            <Input
              placeholder='Enter your bio'
              value={user.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={value => setUser({ ...user, bio: value })}
            />

            <Button title='Cập Nhật' loading={loading} onPress={onsubmit} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default EditProfileAdmin

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4)
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: 'center'
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.colors.darkLight
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  bio: {
    flexDirection: 'row',
    height: hp(15),
    alignItems: 'flex-start',
    paddingVertical: 15
  },
  input: {

  }
})