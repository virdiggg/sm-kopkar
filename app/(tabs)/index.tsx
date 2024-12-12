// import { Image, StyleSheet, Platform } from 'react-native';
// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
import { StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
import { useRouter, Stack } from "expo-router";
import { isSignedIn, getToken, signIn, signOut } from '@/services/auth';
import { fetchWithRetry } from "@/services/fetching";
import { styles as glStyles } from "@/assets/styles";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

export default function HomeScreen() {
  const [token, setToken] = useState('');
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const checkIfSignedIn = async () => {
      const signedIn = await isSignedIn();
      if (!signedIn) {
        router.replace("/login");
        return;
      }

      setErrors('');

      const userToken = await getToken();
      setToken(userToken);
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
  }, []);
  if (isLoading) {
    return (
      <ThemedView style={[glStyles.container, glStyles.itemCenter]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color="#2e96b8" size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.grid}>
        <ThemedView style={styles.row}>
          <ThemedView style={[styles.quadrant, styles.topLeft]}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={[styles.logo, glStyles.imgFluid]}
            />
            <ThemedText style={[glStyles.buttonTextTheme, glStyles.textBold]}>Top Left</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.quadrant, styles.topRight]}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={[styles.logo, glStyles.imgFluid]}
            />
            <ThemedText style={[glStyles.buttonTextTheme, glStyles.textBold]}>Top Right</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.row}>
          <ThemedView style={[styles.quadrant, styles.bottomLeft]}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={[styles.logo, glStyles.imgFluid]}
            />
            <ThemedText style={[glStyles.buttonTextTheme, glStyles.textBold]}>Bottom Left</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.quadrant, styles.bottomRight]}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={[styles.logo, glStyles.imgFluid]}
            />
            <ThemedText style={[glStyles.buttonTextTheme, glStyles.textBold]}>Bottom Right</ThemedText>
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
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  quadrant: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '#DDD',
  },
  topLeft: {
    backgroundColor: '#FFC107',
  },
  topRight: {
    backgroundColor: '#03A9F4',
  },
  bottomLeft: {
    backgroundColor: '#4CAF50',
  },
  bottomRight: {
    backgroundColor: '#E91E63',
  },
  text: {
    color: '#fff',
    fontWeight: 600,
  },
  logo: {
    width: width * 0.5, // 50% of screen width
    height: height * 0.2, // 20% of screen height
  },
});
