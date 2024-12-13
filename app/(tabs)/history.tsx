import { StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Text, ActivityIndicator, TextInput } from "react-native-paper";
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
import { useRouter, Stack } from "expo-router";
import { isSignedIn, signOut } from '@/services/auth';
import { fetchWithRetry } from "@/services/fetching";
import { getItem } from '@/services/storage';
import { styles as glStyles } from "@/assets/styles";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

export default function HistoryScreen() {
  const [errors, setErrors] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setErrors('');
    setName('');
    setIsLoading(false);

    const checkIfSignedIn = async () => {
      setIsLoading(true);

      const signedIn = await isSignedIn();
      const name = await getItem('name');
      if (!signedIn || !name) {
        router.replace("/login");
        return;
      }

      setName(name);
      setIsLoading(false);
    }

    checkIfSignedIn();

    return () => {
      setErrors('');
      setName('');
      setIsLoading(false);
    };
  }, []);

  const goToPinjaman = () => {
    router.replace("/(tabs)/history_pinjaman");
  }

  const goToSimpanan = () => {
    router.replace("/(tabs)/history_simpanan");
  }

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
        <ThemedView style={styles.header}>
          <Text style={[glStyles.textCenter, glStyles.buttonTextTheme, { fontSize: 37 }]}>History {"\n" + name}</Text>
          <Text style={[glStyles.textCenter, glStyles.buttonTextTheme, { paddingHorizontal: 10, fontSize: 20 }]}>Riwayat simpan pinjam Koperasi Karyawan Pasar Rebo</Text>
        </ThemedView>
        <ThemedView style={styles.row}>
          <TouchableOpacity
            onPress={goToPinjaman}
            disabled={isLoading}
            style={[styles.button, glStyles.itemCenter]}
          >
            <Image
              source={require('@/assets/images/pinjaman.png')}
              style={[styles.logo, glStyles.imgFluid]}
            />
            <Text style={[glStyles.buttonTextTheme, glStyles.textBold, glStyles.textCenter]}>Pinjaman</Text>
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.row}>
          <TouchableOpacity
            onPress={goToSimpanan}
            disabled={isLoading}
            style={[styles.button, glStyles.itemCenter]}
          >
            <Image
              source={require('@/assets/images/simpanan.png')}
              style={[styles.logo, glStyles.imgFluid]}
            />
            <Text style={[glStyles.buttonTextTheme, glStyles.textBold, glStyles.textCenter]}>Simpanan</Text>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
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
    paddingHorizontal: width * 0.05,
  },
  input: {
    width: "100%",
  },
  logo: {
    width: width * 0.3, // 50% of screen width
    height: height * 0.2, // 20% of screen height
  },
  button: {
    marginTop: 10,
    width: "100%",
    padding: 5,
  },
});
