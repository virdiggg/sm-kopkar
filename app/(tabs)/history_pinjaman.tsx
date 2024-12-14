import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";
import { Text } from "react-native-paper";
import { ThemedView } from "@/components/ThemedView";
import Header from "@/components/histories/Header";
import TotalAmount from "@/components/histories/TotalAmount";
import TableContent from "@/components/histories/TableContent";
import { fetchWithRetry } from "@/services/fetching";
import { styles as glStyles } from "@/assets/styles";

const LIMIT = 10;
const TYPE_HISTORY = "pinjaman";

export default function HistoryPinjamanScreen() {
  const [totalAmount, setTotalAmount] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const goBack = () => {
    router.back();
  };

  const fetchTotalAmount = async (): Promise<string | null> => {
    const response = await fetchWithRetry(`trx/total`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: TYPE_HISTORY,
      }),
    });

    if (response && response.statusCode !== 200) {
      setErrorMsg(response.message);
      return null;
    }

    return response.data || "0";
  };

  const fetchApi = async (currentPage: number): Promise<{ data: any[]; nextDraw: number }> => {
    const response = await fetchWithRetry(`trx/histories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start: currentPage,
        nextDraw: LIMIT,
        type: TYPE_HISTORY,
      }),
    });

    if (response && response.statusCode !== 200) {
      setErrorMsg(response.message);
      return {
        data: [],
        nextDraw: 0,
      };
    }

    return {
      data: response.data || [],
      nextDraw: response.nextDraw || 0,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [total, initialTableData] = await Promise.all([
          fetchTotalAmount(),
          fetchApi(0),
        ]);

        setTotalAmount(total);
      } catch (error) {
        setErrorMsg("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  return (
    <ThemedView style={glStyles.container}>
      {/* Stack Header */}
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

      {/* Header Component */}
      <Header
        title="History"
        description="Pinjaman"
        customStyles={{ marginBottom: 20 }}
      />

      {/* Total Amount Component */}
      <TotalAmount total={totalAmount || "Loading..."} description="Total Pinjaman" customStyles={{ marginBottom: 20 }} />

      {/* Table Content Component */}
      <TableContent fetchApi={fetchApi} limit={LIMIT} customStyles={{ paddingBottom: 50 }} />

      {/* Optional Error Message */}
      {errorMsg && (
        <Text style={[glStyles.textDanger, { textAlign: "center", marginTop: 10 }]}>
          {errorMsg}
        </Text>
      )}
    </ThemedView>
  );
}
