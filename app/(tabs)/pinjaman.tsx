import {
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Keyboard,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Text, ActivityIndicator, Button, TextInput, HelperText } from "react-native-paper";
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
import { useRouter, Stack } from "expo-router";
import { isSignedIn } from '@/services/auth';
import { fetchWithRetry } from "@/services/fetching";
import { styles as glStyles } from "@/assets/styles";

const { width, height } = Dimensions.get("window");

export default function PinjamanScreen() {
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [jumlahPinjaman, setJumlahPinjaman] = useState('');
  const [lamaAngsuran, setLamaAngsuran] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    setErrors({});
    setErrorMsg('');
    setJumlahPinjaman('');
    setLamaAngsuran('');
    setIsSubmit(false);

    const checkIfSignedIn = async () => {
      const signedIn = await isSignedIn();
      if (!signedIn) {
        router.replace("/login");
        return;
      }

      setIsLoading(false);
    }

    checkIfSignedIn();

    return () => {
      setErrors({});
      setErrorMsg('');
      setJumlahPinjaman('');
      setLamaAngsuran('');
      setIsLoading(false);
      setIsSubmit(false);
    };
  }, []);

  const goBack = () => {
    router.back();
  }

  const handleSubmit = async () => {
    setIsSubmit(true);
    setErrorMsg('');
    setErrors({});
    Keyboard.dismiss();

    if (jumlahPinjaman.length === 0 || parseInt(jumlahPinjaman) > 15000000) {
      setIsSubmit(false);
      setErrors({
        jumlah_pinjaman: 'Jumlah simpanan sukarela tidak boleh kosong',
      });
      return;
    }

    if (lamaAngsuran.length === 0) {
      setIsSubmit(false);
      setErrors({
        lama_angsuran: 'Jumlah simpanan sukarela tidak boleh kosong',
      });
      return;
    }

    try {
      let param = JSON.stringify({
        'jumlah_pinjaman': jumlahPinjaman,
        'lama_angsuran': lamaAngsuran,
      })
      const response = await fetchWithRetry(`trx/loan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: param,
      });

      if (response && response.statusCode !== 200) {
        setErrorMsg(response.message);
        return;
      }

      showToast(response.message);
      setJumlahPinjaman('');
      setLamaAngsuran('');
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 2000);
      return;
    } catch (error: any) {
      // console.log("Error:", error);
      // setErrorMsg(error);
    } finally {
      setIsSubmit(false);
    }
  }

  const handleLamaAngsuran = (text: string) => {
    if (parseInt(text) < 0) {
      text = '0';
    } else if (parseInt(text) > 24) {
      text = '24';
    }
    setLamaAngsuran(text);
  }

  const handleJumlahPinjam = (text: string) => {
    if (parseInt(text) < 0) {
      text = '0';
    } else if (parseInt(text) > 15000000) {
      text = '15000000';
    }
    setJumlahPinjaman(text);
  }

  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  if (isLoading) {
    return (
      <ThemedView style={[glStyles.container, glStyles.itemCenter]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color="#2e96b8" size="large" />
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={glStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : 'height'}
    >
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
            <Text style={[glStyles.textCenter, glStyles.buttonTextTheme, { fontSize: 20 }]}>Pinjamlah dengan Bijak untuk Dipergunakan Kebutuhanmu yang Mendesak</Text>
            <Image
              source={require('@/assets/images/pinjaman.png')}
              style={[styles.logo, glStyles.imgFluid]}
            />
          </ThemedView>
          <ThemedView style={[styles.row, { padding: 20 }]}>
            <TextInput
              label="Jumlah (Max Rp. 15.000.000)"
              value={jumlahPinjaman}
              onChangeText={handleJumlahPinjam}
              keyboardType="numeric"
              style={glStyles.input}
              disabled={isLoading}
              mode="outlined"
              autoComplete="off"
              outlineColor="#2e96b8"
              textColor="#2e96b8"
              underlineColor="#2e96b8"
              activeUnderlineColor="#2e96b8"
              enterKeyHint="next"
            />
            {errors && errors.jumlah_pinjaman && <HelperText type="error" style={glStyles.textDanger}>{errors.jumlah_pinjaman}</HelperText>}
          </ThemedView>
          <ThemedView style={[styles.row, { padding: 20 }]}>
            <TextInput
              label="Lama Angsuran (24 Bulan)"
              value={lamaAngsuran}
              onChangeText={handleLamaAngsuran}
              keyboardType="numeric"
              style={glStyles.input}
              disabled={isLoading}
              mode="outlined"
              autoComplete="off"
              outlineColor="#2e96b8"
              textColor="#2e96b8"
              underlineColor="#2e96b8"
              activeUnderlineColor="#2e96b8"
              enterKeyHint="enter"
            />
            {errors && errors.lama_angsuran && <HelperText type="error" style={glStyles.textDanger}>{errors.lama_angsuran}</HelperText>}
          </ThemedView>
          <ThemedView style={[styles.row, { padding: 20 }]}>
            <Text style={[glStyles.textDanger, glStyles.textCenter]}>{errorMsg}</Text>
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
    </KeyboardAvoidingView>
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
    width: width * 0.3,
    height: height * 0.2,
  },
});
