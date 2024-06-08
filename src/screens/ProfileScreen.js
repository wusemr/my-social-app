import React, { useEffect, useState, useRef } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Dimensions,
    Image,
    Animated
} from "react-native"
import { FontAwesome6, FontAwesome5 } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { getUserID } from "../storage/asyncstorage"
import { getUserPost, updateProfileImage, getUserInfo, getProfileImage } from "../../database/database"
import Post from "../components/Post"

const { width } = Dimensions.get("window")

/**
 * 사용자의 프로필 정보와 게시물 목록을 출력하는 화면입니다.
 */
const ProfileScreen = () => {
    const [refreshing, setRefreshing] = useState(false)
    const [posts, setPosts] = useState([])
    const [userID, setUserID] = useState(null)
    const [userName, setUserName] = useState(null)
    const [profileImage, setProfileImage] = useState(null)

    const scaleValue = useRef(new Animated.Value(1)).current
    const scrollViewRef = useRef(null)
    const upScaleValue = useRef(new Animated.Value(1)).current
    const downScaleValue = useRef(new Animated.Value(1)).current

    // 페이지 새로고침
    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        fetchPosts()
        setTimeout(() => {
            setRefreshing(false)
        }, 2000)
    }, [])

    // 게시물 불러오기
    const fetchPosts = async () => {
        try {
            if (userID) {
                const postsData = await getUserPost(userID)
                const sortedPosts = postsData.sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
                setPosts(sortedPosts)
            }
        } catch (e) {
            console.error("게시물 불러오기를 실패했습니다.", e)
        }
    }

    const startPressAnimation = () => {
        Animated.timing(scaleValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    const endPressAnimation = () => {
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const startUpPressAnimation = () => {
        Animated.timing(upScaleValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    const endUpPressAnimation = () => {
        Animated.timing(upScaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const startDownPressAnimation = () => {
        Animated.timing(downScaleValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    const endDownPressAnimation = () => {
        Animated.timing(downScaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    // 맨 위로 스크롤
    const scrollToTop = () => {
        scrollViewRef.current.scrollTo({ y: 0, animated: true })
    }

    // 맨 아래로 스크롤
    const scrollToBottom = () => {
        scrollViewRef.current.scrollToEnd({ animated: true })
    }

    // 사진 선택 함수
    const pickPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            exif: false
        })

        if (!result.canceled) {
            const image = result.assets[0].uri
            return image
        } else {
            return false
        }
    }

    // 프로필 이미지 변경
    const updateProfile = async () => {
        const newImage = await pickPhoto()
        await updateProfileImage(userID, newImage)
        await fetchUserInfo()
        await fetchPosts()
    }

    // 사용자 정보 불러오기
    const fetchUserInfo = async () => {
        const userId = await getUserID()
        setUserID(userId)
        const userInfo = await getUserInfo(userId)
        setUserName(userInfo.name)
        setProfileImage(userInfo.profileImage)
    }

    // 프로필 이미지 불러오기
    const fetchProfileImage = async (id) => {
        try {
            const imageUri = await getProfileImage(id)
            return imageUri
        } catch (e) {
            console.error(`${id} 님의 프로필 이미지 불러오기를 실패했습니다`)
            return false
        }
    }

    // 화면이 로드될 때 한 번 실행
    useEffect(() => {
        fetchUserInfo()
    }, [])

    useEffect(() => {
        if (userID) {
            fetchPosts()
        }
    }, [fetchPosts])

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <View style={styles.header}>
                    <View style={styles.leftHeader}>
                        {
                            userID && (
                                <>
                                    <Text style={styles.nameText}>{userName}</Text>
                                    <Text style={styles.idText}>{userID}</Text>
                                </>
                            )
                        }
                    </View>

                    <View style={styles.rightHeader}>
                        <TouchableOpacity
                            onPressIn={startPressAnimation}
                            onPressOut={endPressAnimation}
                            onPress={async () => await updateProfile()}
                            style={[styles.profileImageContainer, {transform: [{ scale: scaleValue }]}]}
                            activeOpacity={1}
                        >
                            {
                                userID && profileImage ? (
                                    <Image
                                        source={{ uri: profileImage }}
                                        style={styles.profileImage}
                                    />
                                ) : (
                                    <FontAwesome6 name="user-large" size={28} color="#F2BED1" />
                                )
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ref={scrollViewRef}
            >
                <View style={{ alignItems: "center" }}>
                    {
                        posts.map((post, index) => (
                            // <TouchableOpacity key={index} activeOpacity={0.9}>
                            <Post
                                key={index}
                                profileImage={profileImage}
                                fetchProfileImage={fetchProfileImage}
                                post={post}
                                styles={postStyles}
                                disableTouchableOpacity={true}
                                like={false}
                            />
                            // </TouchableOpacity>
                        ))
                    }
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { marginBottom: 5, transform: [{ scale: upScaleValue }] }]}
                    onPressIn={startUpPressAnimation}
                    onPressOut={endUpPressAnimation}
                    onPress={scrollToTop}
                    activeOpacity={1}
                >
                    <FontAwesome5 name="angle-up" size={24} color="#F9F5F6" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, {transform: [{ scale: downScaleValue }]}]}
                    onPressIn={startDownPressAnimation}
                    onPressOut={endDownPressAnimation}
                    onPress={scrollToBottom}
                    activeOpacity={1}
                >
                    <FontAwesome5 name="angle-down" size={24} color="#F9F5F6" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#f5f5f5'
    },
    scrollView: {
        width: width
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: width,
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 2,
        borderBottomColor: "#ccc"
    },
    leftHeader: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    nameText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#444444",
        marginLeft: 10,
        marginTop: 20,
    },
    idText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#999999",
        marginLeft: 10,
        marginVertical: 5
    },
    rightHeader: {
        justifyContent: "center",
        alignItems: "center"
    },
    profileImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: "#F8E8EE",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 100
    },
    buttonContainer: {
        position: "absolute",
        bottom: 10,
        right: 10
    },
    button: {
        backgroundColor: "#FCD1D180",
        height: 30,
        width: 30,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        shadowColor: "#FCD1D1",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 1.4,
        elevation: 5
    }
})

const postStyles = StyleSheet.create({
    container: {
        width: width,
        backgroundColor: "#FFF",
        paddingHorizontal: 20,
        paddingVertical: 5,
        paddingBottom: 10,
        borderBottomWidth: 0.3,
        borderColor: "#ccc"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "2%",
        marginTop: 12
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 25,
        backgroundColor: "#F8E8EE",
        marginRight: "3%",
        alignItems: "center",
        justifyContent: "center"
    },
    username: {
        fontSize: 17,
        color: "#555555",
        fontWeight: "700"
    },
    image: {
        height: 300,
        width: 300,
        marginHorizontal: 5,
        marginVertical: 5
    },
    content: {
        color: "#555555",
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 24,
        marginHorizontal: "2%",
        marginVertical: "1%"
    },
    date: {
        fontSize: 13,
        color: "#AAAAAA"
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    modalImage: {
        width: "85%",
        height: "100%"
    }
})