import React, { useState, useEffect, useMemo } from "react";
import { View, FlatList, TouchableOpacity, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatTime } from "../utils/formatTime";
import { styles } from "../styles/styles";
import { sendLocalNotification } from "../utils/notification";
import { AppState } from "react-native";
function TimerExeScreen({ route }: { route: any }) {
  const { preset } = route.params;
  const initialTimes = useMemo(
    () => preset.tasks.map((t: any) => t.duration),
    [preset]
  );

  const [remainingTimes, setRemainingTimes] = useState<number[]>(initialTimes);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [nowTime, setNowTime] = useState(new Date());
  const [endTimeString, setEndTimeString] = useState("");
  const [appState, setAppState] = useState(AppState.currentState);
  const [lastBackgroundTime, setLastBackgroundTime] = useState<Date | null>(null);

  // 一時停止中の終了予定時刻のズレを計算するため、現在時刻を1秒ごとに更新
  useEffect(() => {
    const clock = setInterval(() => setNowTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  // AppState監視でバックグラウンド復帰時に経過時間分キャッチアップ
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.match(/active/) && nextAppState.match(/inactive|background/)) {
        // バックグラウンドに行く直前の時刻を記録
        setLastBackgroundTime(new Date());
      }
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        // フォアグラウンド復帰時
        if (lastBackgroundTime && isRunning) {
          const now = new Date();
          const diffSec = Math.floor((now.getTime() - lastBackgroundTime.getTime()) / 1000);
          if (diffSec > 0) {
            setRemainingTimes((prev) => {
              let next = [...prev];
              let idx = currentTaskIndex;
              let remain = diffSec;
              // 経過秒数分だけ残り時間を減らす（複数タスクまたぐ場合も考慮）
              while (remain > 0 && idx < next.length) {
                if (next[idx] > remain) {
                  next[idx] -= remain;
                  remain = 0;
                } else {
                  remain -= next[idx];
                  next[idx] = 0;
                  idx++;
                }
              }
              // タスクが終わった場合の処理
              if (idx !== currentTaskIndex) {
                setCurrentTaskIndex(idx);
                if (idx >= next.length) {
                  setIsRunning(false);
                  Alert.alert("完了", "すべてのタスクが終了しました！");
                }
              }
              return next;
            });
          }
        }
      }
      setAppState(nextAppState);
    });
    return () => subscription.remove();
  }, [appState, lastBackgroundTime, isRunning, currentTaskIndex]);

  // 終了予定時刻の計算ロジック
  useEffect(() => {
    // 現在進行中のタスクから最後までの残り秒数を合計
    const totalRemainingSeconds = remainingTimes
      .slice(currentTaskIndex)
      .reduce((sum, sec) => sum + sec, 0);

    // 現在時刻に残り秒数を足す
    const end = new Date(nowTime.getTime() + totalRemainingSeconds * 1000);
    const hh = String(end.getHours()).padStart(2, "0");
    const mm = String(end.getMinutes()).padStart(2, "0");
    setEndTimeString(`${hh}:${mm}`);
  }, [remainingTimes, currentTaskIndex, nowTime]);

  // カウントダウン処理
  useEffect(() => {
    if (!isRunning || currentTaskIndex >= remainingTimes.length) return;

    const timer = setInterval(() => {
      setRemainingTimes((prev) => {
        const next = [...prev];
        if (next[currentTaskIndex] > 0) {
          next[currentTaskIndex] -= 1;
          return next;
        } else {
          // 次のタスクへ自動移行
          // 通知を送信
          sendLocalNotification(preset.tasks[currentTaskIndex].taskTitle);
          if (currentTaskIndex < next.length - 1) {
            setCurrentTaskIndex((idx) => idx + 1);
          } else {
            setIsRunning(false);
            Alert.alert("完了", "すべてのタスクが終了しました！");
          }
          return next;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, currentTaskIndex]);

  // 手動完了ボタン
  const handleCompleteTask = () => {
    Alert.alert("タスク完了", "次のタスクに進みますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "次へ",
        onPress: () => {
          // 通知を送信
          sendLocalNotification(preset.tasks[currentTaskIndex].taskTitle);
          if (currentTaskIndex < remainingTimes.length - 1) {
            setCurrentTaskIndex((idx) => idx + 1);
          } else {
            setIsRunning(false);
            Alert.alert("終了", "すべてのタスクが完了しました。");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.routineName}>{preset.name}</Text>

        <FlatList
          data={preset.tasks}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.taskItem,
                index === currentTaskIndex
                  ? { borderColor: "#00b894", borderWidth: 2 }
                  : { opacity: index < currentTaskIndex ? 0.4 : 1 },
              ]}
            >
              <Text style={styles.taskTitle}>
                {item.taskTitle || "名称未設定"}
              </Text>
              <Text style={styles.timerBig}>
                {formatTime(remainingTimes[index])}
              </Text>

              {index === currentTaskIndex && (
                <View style={styles.taskActions}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: isRunning ? "#ff7675" : "#00b894" },
                    ]}
                    onPress={() => setIsRunning(!isRunning)}
                  >
                    <Text style={[styles.actionButtonText, { color: "#fff" }]}>
                      {isRunning ? "一時停止" : "▶ スタート"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: "#0984e3" },
                    ]}
                    onPress={handleCompleteTask}
                  >
                    <Text style={[styles.actionButtonText, { color: "#fff" }]}>
                      完了
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />

        <View style={styles.footerInfo}>
          <Text style={styles.endTimeLabel}>終了予定時刻</Text>
          <Text style={styles.endTimeValue}>{endTimeString}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
export default TimerExeScreen;
