import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },
  container: { flex: 1, padding: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  routineNameInput: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    marginTop: 10,
    color: "#2d3436",
  },
  closeButtonText: { color: "#0984e3", fontSize: 16, fontWeight: "600" },

  // プリセット一覧
  presetRow: {
    backgroundColor: "#00b894",
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  presetNameText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  presetActions: { flexDirection: "row", gap: 8 },
  editPresetButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  editPresetText: { color: "#fff", fontWeight: "600" },
  deletePresetButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deletePresetText: { color: "#fff", fontWeight: "600" },

  // タスクアイテム
  taskItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  taskTitle: { fontSize: 17, fontWeight: "600", color: "#252728ff" },
  timerBig: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2d3436",
    marginVertical: 10,
  },

  // ボタン類
  addButton: {
    padding: 16,
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#bdc3c7",
    borderRadius: 12,
    marginTop: 10,
  },
  addButtonText: { color: "#7f8c8d", fontWeight: "bold" },
  modalButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#00b894",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
  },
  modalButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  addPresetButton: {
    backgroundColor: "#0984e3",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  addPresetButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2d3436",
    textAlign: "center",
  },

  // 実行画面用
  routineName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 20,
    textAlign: "center",
  },
  taskActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  actionButtonText: { fontWeight: "bold", fontSize: 15 },

  // フッター（終了予定時刻）
  footerInfo: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  endTimeLabel: {
    fontSize: 14,
    color: "#636e72",
    fontWeight: "600",
    marginBottom: 5,
  },
  endTimeValue: { fontSize: 36, fontWeight: "bold", color: "#2d3436" },
});
