import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, ActivityIndicator } from "react-native-paper";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
import { useRouter, Stack } from "expo-router";
import { isSignedIn, signIn, signOut } from '@/services/auth';
import { fetchWithRetry } from "@/services/fetching";
import { styles as glStyles } from "@/assets/styles";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

export default function HomeScreen() {
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nama, setNama] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const checkIfSignedIn = async () => {
      const signedIn = await isSignedIn();
      if (!signedIn) {
        router.replace("/login");
        return;
      }

      setErrors('');

      try {
        // Refresh token jadi gak expired
        const response = await fetchWithRetry(`auth/verify`, {
          method: "POST",
        });

        // Kalo bukan 200 berarti token invalid,
        // jadi hapus aja token dari storage, terus redirect ke login
        if (response && response.statusCode !== 200) {
          signOut();
          router.replace("/login");
          return;
        }

        // Simpan token baru di storage
        signIn(response.token);
        setNama(response.user.nama);

      } catch (error: any) {
        // console.log("Error:", error);
        // setErrors(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfSignedIn();
  }, []);

  const goToHistory = () => {
    router.replace("/history");

  }

  const goToBayar = () => {
    router.replace("/bayar");

  }

  const goToSimpan = () => {
    router.replace("/simpan");

  }

  const goToProfile = () => {
    router.replace("/(tabs)/profile");

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
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.grid}>
        <ThemedView style={styles.header}>
          <Text style={[glStyles.textCenter, glStyles.buttonTextTheme, {fontSize: 37}]}>Welcome, {nama}</Text>
          <Text style={[glStyles.textCenter, glStyles.buttonTextTheme, {fontSize: 20}]}>Koperasi Karyawan Pasar Rebo</Text>
        </ThemedView>
        <ThemedView style={styles.row}>
          <ThemedView style={styles.quadrant}>
            <TouchableOpacity
              onPress={goToHistory}
              disabled={isLoading}
              style={[styles.button, glStyles.itemCenter]}
            >
              <Image
                source={require('@/assets/images/history.png')}
                style={[styles.logo, glStyles.imgFluid]}
              />
              <ThemedText style={[glStyles.buttonTextTheme, glStyles.textBold, glStyles.textCenter]}>History</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <ThemedView style={styles.quadrant}>
            <TouchableOpacity
              onPress={goToBayar}
              disabled={isLoading}
              style={[styles.button, glStyles.itemCenter]}
            >
              <Image
                source={require('@/assets/images/bayar.png')}
                style={[styles.logo, glStyles.imgFluid]}
              />
              <ThemedText style={[glStyles.buttonTextTheme, glStyles.textBold, glStyles.textCenter]}>Bayar</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.row}>
          <ThemedView style={styles.quadrant}>
            <TouchableOpacity
              onPress={goToSimpan}
              disabled={isLoading}
              style={[styles.button, glStyles.itemCenter]}
            >
              <Image
                source={require('@/assets/images/simpan.png')}
                style={[styles.logo, glStyles.imgFluid]}
              />
              <ThemedText style={[glStyles.buttonTextTheme, glStyles.textBold, glStyles.textCenter]}>Simpan</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <ThemedView style={styles.quadrant}>
            <TouchableOpacity
              onPress={goToProfile}
              disabled={isLoading}
              style={[styles.button, glStyles.itemCenter]}
            >
              <Image
                source={require('@/assets/images/profile.png')}
                style={[styles.logo, glStyles.imgFluid]}
              />
              <ThemedText style={[glStyles.buttonTextTheme, glStyles.textBold, glStyles.textCenter]}>Profile</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    paddingTop: 120,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  quadrant: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    color: '#fff',
    fontWeight: 600,
  },
  button: {
    marginTop: 10,
    width: "100%",
    padding: 5,
  },
  logo: {
    width: width * 0.3, // 50% of screen width
    height: height * 0.2, // 20% of screen height
  },
});
