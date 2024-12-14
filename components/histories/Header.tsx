import React from "react";
import { Text, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";

interface InputProps {
  title: string;
  description: string;
  customStyles?: object;
}

const Header = ({ title, description, customStyles = {} }: InputProps) => {
  return (
    <ThemedView style={[styles.header, customStyles]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "#2e96b8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#ddd",
    textAlign: "center",
    marginTop: 10,
  },
});

export default Header;
