import { StyleSheet } from "react-native";

export const imageRatio = (scale: number) => ({
    aspectRatio: (scale ? scale : 1) / 1,
});

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    quadrantSkeleton: {
        height: 100,
        width: '48%',
        borderRadius: 8,
    },
    headerSkeleton: {
        marginBottom: 16,
    },
    itemCenter: {
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
        width: "100%",
    },
    button: {
        marginTop: 10,
        width: "100%",
        backgroundColor: '#2e96b8',
        padding: 5,
    },
    unfocused: {
        backgroundColor: '#87d4ed',
    },
    buttonText: {
        color: '#fff',
    },
    buttonTextTheme: {
        color: '#2e96b8',
    },
    textBold: {
        fontWeight: 700,
    },
    imgFluid: {
        resizeMode: "contain", // Ensure the image scales correctly
    },
    textDanger: {
        color: '#ff0000',
    }
});