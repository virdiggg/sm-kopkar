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
  (start: number): Promise<{ data: any[]; next: number }>;
}

interface TableContentProps {
  fetchApi: FetchApi;
  next: number;
  customStyles?: any;
}

const TableContent: React.FC<TableContentProps> = ({
  fetchApi,
  next: initialNext,
  customStyles = {},
}) => {
  const [data, setData] = useState<any[]>([]);
  const [next, setNext] = useState<number>(initialNext);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async (reset = false) => {
    try {
      const start = reset ? 0 : next;
      const result = await fetchApi(start);

      if (result.data.length === 0) {
        setHasMore(false);
        return;
      }

      setData((prevData) => (reset ? result.data : [...prevData, ...result.data]));

      setNext(result.next);
      setHasMore(result.next > 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData(true);
    setIsRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    if (next % 10 !== 0) return;

    setIsLoadingMore(true);
    await loadData();
    setIsLoadingMore(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    let statusColor = 'gray';
    if (item.status === 'DISETUJUI') {
      statusColor = 'green';
    } else if (item.status === 'DITOLAK') {
      statusColor = 'red';
    }

    return (
      <View style={styles.wrapper}>
        <View style={[styles.row]}>
          <Text style={[styles.itemText, { alignItems: 'flex-start' }]}>
            {item.no_transaksi} - {''}
          </Text>
          <Text style={[styles.itemText, { color: statusColor, alignItems: 'flex-end' }]}>
            {item.status || ''}
          </Text>
        </View>
        <View style={[styles.row, styles.between]}>
          <Text style={[styles.amountText, { flex: 3, alignItems: 'flex-start' }]}>
            {item.jumlah} {"\n" + item.angsuran || ''}
          </Text>
          <Text style={[styles.dateText, { flex: 1, textAlign: 'right', alignItems: 'flex-end' }]}>
            {item.tanggal}
          </Text>
        </View>
        <View style={styles.separator} />
      </View>
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.no_transaksi}-${index}`}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        hasMore ? (
          isLoadingMore ? (
            <ActivityIndicator size="small" color="#000" />
          ) : null
        ) : (
          <Text style={styles.infoText}>No more data to load.</Text>
        )
      }
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      contentContainerStyle={[styles.table, customStyles]}
    />
  );
};

const styles = StyleSheet.create({
  table: {
    padding: 20,
  },
  wrapper: {
    marginVertical: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  between: {
    justifyContent: 'space-between'
  },
  itemText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  amountText: {
    fontSize: 16,
    color: 'green',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 5,
  },
  infoText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default TableContent;
