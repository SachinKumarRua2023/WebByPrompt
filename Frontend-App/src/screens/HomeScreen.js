import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>WebByPrompt</Text>
        <Text style={styles.subtitle}>AI-Powered Prompt Generator</Text>
      </View>

      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Features</Text>
        
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Smart Prompt Generation</Text>
          <Text style={styles.featureDesc}>AI-powered prompts with full project understanding</Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Tech Stack Suggestions</Text>
          <Text style={styles.featureDesc}>Get recommendations for the best technologies</Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>API Integration Guidance</Text>
          <Text style={styles.featureDesc}>Comprehensive API usage instructions</Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Environment Setup</Text>
          <Text style={styles.featureDesc}>Step-by-step environment configuration</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Prompts')}
      >
        <Text style={styles.buttonText}>Browse Prompts</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3b82f6',
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#dbeafe',
    marginTop: 5,
  },
  features: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1f2937',
  },
  featureCard: {
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
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 5,
  },
  featureDesc: {
    fontSize: 14,
    color: '#6b7280',
  },
  button: {
    backgroundColor: '#3b82f6',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
