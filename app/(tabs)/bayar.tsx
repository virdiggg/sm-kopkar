import { StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Text, ActivityIndicator, TextInput } from "react-native-paper";
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
import { useRouter, Stack } from "expo-router";
import { isSignedIn, signOut } from '@/services/auth';
import { fetchWithRetry } from "@/services/fetching";
import { styles as glStyles } from "@/assets/styles";

export default function BayarScreen() {
  const [errors, setErrors] = useState('');
  const [simpananPokok, setSimpananPokok] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const checkIfSignedIn = async () => {
      setErrors('');

      const signedIn = await isSignedIn();
      if (!signedIn) {
        router.replace("/login");
        return;
      }
    }

    checkIfSignedIn();
  }, []);

  const goBack = () => {
    router.back();
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
    <TouchableWithoutFeedback style={glStyles.container}>
      <Stack.Screen options={{
        headerShown: true,
        headerRight: () => (
          <TouchableOpacity onPress={goBack}>
            <Text style={[glStyles.buttonTextTheme, { paddingHorizontal: 10 }]}>Back</Text>
          </TouchableOpacity>
        )
      }} />
      <ThemedView style={styles.grid}>
        <ThemedView style={styles.header}>
          <Text style={[glStyles.textCenter, glStyles.buttonTextTheme, { fontSize: 20 }]}>Menabunglah dari Pengailan agar Kelak dapat Kau Gunakan untuk Masa Depanmu</Text>
        </ThemedView>
        <ThemedView style={styles.row}>
          <Text style={[glStyles.buttonTextTheme, glStyles.textBold, glStyles.textCenter, { fontSize: 20 }]}>Nama:</Text>
        </ThemedView>
        <ThemedView style={styles.row}>
          <TextInput
            value={user?.nama}
            keyboardType="default"
            style={styles.input}
            disabled={true}
            autoCapitalize='none'
          />
        </ThemedView>
        <ThemedView style={styles.row}>
          <Text style={[glStyles.buttonTextTheme, glStyles.textBold, glStyles.textCenter, { fontSize: 20 }]}>Kode Toko:</Text>
        </ThemedView>
        <ThemedView style={styles.row}>
          <TextInput
            value={user?.koperasi_id}
            keyboardType="default"
            style={styles.input}
            disabled={true}
            autoCapitalize='none'
          />
        </ThemedView>
        <ThemedView style={styles.row}>
          <Text style={[glStyles.buttonTextTheme, glStyles.textBold, glStyles.textCenter, { fontSize: 20 }]}>Nama Bank:</Text>
        </ThemedView>
        <ThemedView style={styles.row}>
          <TextInput
            value={user?.bank}
            keyboardType="default"
            style={styles.input}
            disabled={true}
            autoCapitalize='none'
          />
        </ThemedView>
        <ThemedView style={styles.row}>
          <Text style={[glStyles.buttonTextTheme, glStyles.textBold, glStyles.textCenter, { fontSize: 20 }]}>No. Rekening:</Text>
        </ThemedView>
        <ThemedView style={styles.row}>
          <TextInput
            value={user?.no_rek}
            keyboardType="default"
            style={styles.input}
            disabled={true}
            autoCapitalize='none'
          />
        </ThemedView>
        <ThemedView style={styles.row}>
          <Text style={[glStyles.buttonTextTheme, glStyles.textBold, glStyles.textCenter, { fontSize: 20 }]}>ID Koperasi:</Text>
        </ThemedView>
        <ThemedView style={styles.row}>
          <TextInput
            value={user?.koperasi_id + user?.anggota_id}
            keyboardType="default"
            style={styles.input}
            disabled={true}
            autoCapitalize='none'
          />
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
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
  },
  input: {
    width: "100%",
  },
});
