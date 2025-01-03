import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, ActivityIndicator, TextInput } from "react-native-paper";
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { isSignedIn, signOut } from '@/services/auth';
import { fetchWithRetry } from "@/services/fetching";
import { styles as glStyles } from "@/assets/styles";
import Header from "@/components/Header";

const { width, height } = Dimensions.get("window");

export default function ProfileScreen() {
  const [errors, setErrors] = useState('');
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setErrors('');
    setUser('');
    setIsLoading(true);

    const checkIfSignedIn = async () => {
      const signedIn = await isSignedIn();
      if (!signedIn) {
        router.replace("/login");
        return;
      }

      try {
        // Refresh token jadi gak expired
        const response = await fetchWithRetry(`user/my-profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Kalo bukan 200 berarti token invalid,
        // jadi hapus aja token dari storage, terus redirect ke login
        if (response && response.statusCode !== 200) {
          signOut();
          router.replace("/login");
          return;
        }

        // Simpan token baru di storage
        setUser(response.data);

      } catch (error: any) {
        // console.log("Error:", error);
        // setErrors(error);
      } finally {
        // setTimeout(() => {
        //   setIsLoading(false);
        // }, 3000);
        setIsLoading(false);
      }
    };

    checkIfSignedIn();
    return () => {
      setErrors('');
      setUser('');
      setIsLoading(false);
    };
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
    <ThemedView style={glStyles.container}>
      <Stack.Screen options={{
        headerShown: true,
        headerRight: () => (
          <TouchableOpacity onPress={goBack}>
            <Text style={[glStyles.buttonTextTheme, { paddingHorizontal: 10 }]}>Back</Text>
          </TouchableOpacity>
        )
      }} />
      <ThemedView style={styles.grid}>
        <Header
          title={`Profile`}
          subtitle="Anggota Koperasi Karyawan"
        />
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: width * 0.05,
  },
  input: {
    width: "100%",
  },
});
