import {
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Keyboard,
  Image,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";
import { Text, ActivityIndicator, Button, TextInput, HelperText } from "react-native-paper";
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
import { useRouter, Stack } from "expo-router";
import { isSignedIn } from '@/services/auth';
import { fetchWithRetry } from "@/services/fetching";
import { processUri, getMimeType } from "@/services/images";
import { styles as glStyles } from "@/assets/styles";
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get("window");

export default function SimpananScreen() {
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [simpananPokok, setSimpananPokok] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setErrors({});
    setErrorMsg('');
    setSimpananPokok('');
    setIsSubmit(false);
    setSelectedImage(null);
    setIsLoading(true);

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
      setSimpananPokok('');
      setIsLoading(false);
      setIsSubmit(false);
      setSelectedImage(null);
    };
  }, []);

  useEffect(() => {
    if (selectedImage) {
      processUri(selectedImage).then((validUri) => {
        setSelectedImage(validUri);
      });
    }
  }, [selectedImage]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      showToast('Saya perlu izin untuk mengakses file manager.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      showToast('Saya perlu izin untuk mengakses kamera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const goBack = () => {
    router.back();
  }

  const handleJumlahPinjam = (text: string) => {
    if (parseInt(text) < 0) {
      text = '0';
    }
    setSimpananPokok(text);
  }

  const handleSubmit = async () => {
    setIsSubmit(true);
    setErrorMsg('');
    setErrors({});
    Keyboard.dismiss();

    if (simpananPokok.length === 0) {
      setIsSubmit(false);
      setErrors({
        simpanan_sukarela: 'Jumlah simpanan sukarela tidak boleh kosong',
      });
      return;
    }

    if (!selectedImage) {
      setIsSubmit(false);
      setErrorMsg('Harus upload gambar');
      return;
    }

    try {
      const mime = await getMimeType(selectedImage);

      const formData = new FormData();
      formData.append('simpanan_sukarela', simpananPokok);
      formData.append('bukti_transfer', {
        uri: selectedImage,
        name: `photo_${Date.now()}.${mime.ext}`,
        type: mime.mimeType,
      });

      const response = await fetchWithRetry(`trx/deposit`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: formData,
      });

      if (response && response.statusCode !== 200) {
        setErrorMsg(response.message);
        return;
      } else {
        showToast(response.message);
        setSimpananPokok('');
        setSelectedImage(null);
        setTimeout(() => {
          router.replace("/(tabs)");
        }, 2000);
        return;
      }
    } catch (error: any) {
      // console.log("Error:", error);
      // setErrorMsg(error);
    } finally {
      setIsSubmit(false);
    }
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
            source={require('@/assets/images/simpanan.png')}
            style={[styles.logo, glStyles.imgFluid]}
          />
        </ThemedView>
        <ThemedView style={[styles.row, { paddingTop: 20 }]}>
          <TextInput
            label="Simpanan Pokok (Rp)"
            value={simpananPokok}
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
            onFocus={() => setKeyboardIsVisible(true)}
            onBlur={() => setKeyboardIsVisible(false)}
          />
          {errors && errors.simpanan_sukarela && <HelperText type="error" style={glStyles.textDanger}>{errors.simpanan_sukarela}</HelperText>}
        </ThemedView>

        {!keyboardIsVisible ? (<ThemedView style={[styles.row, glStyles.itemCenter]}>
          <Button onPress={pickImage}>Pilih Gambar</Button>
          <Button onPress={openCamera}>Ambil Foto</Button>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={[
                styles.logo,
                glStyles.imgFluid,
                {
                  resizeMode: "cover",
                },
              ]}
            />
          ) : (
            <Text style={glStyles.buttonText}>Belum pilih gambar</Text>
          )}
        </ThemedView>) : null}
        <ThemedView style={styles.row}>
          <Text style={[glStyles.textDanger, glStyles.textCenter]}>{errorMsg}</Text>
          <Button mode="contained" onPress={handleSubmit} disabled={isLoading} style={glStyles.button}>
            {isSubmit ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={glStyles.buttonText}>Simpan</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  input: {
    width: "100%",
  },
  logo: {
    width: "100%",
    height: height * 0.2,
  },
});
