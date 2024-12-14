import React from "react";
import { Text, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { styles as glStyles } from "@/assets/styles";

interface InputProps {
  total: string;
  description: string;
  customStyles?: object;
}

const TotalAmount = ({ total, description, customStyles = {} }: InputProps) => {
  return (
    <ThemedView style={[styles.container, customStyles]}>
      <Text style={[glStyles.buttonTextTheme, styles.subtitle]}>{description}: Rp {total}</Text>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  subtitle: {
    fontSize: 20,
  },
});

export default TotalAmount;
