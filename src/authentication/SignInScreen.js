import { useState } from "react"
import { SafeAreaView, View, Text, TouchableOpacity, TouchableWithoutFeedback, Image, StyleSheet, TextInput, Keyboard, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { signin } from "../../database/database"
import { saveUserID } from "../storage/asyncstorage"

/**
 * 로그인 화면 입니다.
 * 사용자가 입력할 로그인 정보 입력값은 {아이디}, {비밀번호} 입니다.
 */
const SignInScreen = () => {
    const navigation = useNavigation()

    const [id, setId] = useState("")
    const [password, setPassword] = useState("")

    // 키보드를 종료합니다.
    const keyboardOff = () => {
        Keyboard.dismiss()
    }

    // 입력한 아이디를 초기화합니다.
    const clearId = () => {
        setId("")
    }

    // 입력한 비밀번호를 초기화합니다.
    const clearPassword = () => {
        setPassword("")
    }

    /**
     * 로그인 로직입니다.
     */
    const signInButtonHandler = async () => {
        if (id === "") {
            Alert.alert("아이디를 입력하세요.")
        } else if (password === "") {
            Alert.alert("비밀번호를 입력하세요.")
        } else {
            const signinResult = await signin(id, password)
            if (signinResult) {
                saveUserID(id)
                navigation.navigate("MainTab")
            } else {
                console.error("로그인실패 :::", e)
            }
        }
    }

    // 회원가입 화면으로 전환합니다.
    const signUpButtonHandler = () => {
        navigation.navigate("SignUp")
    }

    return (
        <TouchableWithoutFeedback onPress={keyboardOff}>
            <SafeAreaView style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require("../../assets/my-social-app-icon.png")}
                        style={styles.logo}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        value={id}
                        onChangeText={setId}
                        placeholder="아이디"
                        placeholderTextColor="#AAAAAA"
                        style={styles.input}
                        returnKeyType="next"
                        onSubmitEditing={() => { passwordInput.focus() }}
                        onFocus={() => clearId()}
                    />

                    <TextInput
                        ref={(input) => { passwordInput = input }}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="비밀번호"
                        placeholderTextColor="#AAAAAA"
                        secureTextEntry={true}
                        style={styles.input}
                        returnKeyType="done"
                        onFocus={() => clearPassword()}
                    />

                    <TouchableOpacity onPress={signInButtonHandler} style={styles.signinContainer} activeOpacity={0.9}>
                        <Text style={styles.signin}>로그인</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={signUpButtonHandler} style={styles.signupContainer} activeOpacity={0.9}>
                        <Text style={styles.signup}>회원가입</Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default SignInScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    logoContainer: {
        width: "100%",
        height: "50%",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    logo: {
        marginTop: "50%",
        width: 130,
        height: 130
    },
    inputContainer: {
        width: "100%",
        height: "50%",
        alignItems: "center"
    },
    input: {
        fontSize: 18,
        color: "#444444",
        width: "70%",
        backgroundColor: "#F9F5F6",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 15,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5
    },
    signinContainer: {
        backgroundColor: "#F2BED1",
        paddingVertical: 15,
        borderRadius: 25,
        width: "70%",
        alignItems: "center",
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 5
    },
    signin: {
        fontSize: 20,
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    signupContainer: {
        padding: 5
    },
    signup: {
        fontSize: 16,
        color: "#F2BED1",
        fontWeight: "bold"
    }
})