/**
 * explore.tsx — شاشة الخزنة (Vault)
 * تعرض قائمة الملفات المشفرة المخزنة في سيرفر OdoKey
 */

import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from "react-native";
import { useOdoKey, VaultFile } from "@/hooks/useOdoKey";

// ─── مكوّن بطاقة الملف ──────────────────────────────────────────────────────
function FileCard({ file, baseUrl }: { file: VaultFile; baseUrl: string }) {
  const formattedDate = new Date(file.created_at).toLocaleString("ar-KW", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedSize =
    file.size < 1024
      ? `${file.size} B`
      : file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(1)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

  const handleDownload = () => {
    const url = `${baseUrl}/api/files/${file.cid}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.card}>
      {/* أيقونة + اسم الملف */}
      <View style={styles.cardHeader}>
        <Text style={styles.fileIcon}>🔒</Text>
        <Text style={styles.fileName} numberOfLines={1}>
          {file.name}
        </Text>
      </View>

      {/* تفاصيل */}
      <View style={styles.cardDetails}>
        <Text style={styles.detailText}>📅 {formattedDate}</Text>
        <Text style={styles.detailText}>📦 {formattedSize}</Text>
      </View>

      {/* CID مختصر */}
      <Text style={styles.cidText} numberOfLines={1}>
        CID: {file.cid}
      </Text>

      {/* زر تحميل */}
      <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
        <Text style={styles.downloadBtnText}>⬇️ تحميل وفك التشفير</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── الشاشة الرئيسية ────────────────────────────────────────────────────────
export default function VaultScreen() {
  const { fetchVaultFiles, vaultFiles, loadingVault, vaultError, ODOKEY_BASE_URL } =
    useOdoKey();

  // جلب الملفات عند فتح الشاشة
  useEffect(() => {
    fetchVaultFiles();
  }, []);

  const onRefresh = useCallback(() => {
    fetchVaultFiles();
  }, []);

  // ─── حالة التحميل ─────────────────────────────────────────────────────────
  if (loadingVault && vaultFiles.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>جاري جلب الملفات من الخزنة...</Text>
      </View>
    );
  }

  // ─── حالة الخطأ ───────────────────────────────────────────────────────────
  if (vaultError && vaultFiles.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>فشل الاتصال بالخزنة</Text>
        <Text style={styles.errorDetail}>{vaultError}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchVaultFiles}>
          <Text style={styles.retryBtnText}>إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── القائمة الرئيسية ─────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* رأس الصفحة */}
      <View style={styles.header}>
        <Text style={styles.title}>🗄️ الخزنة الآمنة</Text>
        <Text style={styles.subtitle}>
          {vaultFiles.length > 0
            ? `${vaultFiles.length} ملف مشفر`
            : "لا توجد ملفات بعد"}
        </Text>
        <Text style={styles.serverInfo}>
          🌐 {ODOKEY_BASE_URL}
        </Text>
      </View>

      {/* قائمة الملفات */}
      <FlatList
        data={vaultFiles}
        keyExtractor={(item) => item.cid}
        renderItem={({ item }) => (
          <FileCard file={item} baseUrl={ODOKEY_BASE_URL} />
        )}
        contentContainerStyle={
          vaultFiles.length === 0 ? styles.emptyContainer : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={loadingVault}
            onRefresh={onRefresh}
            tintColor="#7c3aed"
            colors={["#7c3aed"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>الخزنة فارغة</Text>
            <Text style={styles.emptySubText}>
              استخدم زر "تأمين البيانات" في الشاشة الرئيسية لرفع بيانات OBD
            </Text>
          </View>
        }
      />
    </View>
  );
}

// ─── الأنماط ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a",
  },
  centered: {
    flex: 1,
    backgroundColor: "#0f0f1a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  // ─── رأس الصفحة ───────────────────────────────────────────────────────────
  header: {
    backgroundColor: "#1a1a2e",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a4a",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#7c3aed",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#a0a0c0",
    textAlign: "center",
    marginTop: 4,
  },
  serverInfo: {
    fontSize: 11,
    color: "#555580",
    textAlign: "center",
    marginTop: 6,
  },
  // ─── القائمة ──────────────────────────────────────────────────────────────
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
  },
  // ─── بطاقة الملف ──────────────────────────────────────────────────────────
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fileIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  fileName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#e0e0ff",
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 12,
    color: "#8080a0",
  },
  cidText: {
    fontSize: 10,
    color: "#505070",
    fontFamily: "monospace",
    marginBottom: 10,
  },
  downloadBtn: {
    backgroundColor: "#7c3aed",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  downloadBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  // ─── حالة الخطأ ───────────────────────────────────────────────────────────
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 18,
    color: "#ff6b6b",
    fontWeight: "bold",
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 13,
    color: "#a0a0c0",
    textAlign: "center",
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  // ─── حالة الفراغ ──────────────────────────────────────────────────────────
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    color: "#7c3aed",
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#6060a0",
    textAlign: "center",
    lineHeight: 22,
  },
  // ─── التحميل ──────────────────────────────────────────────────────────────
  loadingText: {
    color: "#a0a0c0",
    marginTop: 16,
    fontSize: 14,
  },
});
