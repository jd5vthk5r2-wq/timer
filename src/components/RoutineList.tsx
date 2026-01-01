import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TimerPickerModal } from "react-native-timer-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatTime } from "../utils/formatTime";
import { durationToSeconds } from "../utils/durationToSeconds";
import { Task, Preset } from "../types";
import { styles } from "../styles/styles";

function RoutineList({ navigation }: { navigation: any }) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetModalVisible, setPresetModalVisible] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState("");
  const [editingPresetId, setEditingPresetId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTargetIndex, setPickerTargetIndex] = useState<number | null>(
    null
  );

  // 起動時に保存データを読み込み
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem("presets");
        if (json) setPresets(JSON.parse(json));
      } catch (e) {
        console.error("Load Error", e);
      }
    })();
  }, []);

  const saveAllPresets = async (newPresets: Preset[]) => {
    setPresets(newPresets);
    try {
      await AsyncStorage.setItem("presets", JSON.stringify(newPresets));
    } catch (e) {
      console.error("Save Error", e);
    }
  };

  const addEmptyTask = () => {
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        taskTitle: "",
        remainingTime: 0,
        durationString: "00:00:00",
      },
    ]);
  };

  const deleteSingleTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSavePreset = () => {
    const trimmedName = presetNameInput.trim();
    if (!trimmedName || tasks.length === 0) {
      Alert.alert("エラー", "名前とタスクを入力してください。");
      return;
    }

    let newPresets;
    const tasksToSave = tasks.map((t) => ({
      id: t.id,
      taskTitle: t.taskTitle,
      duration: t.remainingTime,
    }));

    if (editingPresetId !== null) {
      newPresets = presets.map((p) =>
        p.id === editingPresetId
          ? { ...p, name: trimmedName, tasks: tasksToSave }
          : p
      );
    } else {
      newPresets = [
        ...presets,
        { id: Date.now(), name: trimmedName, tasks: tasksToSave },
      ];
    }

    saveAllPresets(newPresets);
    closeModal();
  };

  const closeModal = () => {
    setPresetModalVisible(false);
    setPresetNameInput("");
    setEditingPresetId(null);
    setTasks([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.addPresetButton}
          onPress={() => {
            setPresetModalVisible(true);
            addEmptyTask();
          }}
        >
          <Text style={styles.addPresetButtonText}>
            ＋ ルーティンを新規作成
          </Text>
        </TouchableOpacity>

        <FlatList
          data={presets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.presetRow}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() =>
                  navigation.navigate("TimerExe", { preset: item })
                }
              >
                <Text style={styles.presetNameText}>{item.name}</Text>
              </TouchableOpacity>
              <View style={styles.presetActions}>
                <TouchableOpacity
                  onPress={() => {
                    setEditingPresetId(item.id);
                    setPresetNameInput(item.name);
                    setTasks(
                      item.tasks.map((t) => ({
                        id: t.id,
                        taskTitle: t.taskTitle,
                        remainingTime: t.duration,
                        durationString: formatTime(t.duration),
                      }))
                    );
                    setPresetModalVisible(true);
                  }}
                  style={styles.editPresetButton}
                >
                  <Text style={styles.editPresetText}>編集</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert("削除", `「${item.name}」を削除しますか？`, [
                      { text: "キャンセル" },
                      {
                        text: "削除",
                        style: "destructive",
                        onPress: () =>
                          saveAllPresets(
                            presets.filter((p) => p.id !== item.id)
                          ),
                      },
                    ]);
                  }}
                  style={styles.deletePresetButton}
                >
                  <Text style={styles.deletePresetText}>削除</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* --- ルーティン編集モーダル ---*/}
      <Modal visible={presetModalVisible} animationType="slide">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerRow}>
            <TextInput
              style={styles.routineNameInput}
              onChangeText={setPresetNameInput}
              value={presetNameInput}
              placeholder="ルーティン名を入力"
              placeholderTextColor="#8888889c"
            />
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item, index }) => (
              <View style={styles.taskItem}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <TextInput
                    style={[styles.taskTitle, { flex: 1 }]}
                    placeholder="タスク名（例：シャワー）"
                    placeholderTextColor="#8888889c"
                    value={item.taskTitle}
                    onChangeText={(txt) =>
                      setTasks(
                        tasks.map((t, i) =>
                          i === index ? { ...t, taskTitle: txt } : t
                        )
                      )
                    }
                  />
                  <TouchableOpacity onPress={() => deleteSingleTask(index)}>
                    <Text style={{ color: "#e74c3c", fontWeight: "600" }}>
                      削除
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setPickerTargetIndex(index);
                    setPickerVisible(true);
                  }}
                >
                  <Text style={styles.timerBig}>{item.durationString}</Text>
                </TouchableOpacity>
              </View>
            )}
            ListFooterComponent={
              <TouchableOpacity style={styles.addButton} onPress={addEmptyTask}>
                <Text style={styles.addButtonText}>＋ タスクを追加</Text>
              </TouchableOpacity>
            }
          />

          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleSavePreset}
          >
            <Text style={styles.modalButtonText}>ルーティンを保存</Text>
          </TouchableOpacity>

          <TimerPickerModal
            visible={pickerVisible}
            setIsVisible={setPickerVisible}
            onConfirm={(picked) => {
              if (pickerTargetIndex !== null) {
                const sec = durationToSeconds(picked);
                setTasks(
                  tasks.map((t, i) =>
                    i === pickerTargetIndex
                      ? {
                          ...t,
                          durationString: formatTime(sec),
                          remainingTime: sec,
                        }
                      : t
                  )
                );
              }
              setPickerVisible(false);
            }}
            onCancel={() => setPickerVisible(false)}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
export default RoutineList;
