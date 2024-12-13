import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import { TextInput, Button, Text, ActivityIndicator } from "react-native-paper";
import { useRouter, Stack } from "expo-router";
import { fetchWithRetry } from "@/services/fetching";
import { signIn, isSignedIn } from "@/services/auth";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { styles as glStyles } from "@/assets/styles";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
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
    setErrorMsg('');
    setUsername('');
    setPassword('');
    setIsSubmit(false);
    setShowPassword(false);

    checkIfSignedIn();

    return () => {
      setErrorMsg('');
      setUsername('');
      setPassword('');
      setIsSubmit(false);
      setShowPassword(false);
    };
  }, []);

  const handleLogin = async () => {
    setIsSubmit(true);
    setErrorMsg('');
    Keyboard.dismiss();

    let user = username.trim();
    let pass = password.trim();
    if (user.length === 0 || pass.length === 0) {
      setIsSubmit(false);
      setErrorMsg("Username and password cannot be empty");
      return;
    }

    let param = JSON.stringify({ username: username.trim(), password: password.trim() });

    try {
      const response = await fetchWithRetry(`auth/sign-in`, {
        method: "POST",
        body: param,
      });

      if (response && response.statusCode !== 200) {
        setErrorMsg(response.message);
        return;
      }

      // Simpan token di storage
      signIn(response.token);

      checkIfSignedIn();
      return;
    } catch (error: any) {
      // console.log("Error:", error);
      // setErrorMsg(error);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={glStyles.container}>
        <View style={[glStyles.itemCenter, styles.loginWrapper]}>
          <Stack.Screen options={{ headerShown: false }} />
          <Image
            source={require('@/assets/images/logo.png')}
            style={[styles.logo, glStyles.imgFluid]}
          />
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            keyboardType="default"
            style={glStyles.input}
            disabled={isSubmit}
            autoCapitalize='none'
            enterKeyHint="next"
            right={<TextInput.Icon icon="email" />}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={glStyles.input}
            disabled={isSubmit}
            autoCapitalize='none'
            enterKeyHint="enter"
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"} // Change icon based on state
                onPress={() => setShowPassword(!showPassword)} // Toggle password visibility
              />
            }
          />
          <Text style={[glStyles.textDanger, glStyles.textCenter]}>{errorMsg}</Text>
          <Button mode="contained" onPress={handleLogin} disabled={isSubmit} style={glStyles.button}>
            {isSubmit ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={glStyles.buttonText}>Login</Text>
            )}
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
  },
  loginWrapper: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
    marginTop: 20
  },
});
