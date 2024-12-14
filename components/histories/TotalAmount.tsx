import React from "react";
import { Text, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
interface InputProps {
  total: string;
  customStyles?: object;
}

const TotalAmount = ({ total, customStyles = {} }: InputProps) => {
  return (
    <ThemedView style={[styles.totalAmount, customStyles]}>
      <Text style={styles.text}>Total Amount: Rp {total}</Text>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  totalAmount: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default TotalAmount;
