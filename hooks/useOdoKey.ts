/**
 * useOdoKey.ts — هوك الاتصال بسيرفر OdoKey
 * يشفر بيانات OBD بـ AES-256 ويرفعها كـ JSON
 * السيرفر: http://192.168.8.151:3001
 *
 * ملاحظة: نستخدم expo-crypto لتوليد IV عشوائي آمن
 * بدلاً من CryptoJS.lib.WordArray.random() التي تفشل في Hermes/Native
 */

import { useState } from 'react';
import CryptoJS from 'crypto-js';
import * as ExpoCrypto from 'expo-crypto';

// ─── إعدادات السيرفر ─────────────────────────────────────────────────────────
const ODOKEY_BASE_URL = 'http://192.168.8.151:3001';
const UPLOAD_URL = `${ODOKEY_BASE_URL}/api/files/upload`;

// مفتاح AES-256 ثابت (32 بايت = 256 بت)
const AES_SECRET_KEY = 'OdoSeal-AES256-SecretKey-32Bytes!';

// ─── أنواع البيانات ───────────────────────────────────────────────────────────
export interface OBDData {
  deviceId: string;
  rpm: number;
  distance: number;
  timestamp?: string;
  [key: string]: unknown;
}

export interface VaultFile {
  cid: string;
  name: string;
  size: number;
  created_at: string;
}

// ─── دالة توليد IV عشوائي آمن باستخدام expo-crypto ──────────────────────────
async function generateSecureIV(): Promise<CryptoJS.lib.WordArray> {
  // نولد 16 بايت عشوائي آمن عبر expo-crypto
  const randomBytes = await ExpoCrypto.getRandomBytesAsync(16);
  // نحوله إلى WordArray يفهمه CryptoJS
  const words: number[] = [];
  for (let i = 0; i < randomBytes.length; i += 4) {
    words.push(
      ((randomBytes[i] || 0) << 24) |
      ((randomBytes[i + 1] || 0) << 16) |
      ((randomBytes[i + 2] || 0) << 8) |
      (randomBytes[i + 3] || 0)
    );
  }
  return CryptoJS.lib.WordArray.create(words, 16);
}

// ─── دالة التشفير AES-256 ────────────────────────────────────────────────────
async function encryptAES256(data: object): Promise<{ encryptedData: string; iv: string }> {
  const iv = await generateSecureIV();
  const key = CryptoJS.enc.Utf8.parse(AES_SECRET_KEY);
  const plaintext = JSON.stringify(data);

  const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    encryptedData: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
    iv: iv.toString(CryptoJS.enc.Base64),
  };
}

// ─── الهوك الرئيسي ───────────────────────────────────────────────────────────
export function useOdoKey() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);
  const [loadingVault, setLoadingVault] = useState(false);
  const [vaultError, setVaultError] = useState<string | null>(null);

  /**
   * تشفير بيانات OBD ورفعها إلى الخزنة
   * @returns CID الملف المرفوع أو null عند الفشل
   */
  const sealOBDData = async (data: OBDData): Promise<string | null> => {
    setUploading(true);
    setUploadError(null);

    try {
      // 1. تشفير البيانات باستخدام IV آمن من expo-crypto
      const { encryptedData, iv } = await encryptAES256(data);

      // 2. إنشاء اسم الملف
      const filename = `obd_${data.deviceId}_${Date.now()}.enc`;

      // 3. إرسال JSON إلى السيرفر
      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          filename,
          encryptedData,
          iv,
          deviceId: data.deviceId,
          timestamp: data.timestamp ?? new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }

      const result = await response.json();

      // السيرفر يرجع { success: true, cid: "..." } أو { cid: "..." }
      const cid: string = result.cid ?? result.id ?? result.hash ?? filename;
      return cid;

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ غير معروف';
      setUploadError(msg);
      console.error('[useOdoKey] sealOBDData error:', msg);
      return null;
    } finally {
      setUploading(false);
    }
  };

  /**
   * جلب قائمة الملفات من الخزنة
   */
  const fetchVaultFiles = async (): Promise<void> => {
    setLoadingVault(true);
    setVaultError(null);

    try {
      const response = await fetch(`${ODOKEY_BASE_URL}/api/files`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      // السيرفر يرجع مصفوفة أو { files: [...] }
      const files: VaultFile[] = Array.isArray(data) ? data : (data.files ?? []);
      setVaultFiles(files);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشل الاتصال بالخزنة';
      setVaultError(msg);
      console.error('[useOdoKey] fetchVaultFiles error:', msg);
    } finally {
      setLoadingVault(false);
    }
  };

  return {
    sealOBDData,
    uploading,
    uploadError,
    fetchVaultFiles,
    vaultFiles,
    loadingVault,
    vaultError,
    ODOKEY_BASE_URL,
  };
}
