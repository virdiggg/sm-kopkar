import { StyleSheet, TouchableOpacity, Keyboard, Image,TouchableWithoutFeedback, Dimensions } from "react-native";
import { Text, ActivityIndicator, Button, TextInput } from "react-native-paper";
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
import { useRouter, Stack } from "expo-router";
import { isSignedIn } from '@/services/auth';
import { fetchWithRetry } from "@/services/fetching";
import { styles as glStyles } from "@/assets/styles";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

export default function PinjamanScreen() {
  const [errors, setErrors] = useState('');
  const [simpananPokok, setSimpananPokok] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    setErrors('');
    setSimpananPokok('');
    setIsLoading(false);
    setIsSubmit(false);

    const checkIfSignedIn = async () => {
      setIsLoading(true);

      const signedIn = await isSignedIn();
      if (!signedIn) {
        router.replace("/login");
        return;
      }

      setIsLoading(false);
    }

    checkIfSignedIn();

    return () => {
      setErrors('');
      setSimpananPokok('');
      setIsLoading(false);
      setIsSubmit(false);
    };
  }, []);

  const goBack = () => {
    router.back();
  }

  const handleSubmit = async () => {
    setIsSubmit(true);
    setErrors('');

    try {
      let param = JSON.stringify({
        'simpanan_sukarela': simpananPokok
      })
      const response = await fetchWithRetry(`trx/loan`, {
        method: "POST",
        body: param,
      });

      if (response && response.statusCode !== 200) {
        setErrors(response.message);
        return;
      }

      router.replace("/(tabs)");
      return;
    } catch (error: any) {
      // console.log("Error:", error);
      // setErrors(error);
    } finally {
      setIsSubmit(false);
    }
  }

  if (isLoading) {
    return (
      <ThemedView style={[glStyles.container, glStyles.itemCenter]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color="#2e96b8" size="large" />
      </ThemedView>
    );
  }

  return (
    <TouchableWithoutFeedback style={glStyles.container} onPress={Keyboard.dismiss}>
      <ThemedView style={styles.grid}>
        <Stack.Screen options={{
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={goBack}>
              <Text style={[glStyles.buttonTextTheme, { paddingHorizontal: 10 }]}>Back</Text>
            </TouchableOpacity>
          )
        }} />
        <ThemedView style={styles.header}>
          <Text style={[glStyles.textCenter, glStyles.buttonTextTheme, { fontSize: 20 }]}>Menabunglah dari Pengailan agar Kelak dapat Kau Gunakan untuk Masa Depanmu</Text>
          <Image
            source={require('@/assets/images/pinjaman.png')}
            style={[styles.logo, glStyles.imgFluid]}
          />
        </ThemedView>
        <ThemedView style={[styles.row, { padding: 20 }]}>
          <TextInput
            label="Simpanan Pokok (Rp)"
            value={simpananPokok}
            onChangeText={setSimpananPokok}
            keyboardType="numeric"
            style={glStyles.input}
            disabled={isLoading}
            mode="outlined"
            autoComplete="off"
            outlineColor="#2e96b8"
            textColor="#2e96b8"
            underlineColor="#2e96b8"
            activeUnderlineColor="#2e96b8"
          />
        </ThemedView>
        <ThemedView style={[styles.row, { padding: 20 }]}>
          <Text style={glStyles.textDanger}>{errors}</Text>
          <Button mode="contained" onPress={handleSubmit} disabled={isLoading} style={glStyles.button}>
            {isSubmit ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={glStyles.buttonText}>Pinjam</Text>
            )}
          </Button>
        </ThemedView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    paddingTop: 20,
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  input: {
    width: "100%",
  },
  logo: {
    width: width * 0.3, // 50% of screen width
    height: height * 0.2, // 20% of screen height
  },
});
