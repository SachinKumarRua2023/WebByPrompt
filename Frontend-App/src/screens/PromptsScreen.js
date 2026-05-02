import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';

// Mock data for the scaffold - replace with actual API calls
const MOCK_PROMPTS = [
  {
    id: 1,
    title: 'E-commerce Dashboard',
    category: 'web_developer',
    description: 'A comprehensive dashboard for managing e-commerce operations',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    title: 'ML Model API',
    category: 'ai_engineer',
    description: 'REST API for serving machine learning predictions',
    created_at: '2024-01-14T15:45:00Z',
  },
  {
    id: 3,
    title: 'Social Media App',
    category: 'mobile_developer',
    description: 'React Native app for social networking',
    created_at: '2024-01-13T09:20:00Z',
  },
];

const PromptsScreen = ({ navigation }) => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    // TODO: Replace with actual API call
    // const response = await api.get('/prompts/');
    setTimeout(() => {
      setPrompts(MOCK_PROMPTS);
      setLoading(false);
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrompts();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.category}>{item.category.replace('_', ' ').toUpperCase()}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
      <Text style={styles.cardDate}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Prompts</Text>
      <FlatList
        data={prompts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: '#fff',
  },
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default PromptsScreen;
