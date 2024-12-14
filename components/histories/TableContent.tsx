import React, { useState, useEffect } from "react";
import {
  FlatList,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  RefreshControl,
} from "react-native";

interface FetchApi {
  (currentPage: number): Promise<{ data: any[]; nextDraw: number }>;
}

interface TableContentProps {
  fetchApi: FetchApi;
  customStyles?: any;
}

const TableContent: React.FC<TableContentProps> = ({ fetchApi, customStyles = {} }) => {
  const [data, setData] = useState<any[]>([]); // Loaded data
  const [currentPage, setCurrentPage] = useState(0); // Tracks the current page
  const [nextDraw, setNextDraw] = useState(10); // Items remaining to draw
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Indicates if more data exists

  // Fetch data from API
  const loadData = async (reset = false) => {
    try {
      if (reset) {
        setCurrentPage(0);
        setNextDraw(10);
        setHasMore(true);
        setData([]);
      }

      const pageToFetch = reset ? 0 : currentPage;
      const result = await fetchApi(pageToFetch);

      // Update data
      setData((prevData) => (reset ? result.data : [...prevData, ...result.data]));
      setNextDraw(result.nextDraw);
      setHasMore(result.nextDraw > 0);

      // Increment the current page only if fetching is successful
      if (!reset) setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData(true); // Reset to initial data
    setIsRefreshing(false);
  };

  // Load more handler
  const handleLoadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    await loadData();
    setIsLoadingMore(false);
  };

  // Initial data load
  useEffect(() => {
    loadData();
  }, []);

  // Render item in FlatList
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemRow}>
      <Text>{item.name}</Text>
      <Text>{item.value}</Text>
    </View>
  );

  return (
    <>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          <>
            {isLoadingMore && <ActivityIndicator size="small" color="#000" />}
            {nextDraw < 10 && (
              <Text style={styles.infoText}>This is the last page.</Text>
            )}
          </>
        }
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={[styles.table, customStyles]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  table: {
    padding: 20,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  infoText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
    color: "#666",
  },
});

export default TableContent;
