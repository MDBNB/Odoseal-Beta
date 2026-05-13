/**
 * OdoSeal-Final — App.tsx
 * واجهة بنفسجية احترافية لإرسال وتأمين بيانات OBD2
 * بدون expo-router / expo-symbols / New Architecture
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useOdoKey } from './hooks/useOdoKey';

const OBD_SERVER_IP = '192.168.8.151';
const OBD_SERVER_PORT = '3001';

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [currentRpm, setCurrentRpm] = useState(712);
  const [currentDistance] = useState(65535);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { sealOBDData, uploading, uploadError } = useOdoKey();

  const addLog = (msg: string) => {
    setLogs(prev => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev]);
  };

  // ─── إرسال بيانات OBD إلى سيرفر المحاكاة ────────────────────────────────
  const sendOBDData = async (rpm: number, distance: number) => {
    try {
      const res = await fetch(`http://${OBD_SERVER_IP}:${OBD_SERVER_PORT}/obd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: 'KW902-FINAL-001', rpm, distance }),
      });
      const data = await res.json();
      if (data.success) addLog(`✅ RPM: ${rpm} — تم الإرسال`);
    } catch {
      addLog('❌ خطأ في الاتصال بسيرفر OBD');
    }
  };

  const startSimulation = () => {
    setConnected(true);
    addLog('🚗 بدأت المحاكاة');
    sendOBDData(712, currentDistance);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const rpm = Math.floor(Math.random() * 3000) + 500;
      setCurrentRpm(rpm);
      sendOBDData(rpm, currentDistance);
    }, 5000);
  };

  const stopSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setConnected(false);
    addLog('⏹️ توقفت المحاكاة');
  };

  // ─── تأمين البيانات: تشفير AES-256 ورفع إلى OdoKey ──────────────────────
  const handleSealData = async () => {
    addLog('🔐 جاري تشفير البيانات ورفعها إلى الخزنة...');
    const cid = await sealOBDData({
      deviceId: 'KW902-FINAL-001',
      rpm: currentRpm,
      distance: currentDistance,
      timestamp: new Date().toISOString(),
    });

    if (cid) {
      addLog(`🔒 تم التأمين! CID: ${cid.slice(0, 20)}...`);
      Alert.alert(
        '✅ تم التأمين بنجاح',
        `البيانات مشفرة ومخزنة في الخزنة.\n\nCID:\n${cid}`,
        [{ text: 'حسناً' }]
      );
    } else {
      const err = uploadError ?? 'فشل الرفع';
      addLog(`❌ فشل التأمين: ${err}`);
      Alert.alert('❌ فشل التأمين', err, [{ text: 'حسناً' }]);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1a" />

      <View style={styles.container}>
        {/* ─── الرأس ─────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.title}>🔐 OdoSeal Final</Text>
          <Text style={styles.subtitle}>نظام تأمين بيانات OBD2</Text>
        </View>

        {/* ─── بطاقة الحالة ──────────────────────────────────────────────── */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusDot}>{connected ? '🟢' : '🔴'}</Text>
            <Text style={styles.statusText}>
              {connected ? 'متصل — يرسل بيانات' : 'غير متصل'}
            </Text>
          </View>
          <View style={styles.rpmRow}>
            <Text style={styles.rpmLabel}>RPM الحالي</Text>
            <Text style={styles.rpmValue}>{currentRpm.toLocaleString()}</Text>
          </View>
          <View style={styles.rpmRow}>
            <Text style={styles.rpmLabel}>المسافة (km)</Text>
            <Text style={styles.rpmValue}>{currentDistance.toLocaleString()}</Text>
          </View>
        </View>

        {/* ─── الأزرار ───────────────────────────────────────────────────── */}
        <View style={styles.buttonsRow}>
          {!connected ? (
            <TouchableOpacity style={styles.btnStart} onPress={startSimulation}>
              <Text style={styles.btnText}>▶ ابدأ المحاكاة</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.btnStop} onPress={stopSimulation}>
              <Text style={styles.btnText}>⏹ إيقاف</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.btnSeal, uploading && styles.btnDisabled]}
            onPress={handleSealData}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>🔐 تأمين البيانات</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ─── سجل الأحداث ───────────────────────────────────────────────── */}
        <View style={styles.logsContainer}>
          <Text style={styles.logsTitle}>📋 سجل الأحداث</Text>
          <ScrollView style={styles.logsList} showsVerticalScrollIndicator={false}>
            {logs.length === 0 ? (
              <Text style={styles.emptyLog}>لا توجد أحداث بعد...</Text>
            ) : (
              logs.map((log, i) => (
                <Text key={String(i)} style={styles.logItem}>
                  {log}
                </Text>
              ))
            )}
          </ScrollView>
        </View>

        {/* ─── معلومات السيرفر ───────────────────────────────────────────── */}
        <Text style={styles.serverInfo}>
          🌐 OdoKey: https://odokey-server-production.up.railway.app
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0f0f1a',
  },
  // ─── الرأس ───────────────────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7c3aed',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: '#6060a0',
    marginTop: 4,
  },
  // ─── بطاقة الحالة ────────────────────────────────────────────────────────
  statusCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    fontSize: 18,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#e0e0ff',
    fontWeight: '600',
  },
  rpmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  rpmLabel: {
    fontSize: 13,
    color: '#8080a0',
  },
  rpmValue: {
    fontSize: 15,
    color: '#00d4ff',
    fontWeight: 'bold',
  },
  // ─── الأزرار ─────────────────────────────────────────────────────────────
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  btnStart: {
    flex: 1,
    backgroundColor: '#00d4ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnStop: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnSeal: {
    flex: 1,
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // ─── السجل ───────────────────────────────────────────────────────────────
  logsContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  logsTitle: {
    fontSize: 13,
    color: '#7c3aed',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logsList: {
    flex: 1,
  },
  logItem: {
    fontSize: 11,
    color: '#00ff88',
    marginVertical: 2,
    fontFamily: 'monospace',
  },
  emptyLog: {
    fontSize: 12,
    color: '#404060',
    textAlign: 'center',
    marginTop: 20,
  },
  // ─── معلومات السيرفر ─────────────────────────────────────────────────────
  serverInfo: {
    fontSize: 10,
    color: '#404060',
    textAlign: 'center',
    marginTop: 8,
  },
});
