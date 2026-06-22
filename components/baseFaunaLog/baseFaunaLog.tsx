import { ReactNode, useEffect, useRef } from "react";
import {
  Animated as RNAnimated,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type FaunaLogProps = {
  children?: ReactNode;
  style?: ViewStyle;
};

export default function BaseFaunaLog({ children, style }: FaunaLogProps) {
  const light1 = useRef(new RNAnimated.Value(0)).current;
  const light2 = useRef(new RNAnimated.Value(0)).current;
  const light3 = useRef(new RNAnimated.Value(0)).current;
  const bigLight = useRef(new RNAnimated.Value(0)).current;

  const bigLightColor = bigLight.interpolate({
    inputRange: [0, 1],
    outputRange: ["#001a80", "#4fc3ff"],
  });

  useEffect(() => {
    const smallLights = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(light1, {
          toValue: 1,
          duration: 120,
          useNativeDriver: false,
        }),
        RNAnimated.delay(500),
        RNAnimated.timing(light1, {
          toValue: 0,
          duration: 120,
          useNativeDriver: false,
        }),

        RNAnimated.timing(light2, {
          toValue: 1,
          duration: 120,
          useNativeDriver: false,
        }),
        RNAnimated.delay(500),
        RNAnimated.timing(light2, {
          toValue: 0,
          duration: 120,
          useNativeDriver: false,
        }),

        RNAnimated.timing(light3, {
          toValue: 1,
          duration: 120,
          useNativeDriver: false,
        }),
        RNAnimated.delay(500),
        RNAnimated.timing(light3, {
          toValue: 0,
          duration: 120,
          useNativeDriver: false,
        }),

        RNAnimated.delay(250),
      ])
    );

    const bigBlink = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(bigLight, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        RNAnimated.timing(bigLight, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    );

    smallLights.start();
    bigBlink.start();

    return () => {
      smallLights.stop();
      bigBlink.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const light1Color = light1.interpolate({
    inputRange: [0, 1],
    outputRange: ["#000", "#00cc66"],
  });

  const light2Color = light2.interpolate({
    inputRange: [0, 1],
    outputRange: ["#000", "#fff"],
  });

  const light3Color = light3.interpolate({
    inputRange: [0, 1],
    outputRange: ["#000", "#ff4444"],
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.spine} />

      <RNAnimated.View style={styles.bigLens}>
        <RNAnimated.View
          style={[
            styles.bigLensInner,
            {
              backgroundColor: bigLightColor,
            },
          ]}
        />
      </RNAnimated.View>

      <View style={styles.lightsContainer}>
        <RNAnimated.View
          style={[styles.light, { backgroundColor: light1Color }]}
        />
        <RNAnimated.View
          style={[styles.light, { backgroundColor: light2Color }]}
        />
        <RNAnimated.View
          style={[styles.light, { backgroundColor: light3Color }]}
        />
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#38c22c",
  },

  spine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 30,
    backgroundColor: "#195714",
    borderRightWidth: 4,
    borderColor: "#000",
    zIndex: 50,
  },

  bigLens: {
    position: "absolute",
    top: 32,
    right: 25,
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 60,
  },

  bigLensInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#2f4cff",
  },

  lightsContainer: {
    position: "absolute",
    top: 55,
    left: "44%",
    flexDirection: "row",
    gap: 12,
    zIndex: 60,
  },

  light: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#000",
  },
});