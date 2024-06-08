import AsyncStorage from "@react-native-async-storage/async-storage"

export const saveUserID = async (userID) => {
    try {
        await AsyncStorage.setItem("userid", userID)
        console.log("AsyncStorage로 저장한 user id:" ,userID)
    } catch (e) {
        console.error("AsyncStorage에 아이디 저장하다가 오류 발생함")
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