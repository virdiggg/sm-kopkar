import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";
import { Text } from "react-native-paper";
import { ThemedView } from "@/components/ThemedView";
import Header from "@/components/histories/Header";
import TotalAmount from "@/components/histories/TotalAmount";
import TableContent from "@/components/histories/TableContent"; // Adjusted to match updated logic
import { fetchWithRetry } from "@/services/fetching";
import { styles as glStyles } from "@/assets/styles";

const TYPE_HISTORY = "pinjaman";

export default function HistoryPinjamanScreen() {
  const [totalAmount, setTotalAmount] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [initialNext, setInitialNext] = useState<number>(0); // Initial "next" value for TableContent

  const fetchTotalAmount = async (): Promise<string | null> => {
    try {
      const response = await fetchWithRetry(`trx/total`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: TYPE_HISTORY,
        }),
      });

      if (!response || response.statusCode !== 200) {
        throw new Error(response?.message || "Failed to fetch total amount");
      }

      return response.data || "0";
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to fetch total amount");
      return null;
    }
  };

  const fetchApi = async (start: number): Promise<{ data: any[]; next: number }> => {
    try {
      const response = await fetchWithRetry(`trx/histories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start,
          type: TYPE_HISTORY,
        }),
      });

      if (!response || response.statusCode !== 200) {
        throw new Error(response?.message || "Failed to fetch data");
      }

      return { data: response.data, next: response.next || 0 };
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to fetch data");
      return { data: [], next: 0 };
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const total = await fetchTotalAmount();
      setTotalAmount(total);

      // Fetch initial data to determine the first "next"
      const initialData = await fetchApi(0);
      setInitialNext(initialData.next); // Pass to TableContent as the initial "next" value
    };

    loadInitialData();
  }, []);

  const goBack = () => {
    router.back();
  };

  return (
    <ThemedView style={glStyles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={goBack}>
              <Text style={[glStyles.buttonTextTheme, { paddingHorizontal: 10 }]}>Back</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Header title="History" description="Pinjaman" customStyles={{ marginBottom: 20 }} />

      <TotalAmount
        total={totalAmount || "Loading..."}
        description="Total Pinjaman"
        customStyles={{ marginBottom: 20 }}
      />

      {/* Pass fetchApi and initialNext to TableContent */}
      <TableContent fetchApi={fetchApi} next={initialNext} customStyles={{ paddingBottom: 50 }} />

      {errorMsg && (
        <Text style={[glStyles.textDanger, { textAlign: "center", marginTop: 10 }]}>
          {errorMsg}
        </Text>
      )}
    </ThemedView>
  );
}
