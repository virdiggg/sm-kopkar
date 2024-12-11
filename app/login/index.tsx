import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useRouter, Stack } from "expo-router";
import { fetchWithRetry } from "@/services/fetching";
import { signIn, isSignedIn } from "@/services/auth";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [errors, setErrors] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const checkIfSignedIn = async () => {
        const signedIn = await isSignedIn();
        if (signedIn) {
            router.replace("/(tabs)");
            return;
        }
    };

    useEffect(() => {
        checkIfSignedIn();
    }, []);

    const handleLogin = async () => {
        setIsLoading(true);

        let user = username.trim();
        let pass = password.trim();
        if (user.length === 0 || pass.length === 0) {
            setIsLoading(false);
            setErrors("Username and password cannot be empty");
            return;
        }

        let param = JSON.stringify({ username: username.trim(), password: password.trim() });

        try {
            const response = await fetchWithRetry(`auth/sign-in`, {
                method: "POST",
                body: param,
            });

            if (response && response.statusCode !== 200) {
                setErrors(response.message);
                return;
            }

            // Simpan token di storage
            signIn(response.token);

            checkIfSignedIn();
            return;
        } catch (error: any) {
            // console.log("Error:", error);
            // setErrors(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Stack.Screen options={{ title: 'Login' }} />
                    <Image
                        source={require('@/assets/images/logo.png')}
                        style={styles.logo}
                    />
                    <TextInput
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        keyboardType="default"
                        style={styles.input}
                        disabled={isLoading}
                        right={<TextInput.Icon icon="email" />}
                    />
                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        style={styles.input}
                        disabled={isLoading}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"} // Change icon based on state
                                onPress={() => setShowPassword(!showPassword)} // Toggle password visibility
                            />
                        }
                    />
                    <Text style={{ color: "red" }}>{errors}</Text>
                    <Button mode="contained" onPress={handleLogin} disabled={isLoading} style={styles.button}>
                        Login
                    </Button>
                </View>
            </TouchableWithoutFeedback>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: '#fff',
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
        backgroundColor: '#ADD8E6',
    },
    logo: {
        width: width * 0.5, // 50% of screen width
        height: height * 0.2, // 20% of screen height
        marginBottom: 30,
        resizeMode: "contain", // Ensure the image scales correctly
    },
});
