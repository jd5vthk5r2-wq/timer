import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RoutineList from "../components/RoutineList";
import TimerExeScreen from "../components/TimerExeScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RoutineList">
        <Stack.Screen
          name="RoutineList"
          component={RoutineList}
          options={{ title: "ルーティン一覧" }}
        />
        <Stack.Screen
          name="TimerExe"
          component={TimerExeScreen}
          options={{ title: "実行画面", headerBackTitle: "戻る" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
