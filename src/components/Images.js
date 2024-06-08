import { TouchableOpacity, Image, Animated } from "react-native"

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