import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import * as ImageManipulator from "expo-image-manipulator";
import * as Speech from "expo-speech";
import BaseFaunaLog from "../../components/baseFaunaLog/baseFaunaLog";

type AnimalPrediction = {
  animal: string;
  display_name: string;
  scientific_name: string;
  confidence: number;
  best_reference: string;
  data: {
    image: string | null;
    description: string;
    source: string | null;
  };
  top_results: {
    animal: string;
    display_name: string;
    scientific_name: string;
    confidence: number;
    best_reference: string;
  }[];
};

export default function OpenFaunaLogScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<AnimalPrediction | null>(null);
  const [showResult, setShowResult] = useState(false);

  const close = useSharedValue(1);

  const coverAnimatedStyle = useAnimatedStyle(() => {
    return {
      transformOrigin: "left center",
      transform: [
        { perspective: 1400 },
        { translateX: close.value * -240 },
        { rotateY: `${close.value * -85}deg` },
        { scaleX: 1 - close.value * 0.05 },
      ],
      opacity: 1 - close.value * 0.15,
    };
  });

  const closeFaunaLog = () => {
    Speech.stop();

    close.value = withTiming(0, { duration: 500 }, (finished) => {
      if (finished) {
        runOnJS(router.replace)("/");
      }
    });
  };

  useEffect(() => {
    if (!prediction) return;

    const text = `
      Animal identificado: ${prediction.display_name}.
      Nome científico: ${prediction.scientific_name}.
      Confiança da identificação: ${Math.round(prediction.confidence * 100)} por cento.
      ${prediction.data.description}
    `;

    Speech.stop();

    Speech.speak(text, {
      language: "pt-BR",
      rate: 1.0,
      pitch: 0.9,
    });
  }, [prediction]);

  const API_URL = "http://192.168.0.111:8000/predict";

  async function sendImageToApi(imageUri: string) {
    const formData = new FormData();

    formData.append("file", {
      uri: imageUri,
      name: "animal.jpg",
      type: "image/jpeg",
    } as any);

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erro ao consultar API.");
    }

    return response.json();
  }

  async function identifyAnimal() {
    try {
      setLoading(true);
      Speech.stop();

      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.5,
        skipProcessing: true,
      });

      if (!photo?.uri) return;

      const resizedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 320 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      const result = await sendImageToApi(resizedPhoto.uri);

      console.log(JSON.stringify(result, null, 2));

      setPrediction(result);
      setShowResult(true);
    } catch (error) {
      console.log("Erro ao identificar animal:", error);
    } finally {
      setLoading(false);
    }
  }

  function resetFaunaLog() {
    Speech.stop();
    setPrediction(null);
    setShowResult(false);
  }

  if (!permission) {
    return <View />;
  }

  const confidencePercent = prediction
    ? Math.round(prediction.confidence * 100)
    : null;

  return (
    <BaseFaunaLog>
      <View style={styles.openArea}>
        <View style={styles.cameraBox}>
          {showResult && prediction?.data.image ? (
            <Image
              key={prediction.data.image}
              source={{
                uri: prediction.data.image,
                headers: {
                  "User-Agent": "FaunaLog/1.0",
                },
              }}
              style={styles.animalImage}
              resizeMode="contain"
              onLoad={() => console.log("Imagem carregada")}
              onError={(error) => {
                console.log("Erro ao carregar imagem:", error.nativeEvent);
              }}
            />
          ) : permission.granted ? (
            <CameraView ref={cameraRef} style={styles.camera} facing="back" />
          ) : (
            <Pressable
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <Text style={styles.permissionText}>Permitir câmera</Text>
            </Pressable>
          )}
        </View>

        <Pressable
          style={styles.scanButton}
          onPress={showResult ? resetFaunaLog : identifyAnimal}
          disabled={loading}
        >
          <Text style={styles.scanButtonText}>
            {loading
              ? "Analisando..."
              : showResult
                ? "Novo Animal"
                : "Identificar"}
          </Text>
        </Pressable>

        <View style={styles.dataBox}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Quem é esse animal?</Text>

            <Text style={styles.info}>
              Nome popular: {prediction?.display_name ?? "---"}
            </Text>

            <Text style={styles.info}>
              Nome científico: {prediction?.scientific_name ?? "---"}
            </Text>

            <Text style={styles.info}>
              Confiança:{" "}
              {confidencePercent !== null ? `${confidencePercent}%` : "---"}
            </Text>

            <Text style={styles.description}>
              {prediction?.data.description ?? "Aguardando registro..."}
            </Text>

            {prediction?.top_results?.length ? (
              <View style={styles.topResultsBox}>
                <Text style={styles.subtitle}>Possíveis resultados:</Text>

                {prediction.top_results.map((item, index) => (
                  <Text key={item.animal} style={styles.topResult}>
                    {index + 1}. {item.display_name} ({item.scientific_name}) -{" "}
                    {Math.round(item.confidence * 100)}%
                  </Text>
                ))}
              </View>
            ) : null}

            {prediction?.data.source ? (
              <Text style={styles.source}>Fonte: Wikipédia</Text>
            ) : null}
          </ScrollView>
        </View>

        <Pressable style={styles.closeButton} onPress={closeFaunaLog}>
          <Text style={styles.closeButtonText}>×</Text>
        </Pressable>
      </View>

      <Animated.View style={[styles.cover, coverAnimatedStyle]}>
        <View style={styles.topCurve} />
        <View style={styles.openButton} />
        <View style={styles.speaker} />
      </Animated.View>
    </BaseFaunaLog>
  );
}

const styles = StyleSheet.create({
  openArea: {
    position: "absolute",
    left: 30,
    right: 20,
    top: 125,
    bottom: 20,
    backgroundColor: "#38c22c",
    borderWidth: 4,
    borderColor: "#000",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 16,
  },

  cameraBox: {
    flex: 1.1,
    backgroundColor: "#111",
    borderWidth: 8,
    borderColor: "#b9b9b9",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },

  camera: {
    flex: 1,
  },

  animalImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },

  permissionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },

  permissionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  scanButton: {
    backgroundColor: "#ffd500",
    borderWidth: 4,
    borderColor: "#000",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 10,
  },

  scanButtonText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 15,
  },

  dataBox: {
    flex: 1.15,
    backgroundColor: "#f1f1f1",
    borderWidth: 4,
    borderColor: "#000",
    borderRadius: 8,
    padding: 14,
    paddingRight: 68,
  },

  title: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 10,
    color: "#111",
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "900",
    marginTop: 10,
    marginBottom: 4,
    color: "#111",
  },

  info: {
    fontSize: 13,
    color: "#222",
    marginBottom: 4,
    fontWeight: "700",
  },

  description: {
    fontSize: 13,
    color: "#222",
    marginTop: 8,
    lineHeight: 18,
  },

  topResultsBox: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 2,
    borderTopColor: "#ccc",
  },

  topResult: {
    fontSize: 12,
    color: "#333",
    marginBottom: 3,
  },

  source: {
    fontSize: 11,
    color: "#555",
    marginTop: 10,
    fontStyle: "italic",
  },

  closeButton: {
    position: "absolute",
    right: 18,
    bottom: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ffd500",
    borderWidth: 4,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    margin: 10,
  },

  closeButtonText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#000",
    lineHeight: 38,
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
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
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