import { useState } from "react"
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { signup } from "../../database/database"

/**
 * 회원가입 화면입니다.
 * 사용자가 입력할 회원가입 정보 입력값은 {이름}, {아이디}, {비밀번호}, {비밀번호 확인}, {전화번호} 입니다.
 */
const SignUpScreen = () => {
    const navigation = useNavigation()

    const [name, setName] = useState("")
    const [id, setId] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")

    // 키보드를 종료합니다.
    const keyboardOff = () => {
        Keyboard.dismiss()
    }

    /**
     * 입력 값을 초기화합니다.
     * @param {string} inputType
     * 초기화할 입력 유형: name, id, password, confirmPassword, phoneNumber
     */
    const clearInput = (inputType) => {
        switch (inputType) {
            case "name":
                setName("")
                break
            case "id":
                setId("")
                break
            case "password":
                setPassword("")
                break
            case "confirmPassword":
                setConfirmPassword("")
                break
            case "phoneNumber":
                setPhoneNumber("")
                break
        }
    }

    /**
     * 이름(name)이 한글 또는 영어로만 이루어져 있는지 확인합니다.
     * @returns {boolean}
     */
    const validateName = (text) => {
        const regex = /^[가-힣a-zA-Z]+$/
        return regex.test(text)
    }

    /**
     * 아이디(id)가 영어 또는 숫자로만 이루어져 있는지 확인합니다.
     * @returns {boolean}
     */
    const validateId = (text) => {
        const regex = /^[a-zA-Z0-9]+$/
        return regex.test(text)
    }

    /**
     * 비밀번호(password)가 영어, 숫자, 특수문자(~!@#$%^&*)로만 이루어져 있는지 확인합니다.
     * @returns {boolean}
     */
    const validatePassword = (text) => {
        const regex = /^[a-zA-Z0-9~!@#$%^&*]+$/
        return regex.test(text)
    }

    /**
     * 전화번호(phoneNumber)가 11자리로 이루어져 있는지 확인합니다.
     * @returns {boolean}
     */
    const validatePhoneNumber = (text) => {
        return text.length === 11
    }

    /**
     * 회원가입 로직입니다.
     * 회원가입 정보의 유효성을 검사합니다.
     */
    const signupButtonHandler = async () => {
        if (name === "") {
            Alert.alert("이름을 입력하세요.")
        } else if (id === "") {
            Alert.alert("아이디를 입력하세요.")
        } else if (password === "") {
            Alert.alert("비밀번호를 입력하세요.")
        } else if (!validateName(name)) {
            Alert.alert("이름을 한글 또는 영어로만 입력하세요.")
        } else if (!validateId(id)) {
            Alert.alert("아이디를 영어 또는 숫자로만 입력하세요.")
        } else if (!validatePassword(password)) {
            Alert.alert("비밀번호를 영어, 숫자, 특수문자(~!@#$%^&*)로만 입력하세요.")
        } else if (password !== confirmPassword && confirmPassword == "") {
            Alert.alert("비밀번호가 일치하지 않습니다.")
        } else if (!validatePhoneNumber(phoneNumber) && phoneNumber == "") {
            Alert.alert("올바른 전화번호를 입력하세요.")
        } else {
            if (await signup(name, id, password, phoneNumber)) {
                console.log(
                    "회원가입 입력 정보 :::",
                    "이름:", name,
                    "아이디:", id,
                    "비밀번호:", password,
                    "비밀번화 확인:", confirmPassword,
                    "전화번호:", phoneNumber
                )
                navigation.navigate("SignIn")
            } else {
                console.log("회원가입 실패 :::", e)
                Alert.alert("회원가입에 실패했습니다.")
            }
        }
    }

    return (
        <TouchableWithoutFeedback onPress={keyboardOff}>
            <SafeAreaView style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="이름"
                        placeholderTextColor="#AAAAAA"
                        style={styles.input}
                        returnKeyType="next"
                        onSubmitEditing={() => { idInput.focus() }}
                        onFocus={() => clearInput("name")}
                    />

                    <TextInput
                        ref={(input) => { idInput = input }}
                        value={id}
                        onChangeText={setId}
                        placeholder="아이디"
                        placeholderTextColor="#AAAAAA"
                        style={styles.input}
                        returnKeyType="next"
                        onSubmitEditing={() => { passwordInput.focus() }}
                        onFocus={() => clearInput("id")}
                    />


                    <TextInput
                        ref={(input) => { passwordInput = input }}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="비밀번호"
                        placeholderTextColor="#AAAAAA"
                        secureTextEntry={true}
                        style={styles.input}
                        returnKeyType="next"
                        onSubmitEditing={() => { confirmPasswordInput.focus() }}
                        onFocus={() => clearInput("password")}
                    />

                    <TextInput
                        ref={(input) => { confirmPasswordInput = input }}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="비밀번호 확인"
                        placeholderTextColor="#AAAAAA"
                        secureTextEntry={true}
                        style={styles.input}
                        onSubmitEditing={() => { phoneNumberInput.focus() }}
                        onFocus={() => clearInput("confirmPassword")}
                    />

                    <TextInput
                        ref={(input) => { phoneNumberInput = input }}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        placeholder="전화번호"
                        placeholderTextColor="#AAAAAA"
                        style={styles.input}
                        returnKeyType="done"
                        maxLength={11}
                        onFocus={() => clearInput("phoneNumber")}
                    />

                    <TouchableOpacity onPress={signupButtonHandler} style={styles.signupContainer} activeOpacity={0.9}>
                        <Text style={styles.signup}>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    inputContainer: {
        width: "100%",
        alignItems: "center"
    },
    input: {
        fontSize: 18,
        color: "#444444",
        width: "70%",
        backgroundColor: "#F9F5F6",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 16,
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
    signupContainer: {
        backgroundColor: "#F2BED1",
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 25,
        width: "70%",
        alignItems: "center",
        marginTop: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 5
    },
    signup: {
        fontSize: 20,
        color: "#FFFFFF",
        fontWeight: "bold"
    }
})