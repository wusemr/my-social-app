import AsyncStorage from "@react-native-async-storage/async-storage"

export const saveUserInfo = async (userInfo) => {
    try {
        await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo))
        console.log(JSON.stringify(userInfo))
        console.log("AsyncStorage에 사용자 정보가 저장되었습니다.")
    } catch (e) {
        console.error("AsynceStorage에 사용자 정보를 저장하는 동안 오류가 발생했습니다:", e)
    }
}

export const saveUserID = async (userID) => {
    try {
        await AsyncStorage.setItem("userid", userID)
        console.log("AsyncStorage로 저장한 user id:" ,userID)
    } catch (e) {
        console.error("AsyncStorage에 아이디 저장하다가 오류 발생함")
    }
}

export const loadUserInfo = async () => {
    try {
        const userInfoString = await AsyncStorage.getItem("userInfo")

        if (userInfoString !== null) {
            const userInfo = JSON.parse(userInfoString)
            return userInfo
        }
    } catch (e) {
        console.error("AsynceStorage에서 사용자 정보를 불러오는 동안 오류가 발생했습니다:", e)
        return null
    }
}

export const getUserID = async () => {
    try {
        const userID = await AsyncStorage.getItem("userid")
        if(userID !== null) {
            return userID
        }
    } catch (e) {
        console.error("AsyncStorage에서 아이디 불러오다가 오류 발생함")
        return null
    }
}