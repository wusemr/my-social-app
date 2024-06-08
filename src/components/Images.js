import { TouchableOpacity, Image } from "react-native"

/**
 * Images의 형식을 지정하는 컴포넌트입니다.
 * AddPostScreen에서 사용합니다.
 */
const Images = (props) => {
    return (
        props.images.map((image, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => props.deleteImage(index)}
                activeOpacity={1}
            >
                <Image
                    source={{ uri: image }}
                    style={props.style}
                />
            </TouchableOpacity>
        ))
    )
}

export default Images