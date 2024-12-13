import React from "react";
import { Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { styles as glStyles } from "@/assets/styles";

interface HeaderProps {
  title: string;
  subtitle: string;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  containerStyle,
  titleStyle,
  subtitleStyle,
}) => {
  return (
    <ThemedView style={[headerStyles.container, containerStyle]}>
      <Text style={[glStyles.textCenter, glStyles.buttonTextTheme, headerStyles.title, titleStyle]}>
        {title}
      </Text>
      <Text
        style={[glStyles.textCenter, glStyles.buttonTextTheme, headerStyles.subtitle, subtitleStyle]}
      >
        {subtitle}
      </Text>
    </ThemedView>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 37,
  },
  subtitle: {
    paddingHorizontal: 10,
    fontSize: 20,
  },
});

export default Header;