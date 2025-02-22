import React, { useState } from "react";
import { Text, View, TextInput, Alert } from "react-native";
import { NativeItem, NativeList, NativeText } from "@/components/Global/NativeComponents";
import Reanimated from "react-native-reanimated";
import ButtonCta from "src/components/FirstInstallation/ButtonCta";
import { UsersRound } from "lucide-react-native";
import { useTheme, useNavigation } from "@react-navigation/native";
import { get_logs, Log } from "@/utils/logger/logger";

const MemoizedNativeItem = React.memo(NativeItem);
const MemoizedNativeList = React.memo(NativeList);
const MemoizedNativeText = React.memo(NativeText);

const SettingsSupport = () => {
  const navigation = useNavigation();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const colors = useTheme().colors;

  const handleSubmit = async () => {

    if (!email || !isValidEmail(email)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse e-mail valide.");
      return;
    }

    if (!subject || !description) {
      Alert.alert("Erreur", "Tous les champs doivent être remplis.");
      return;
    }

    try {
      const logs: Log[] = await get_logs();

      const formattedLogs = logs
        .filter((log) => log.type === "ERROR")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((log) => {
          if (!log.date) return `[${log.type}] ${log.message} (Date inconnue)`;
      
          const logDate = new Date(log.date);
          if (isNaN(logDate.getTime())) return `[${log.type}] ${log.message} (Date invalide)`;
      
          const now = new Date();
          let formattedDate;
      
          if (
            logDate.getDate() === now.getDate() &&
            logDate.getMonth() === now.getMonth() &&
            logDate.getFullYear() === now.getFullYear()
          ) {
            formattedDate = `Aujourd'hui à ${logDate.getHours().toString().padStart(2, "0")}:${logDate
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;
          } else if (
            logDate.getDate() === now.getDate() - 1 &&
            logDate.getMonth() === now.getMonth() &&
            logDate.getFullYear() === now.getFullYear()
          ) {
            formattedDate = `Hier à ${logDate.getHours().toString().padStart(2, "0")}:${logDate
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;
          } else {
            formattedDate = `Le ${logDate.getDate().toString().padStart(2, "0")}/${(logDate.getMonth() + 1)
              .toString()
              .padStart(2, "0")} à ${logDate.getHours().toString().padStart(2, "0")}:${logDate
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;
          }
      
          return `[${log.type}] ${log.message} (${formattedDate})`;
        })
        .slice(-15)
        .join("<br><br>");
      
      console.log(formattedLogs);
      
      const data = {
        email: email,
        title: subject,
        detail: `𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗱𝗲 𝗹'𝘂𝘁𝗶𝗹𝗶𝘀𝗮𝘁𝗲𝘂𝗿:<br>${description}<br><br><br>⬇️ 𝗘𝗿𝗿𝗲𝘂𝗿𝘀 𝗿𝗲́𝗰𝗲𝗻𝘁𝗲𝘀 𝗿𝗲𝗻𝗰𝗼𝗻𝘁𝗿𝗲́𝗲𝘀 𝗽𝗮𝗿 𝗹'𝘂𝘁𝗶𝗹𝗶𝘀𝗮𝘁𝗲𝘂𝗿 𝗱𝗮𝗻𝘀 𝗹'𝗮𝗽𝗽 ⬇️<br><br>${formattedLogs}`,
      };
  
      const response = await fetch("http://188.165.160.38:4000/api/v1/ticket/public/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        navigation.goBack();
        Alert.alert("Succès", "Votre message a bien été envoyé. Veuillez consulter régulièrement vos e-mails pour suivre la réponse.");
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
      <NativeList>
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
        <NativeItem>
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
        <UsersRound size={25} color="gray" />
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
