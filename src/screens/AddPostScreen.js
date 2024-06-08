import { useEffect, useState, useRef } from "react"
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Keyboard,
    Alert,
    TouchableWithoutFeedback,
    Animated
} from "react-native"
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { useNavigation } from "@react-navigation/native"

import { savePost } from "../../database/database"
import Images from "../components/Images"

const { width } = Dimensions.get("window")
const { height } = Dimensions.get("screen")

/**
 * 사용자가 새로운 게시물을 추가할 수 있는 화면입니다. 
 */
const AddPostScreen = () => {
    const navigation = useNavigation()
    const textInputRef = useRef(null)
    const scaleValue = useRef(new Animated.Value(1)).current

    const [text, setText] = useState("")
    const [images, setImages] = useState([])

    const addPostHandler = () => {
        const addPost = async () => {
            try {
                const postData = {
                    text: text,
                    images: images
                }
                await savePost(postData)

                setText("")
                setImages([])

                Alert.alert("게시물이 성공적으로 등록되었습니다!")
                navigation.navigate("Feed")
            } catch (error) {
                Alert.alert("게시물을 등록하는 도중 오류가 발생했습니다.")
            }
        }

        Alert.alert("게시물 등록",
            "게시물이 등록됩니다.\n이대로 진행하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel",
                    onPress: () => console.log("게시물 등록 취소")
                },
                {
                    text: "등록하기",
                    onPress: () => addPost()
                }
            ]
        )
    }

    const keyboardOff = () => {
        Keyboard.dismiss()
    }

    const deleteImageHandler = (position) => {
        const deleteImage = () => {
            const newImageArr = images.filter((num, index) => {
                return position != index
            })
            setImages(newImageArr)
        }

        Alert.alert("사진 삭제",
            "선택한 사진을 삭제합니다.\n이 작업을 실행하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel",
                    onPress: () => console.log("사진 삭제 취소")
                },
                {
                    text: "삭제하기",
                    onPress: () => deleteImage()
                }
            ]
        )
    }

    const pickPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            quality: 1,
            exif: false
        })

        console.log(result)

        if (!result.canceled) {
            // 이미지 선택 결과가 배열 형태인 경우
            if (Array.isArray(result.assets)) {
                setImages([...images, ...result.assets.map(asset => asset.uri)])
            } else {
                // 이미지 선택 결과가 단일 이미지인 경우
                setImages([...images, result.assets.uri])
            }
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

    useEffect(() => {
        if (images.length > 5) {
            Alert.alert("이미지는 최대 5개까지만 선택이 가능합니다.")
            setImages(images.slice(0, 5))
        }
    }, [images])

    return (
        <TouchableWithoutFeedback onPress={keyboardOff}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => keyboardOff()} activeOpacity={1}>
                        <MaterialCommunityIcons name="keyboard-close" size={24} color="#999999" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => addPostHandler()} activeOpacity={1}>
                        <Text style={{ fontSize: 18, color: "#F38181", fontWeight: "bold" }}>등록</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.body}>
                    <TouchableWithoutFeedback onPress={() => textInputRef.current.focus()}>
                        <View style={styles.bodytext} keyboardShouldPersistTaps="always">
                            <View style={styles.inputWrapper} activeOpacity={1}>
                                <TextInput
                                    ref={textInputRef}
                                    style={styles.input}
                                    value={text}
                                    placeholder="본문을 입력하세요."
                                    placeholderTextColor="#AAAAAA"
                                    onChangeText={setText}
                                    multiline={true}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                    <ScrollView horizontal={true} style={styles.bodyimage}>
                        <Images images={images} deleteImage={deleteImageHandler} style={styles.image} />
                    </ScrollView>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPressIn={startPressAnimation}
                        onPressOut={endPressAnimation}
                        onPress={() => pickPhoto()}
                        style={[styles.bottomButton, { transform: [{ scale: scaleValue }] }]}
                        activeOpacity={1}
                    >
                        <Feather name="image" size={30} color="#F9F7F7" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default AddPostScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
        marginHorizontal: 20
    },
    body: {
        alignItems: "center"
    },
    bodytext: {
        width: width - 40,
        height: (height / 2) + 20
    },
    inputWrapper: {
        height: height / 2,
        paddingHorizontal: 10,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        shadowColor: "#F2BED1",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 5
    },
    input: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 5,
        fontSize: 16,
        fontWeight: "500",
        color: "#444444",
        lineHeight: 24,
        textAlignVertical: "top"
    },
    bodyimage: {
        width: width - 50,
        height: 200,
    },
    image: {
        height: 200,
        width: 200,
        marginRight: 13
    },
    buttonContainer: {
        height: 50,
        flexDirection: "row"
    },
    bottomButton: {
        backgroundColor: "#F2BED180",
        borderRadius: 100,
        marginLeft: 25,
        marginVertical: 10,
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#F2BED1",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.6,
        shadowRadius: 1,
        elevation: 5
    }
})