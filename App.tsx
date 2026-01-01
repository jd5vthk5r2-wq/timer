import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

// --- ナビゲーション設定 ---
import AppNavigator from "./src/navigation/AppNavigator";
// --- 通知権限リクエスト関数のインポート ---
import { requestNotificationPermission } from "./src/utils/notification";

export default function App() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
