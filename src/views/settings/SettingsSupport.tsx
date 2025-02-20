import React, { useState } from "react";
import { Text, View, TextInput, Alert } from "react-native";
import { NativeItem, NativeList, NativeText } from "@/components/Global/NativeComponents";
import Reanimated from "react-native-reanimated";
import ButtonCta from "src/components/FirstInstallation/ButtonCta";
import { LockKeyhole } from "lucide-react-native";
import { useTheme } from "@react-navigation/native";

const MemoizedNativeItem = React.memo(NativeItem);
const MemoizedNativeList = React.memo(NativeList);
const MemoizedNativeText = React.memo(NativeText);

const SettingsSupport = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const colors = useTheme().colors;

  const handleSubmit = async () => {
    if (!email || !subject || !description) {
      Alert.alert("Erreur", "Tous les champs doivent être remplis.");
      return;
    }

    const data = {
      email: email,
      title: subject,
      detail: description,
    };

    try {
      const response = await fetch("http://188.165.160.38:4000/api/v1/ticket/public/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Succès", "Votre demande a été envoyée avec succès.");
      } else {
        Alert.alert("Erreur", result.message || "Une erreur est survenue.");
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de contacter le serveur. Veuillez réessayer.");
    }
  };

  return (
    <Reanimated.ScrollView
      style={{
        padding: 16,
        paddingTop: 0,
      }}
    >
      <NativeList inline animated>
        <View
          style={{
            backgroundColor: "#762424",
            height: 120,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 56,
            }}
          >
            ⁉️
          </Text>
        </View>
        <NativeItem animated>
          <NativeText variant="title">Un problème, une question ?</NativeText>
          <NativeText variant="subtitle">
            Des problèmes sur Papillon ? Des questions par rapport à l'application ? Nous vous répondrons dans les plus brefs délais !
          </NativeText>
        </NativeItem>
      </NativeList>

      <MemoizedNativeList style={{ marginTop: 40, flex: 1 }}>
        <MemoizedNativeItem>
          <MemoizedNativeText variant="subtitle" numberOfLines={1}>
            Adresse e-mail
          </MemoizedNativeText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Ton adresse e-mail"
            placeholderTextColor={colors.text + "55"}
            style={{
              fontFamily: "medium",
              fontSize: 16,
              color: colors.text,
            }}
          />
        </MemoizedNativeItem>
      </MemoizedNativeList>

      <MemoizedNativeList style={{ marginTop: 16, flex: 1 }}>
        <MemoizedNativeItem>
          <MemoizedNativeText variant="subtitle" numberOfLines={1}>
            Sujet
          </MemoizedNativeText>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            placeholder="Sujet de ton problème"
            placeholderTextColor={colors.text + "55"}
            style={{
              fontFamily: "medium",
              fontSize: 16,
              color: colors.text,
            }}
          />
        </MemoizedNativeItem>
      </MemoizedNativeList>

      <MemoizedNativeList style={{ marginTop: 16, flex: 1 }}>
        <MemoizedNativeItem>
          <MemoizedNativeText variant="subtitle" numberOfLines={1}>
            Description
          </MemoizedNativeText>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Décris ton problème"
            placeholderTextColor={colors.text + "55"}
            style={{
              fontFamily: "medium",
              fontSize: 16,
              color: colors.text,
            }}
          />
        </MemoizedNativeItem>
      </MemoizedNativeList>

      <View style={{ alignItems: "center", marginTop: 42 }}>
        <LockKeyhole size={25} color="gray" />
        <NativeText variant="subtitle" style={{ textAlign: "center", marginTop: 10, maxWidth: 330, fontSize: 14 }}>
          En appuyant sur "Envoyer au support", vous acceptez que les données que vous nous fournissez soient transmises à notre équipe afin de traiter votre demande.
        </NativeText>
      </View>

      <ButtonCta
        primary
        value="Envoyer au support"
        onPress={handleSubmit}
        style={{
          marginTop: 24,
        }}
      />
    </Reanimated.ScrollView>
  );
};

export default SettingsSupport;
