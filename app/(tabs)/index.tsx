import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useOdoKey } from "@/hooks/useOdoKey";

const SERVER_IP = "192.168.8.151"; // IP الكمبيوتر
const SERVER_PORT = "3000";

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [currentRpm, setCurrentRpm] = useState(712);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { sealOBDData, uploading, uploadError } = useOdoKey();

  const addLog = (msg: string) => {
    setLogs((prev) => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev]);
  };

  const sendData = async (rpm: number, distance: number) => {
    try {
      const response = await fetch(`http://${SERVER_IP}:${SERVER_PORT}/obd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: "KW902-BETA-001",
          rpm,
          distance,
        }),
      });
      const result = await response.json();
      if (result.success) {
        addLog(`✅ بيانات أُرسلت — RPM: ${rpm}`);
      }
    } catch (error) {
      addLog(`❌ خطأ في الإرسال`);
    }
  };

  const startTest = () => {
    setConnected(true);
    addLog("🚗 بدأ الاتصال بالسيرفر");
    // محاكاة بيانات OBD2
    const rpm0 = 712;
    setCurrentRpm(rpm0);
    sendData(rpm0, 65535);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const rpm = Math.floor(Math.random() * 3000) + 500;
      setCurrentRpm(rpm);
      sendData(rpm, 65535);
    }, 5000);
  };

  /**
   * تأمين البيانات: تشفير بيانات OBD الحالية ورفعها إلى خزنة OdoKey
   */
  const handleSealData = async () => {
    addLog("🔐 جاري تشفير البيانات ورفعها إلى الخزنة...");
    const cid = await sealOBDData({
      deviceId: "KW902-BETA-001",
      rpm: currentRpm,
      distance: 65535,
    });

    if (cid) {
      addLog(`🔒 تم التأمين بنجاح! CID: ${cid.slice(0, 16)}...`);
      Alert.alert(
        "✅ تم التأمين",
        `تم رفع البيانات المشفرة إلى الخزنة بنجاح.\n\nCID:\n${cid}`,
        [{ text: "حسناً" }]
      );
    } else {
      const errMsg = uploadError ?? "فشل الرفع";
      addLog(`❌ فشل التأمين: ${errMsg}`);
      Alert.alert("❌ فشل التأمين", errMsg, [{ text: "حسناً" }]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 OdoSeal Beta</Text>
      <Text style={styles.status}>
        {connected ? "🟢 متصل بالسيرفر" : "🔴 غير متصل"}
      </Text>

      {/* زر ابدأ الإرسال */}
      <TouchableOpacity style={styles.button} onPress={startTest}>
        <Text style={styles.buttonText}>ابدأ الإرسال</Text>
      </TouchableOpacity>

      {/* زر تأمين البيانات */}
      <TouchableOpacity
        style={[styles.button, styles.sealButton, uploading && styles.buttonDisabled]}
        onPress={handleSealData}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>🔐 تأمين البيانات</Text>
        )}
      </TouchableOpacity>

      <ScrollView style={styles.logs}>
        {logs.map((log, i) => (
          <Text key={i} style={styles.log}>
            {log}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1a1a2e" },
  title: { fontSize: 24, color: "#00d4ff", textAlign: "center", marginTop: 50 },
  status: { color: "#fff", textAlign: "center", margin: 10, fontSize: 16 },
  button: {
    backgroundColor: "#00d4ff",
    padding: 15,
    borderRadius: 10,
    margin: 10,
  },
  sealButton: {
    backgroundColor: "#7c3aed",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  logs: { flex: 1, marginTop: 10 },
  log: { color: "#00ff88", fontSize: 12, marginVertical: 2 },
});
