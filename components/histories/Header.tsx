import React from "react";
import { Text, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { styles as glStyles } from "@/assets/styles";

interface InputProps {
  title: string;
  description: string;
  customStyles?: object;
}

const Header = ({ title, description, customStyles = {} }: InputProps) => {
  return (
    <ThemedView style={[styles.container, customStyles]}>
      <Text style={[glStyles.textCenter, glStyles.buttonTextTheme, styles.title]}>
        {title}
      </Text>
      <Text
        style={[glStyles.textCenter, glStyles.buttonTextTheme, styles.subtitle]}
      >
        {description}
      </Text>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 37,
  },
  subtitle: {
    fontSize: 20,
  },
});

export default Header;
