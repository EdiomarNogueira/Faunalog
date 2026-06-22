import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import BaseFaunaLog from "../components/baseFaunaLog/baseFaunaLog";

export default function Home() {
  const open = useSharedValue(0);

  const coverAnimatedStyle = useAnimatedStyle(() => {
    return {
      transformOrigin: "left center",
      transform: [
        { perspective: 1400 },
        { translateX: open.value * -240 },
        { rotateY: `${open.value * -85}deg` },
        { scaleX: 1 - open.value * 0.05 },
      ],
      opacity: 1 - open.value * 0.15,
    };
  });

  const openFaunaLog = () => {
    open.value = withTiming(
      1,
      {
        duration: 500,
      },
      (finished) => {
        if (finished) {
          runOnJS(router.replace)("/faunalog");
        }
      }
    );
  };

  return (
    <Pressable style={styles.container} onPress={openFaunaLog}>
      <BaseFaunaLog>
        <View style={styles.previewPage}>
          <View style={styles.previewCameraBox} />

          <View style={styles.previewDataBox}>
            <View style={styles.previewTitleLine} />
            <View style={styles.previewLine} />
            <View style={styles.previewLine} />
            <View style={styles.previewLineSmall} />
            <View style={styles.previewLineLarge} />
          </View>

          <View style={styles.previewCloseButton} />
        </View>

        <Animated.View style={[styles.cover, coverAnimatedStyle]}>
          <View style={styles.topCurve} />
          <View style={styles.openButton} />
          <View style={styles.speaker} />
        </Animated.View>
      </BaseFaunaLog>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  

  previewPage: {
    position: "absolute",
    left: 30,
    right: 20,
    top: 125,
    bottom: 20,
    backgroundColor: "#38c22c",
    borderWidth: 4,
    borderColor: "#000",
    borderTopWidth: 4,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 16,
    zIndex: 10,
    backfaceVisibility: "hidden",
    elevation: 6,
  },

  previewCameraBox: {
    flex: 1.2,
    backgroundColor: "#111",
    borderWidth: 8,
    borderColor: "#b9b9b9",
    borderRadius: 8,
    marginBottom: 14,
  },

  previewDataBox: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderWidth: 4,
    borderColor: "#000",
    borderRadius: 8,
    padding: 14,
    paddingRight: 68,
  },

  previewTitleLine: {
    width: "80%",
    height: 18,
    backgroundColor: "#111",
    borderRadius: 6,
    marginBottom: 14,
  },

  previewLine: {
    width: "65%",
    height: 12,
    backgroundColor: "#333",
    borderRadius: 6,
    marginBottom: 8,
  },

  previewLineSmall: {
    width: "45%",
    height: 12,
    backgroundColor: "#333",
    borderRadius: 6,
    marginBottom: 8,
  },

  previewLineLarge: {
    width: "90%",
    height: 12,
    backgroundColor: "#333",
    borderRadius: 6,
  },

  previewCloseButton: {
    position: "absolute",
    right: 28,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ffd500",
    borderWidth: 4,
    borderColor: "#000",
    elevation: 8,
  },

  cover: {
    position: "absolute",
    left: 30,
    right: 20,
    top: 125,
    bottom: 20,
    backgroundColor: "#38c22c",
    borderWidth: 4,
    borderColor: "#000",
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 0,
    zIndex: 20,
    backfaceVisibility: "hidden",
    elevation: 12,
  },

  topCurve: {
    position: "absolute",
    left: 0,
    width: "100%",
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "#000",
    borderTopRightRadius: 120,
  },

  openButton: {
    position: "absolute",
    right: 35,
    top: "45%",
    width: 0,
    height: 0,
    borderTopWidth: 25,
    borderBottomWidth: 25,
    borderRightWidth: 40,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "#ffd500",
  },

  speaker: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    width: 180,
    height: 16,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#000",
  },
});