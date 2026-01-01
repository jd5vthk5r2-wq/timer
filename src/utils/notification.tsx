import * as Notifications from 'expo-notifications';

// 権限リクエスト
export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('通知の許可が必要です');
  }
}
  // 通知送信関数
  export async function sendLocalNotification(taskTitle: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "タスク完了",
        body: `${taskTitle || "名称未設定"} が完了しました！`,
      },
      trigger: null,
    });
  }