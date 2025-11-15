import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [sites, setSites] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [inputs, setInputs] = useState({ name: '', url: '', username: '', password: '', email: '' });

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const storedSites = await AsyncStorage.getItem('sites');
      if (storedSites) {
        setSites(JSON.parse(storedSites));
      } else {
        // Default sites
        const defaultSites = [
          { id: '1', name: 'Google', url: 'https://www.google.com', username: '', password: '', email: '', lastLogin: null, streak: 0 },
          { id: '2', name: 'GitHub', url: 'https://github.com', username: '', password: '', email: '', lastLogin: null, streak: 0 },
        ];
        setSites(defaultSites);
        await AsyncStorage.setItem('sites', JSON.stringify(defaultSites));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveSites = async (newSites) => {
    setSites(newSites);
    await AsyncStorage.setItem('sites', JSON.stringify(newSites));
  };

  const openSite = async (site) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    let newStreak = site.streak;
    if (site.lastLogin) {
      const lastDate = new Date(site.lastLogin);
      const lastStr = lastDate.toISOString().split('T')[0];
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if (lastStr === yesterdayStr) {
        newStreak += 1;
      } else if (lastStr !== todayStr) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }
    const updatedSite = { ...site, lastLogin: today.toISOString(), streak: newStreak };
    const newSites = sites.map(s => s.id === site.id ? updatedSite : s);
    await saveSites(newSites);
    Linking.openURL(site.url);
  };

  const showCredentials = (site) => {
    Alert.alert(
      `${site.name} Credentials`,
      `Username: ${site.username}\nPassword: ${site.password}\nEmail: ${site.email}`,
      [{ text: 'OK' }]
    );
  };

  const openModal = (site = null) => {
    setEditingSite(site);
    setInputs(site ? { name: site.name, url: site.url, username: site.username, password: site.password, email: site.email } : { name: '', url: '', username: '', password: '', email: '' });
    setModalVisible(true);
  };

  const saveSite = () => {
    if (!inputs.name || !inputs.url) {
      Alert.alert('Error', 'Name and URL are required');
      return;
    }
    let newSites;
    if (editingSite) {
      newSites = sites.map(s => s.id === editingSite.id ? { ...s, ...inputs } : s);
    } else {
      const newId = Date.now().toString();
      newSites = [...sites, { id: newId, ...inputs, lastLogin: null, streak: 0 }];
    }
    saveSites(newSites);
    setModalVisible(false);
  };

  const deleteSite = (site) => {
    Alert.alert('Delete', `Delete ${site.name}?`, [
      { text: 'Cancel' },
      { text: 'Delete', onPress: () => saveSites(sites.filter(s => s.id !== site.id)) }
    ]);
  };

  const renderDashboardItem = ({ item }) => {
    const iconUri = `${new URL(item.url).origin}/favicon.ico`;
    const streakProgress = Math.min(item.streak / 7, 1);

    return (
      <View style={styles.siteContainer}>
        <TouchableOpacity style={styles.button} onPress={() => openSite(item)} onLongPress={() => showCredentials(item)}>
          <Image source={{ uri: iconUri }} style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.buttonText}>{item.name}</Text>
            <View style={styles.streakContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${streakProgress * 100}%` }]} />
                <Text style={styles.streakText}>Streak: {item.streak}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAdminItem = ({ item }) => (
    <View style={styles.adminContainer}>
      <View style={styles.adminCard}>
        <Text style={styles.adminCardText}>{item.name}</Text>
        <View style={styles.adminActions}>
          <TouchableOpacity style={styles.editButton} onPress={() => openModal(item)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteSite(item)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (isAdmin) {
    return (
      <View style={styles.adminContainer}>
        <View style={styles.adminOuterCard}>
          <Text style={styles.adminTitle}>Admin Panel</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => setIsAdmin(false)}>
            <Text style={styles.backText}>Back to Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
            <Text style={styles.addText}>Add Website</Text>
          </TouchableOpacity>
          <FlatList
            data={sites}
            renderItem={renderAdminItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
          />
        </View>
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modal}>
            <TextInput placeholder="Name" value={inputs.name} onChangeText={(text) => setInputs({ ...inputs, name: text })} style={styles.input} />
            <TextInput placeholder="URL" value={inputs.url} onChangeText={(text) => setInputs({ ...inputs, url: text })} style={styles.input} />
            <TextInput placeholder="Username" value={inputs.username} onChangeText={(text) => setInputs({ ...inputs, username: text })} style={styles.input} />
            <TextInput placeholder="Password" value={inputs.password} onChangeText={(text) => setInputs({ ...inputs, password: text })} style={styles.input} secureTextEntry />
            <TextInput placeholder="Email" value={inputs.email} onChangeText={(text) => setInputs({ ...inputs, email: text })} style={styles.input} />
            <TouchableOpacity style={styles.saveButton} onPress={saveSite}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.dashboardContainer}>
      <View style={styles.dashboardOuterCard}>
        <Text style={styles.dashboardTitle}>Daily Task 🔥</Text>
        <TouchableOpacity style={styles.adminButton} onPress={() => setIsAdmin(true)}>
          <Text style={styles.adminText}>Admin</Text>
        </TouchableOpacity>
        <FlatList
          data={sites}
          renderItem={renderDashboardItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  dashboardOuterCard: {
    backgroundColor: '#000000',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    width: '90%',
    alignItems: 'center',
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
    fontFamily: 'Helvetica',
  },
  adminButton: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  adminText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
  siteContainer: {
    margin: 5,
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: 'row',
    margin: 10,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Helvetica',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  backButton: {
    backgroundColor: '#d1d5db',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  backText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
  addButton: {
    backgroundColor: '#d1d5db',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  addText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
  adminContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  adminOuterCard: {
    backgroundColor: '#000000',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    width: '90%',
    alignItems: 'center',
  },
  adminTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
    fontFamily: 'Helvetica',
  },
  adminCardText: {
    fontSize: 18,
    color: '#000000',
    fontFamily: 'Helvetica',
    marginBottom: 10,
  },
  adminActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  editButton: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontFamily: 'Helvetica',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontFamily: 'Helvetica',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#6b7280',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: '#ffffff',
    backgroundColor: '#374151',
  },
  saveButton: {
    backgroundColor: '#d1d5db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
  cancelButton: {
    backgroundColor: '#d1d5db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
});