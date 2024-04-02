import React from 'react';
import { View, TextInput, Text, Pressable, ImageBackground, StatusBar, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import mock_response from '../response.json'; // Assuming the mock_response is still used for demonstration
import axios from 'axios';
import * as Location from 'expo-location';


function HelpModal({ isVisible, onClose }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.centeredModalView}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>How to Use This App</Text>
          <Text style={styles.modalText}>
            Enter an address and a radius to find parking spots near you.
          </Text>
          <Text style={styles.modalExample}>Example: 700 Commonwealth Ave, Boston, MA 02215</Text>
          <Text style={styles.modalText}>
            Press the "Find Parking" button to view spots on the map.
          </Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}>
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}


// API call to find the parking
async function findParking(address, radius, setIsLoading, setIsOnMap, setResponseData, setIsError) {
  // Change display to emphasize loading (this function call can take a long time)
  setIsLoading(true);
  try {
    console.log(`Finding parking near "${address}" within radius of ${radius} meters.`);
    // Simulate API call
    const params = {
      "address": address,
      "radius": parseInt(radius) * 0.000621371 // meter to mile convert
    }
    console.log(`Finding parking near "${address}" within radius of ${parseInt(radius) * 0.000621371} miles.`);
    const result = await axios.post('http://192.168.4.97:8000/park', params)
    setResponseData(result.data);
    setIsLoading(false);// end loading 
    setIsOnMap(true);// display map results 
  } catch (error) {
    console.error(error);
    setIsLoading(false);
    setIsError(true);
    setIsOnMap(false);// if there was an exception we should not display results
  }
}
// Input Display Component 
function InputDisplay({ setIsOnMap, setResponseData }) {
  const [address, setAddress] = React.useState('');
  const [radius, setRadius] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isHelpModalVisible, setIsHelpModalVisible] = React.useState(false); // State for help modal visibility
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    let reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (reverseGeocode.length > 0) {
      const { street, city, region, postalCode } = reverseGeocode[0];
      const formattedAddress = `${street}, ${city}, ${region} ${postalCode}`;
      setAddress(formattedAddress);
    }
  };

  return (
    <ImageBackground source={require('../assets/sample.jpeg')} style={styles.backgroundImage} blurRadius={3}>
      <View style={styles.overlay}>
        <Text style={styles.title}>WhereTo</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4ECCA3" />
        ) : (
          <>
            <TextInput
              onChangeText={setAddress}
              value={address}
              style={styles.input}
              placeholder="Enter Address"
              placeholderTextColor="#6c757d"
            />
            <TextInput
              onChangeText={text => setRadius(text.replace(/[^0-9]/g, ''))}
              value={radius}
              style={styles.input}
              keyboardType="numeric"
              placeholder="Radius in meters (25-200)"
              placeholderTextColor="#6c757d"
            />
            <Pressable onPress={getCurrentLocation} style={styles.button}>
              <Text style={styles.buttonText}>Use Current Location</Text>
            </Pressable>
            <Pressable onPress={() => findParking(address, radius, setIsLoading, setIsOnMap, setResponseData, setIsError)} style={styles.button}>
              <Text style={styles.buttonText}>Find Parking</Text>
            </Pressable>
            {isError && <Text style={styles.errorText}>Unable to find parking. Please try again.</Text>}
          </>
        )}
        <Pressable
          onPress={() => setIsHelpModalVisible(true)}
          style={styles.helpButton}>
          <Text style={styles.helpButtonText}>?</Text>
        </Pressable>
        <HelpModal
          isVisible={isHelpModalVisible}
          onClose={() => setIsHelpModalVisible(false)}
        />
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}

// Add styles for the help button and modal
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
    opacity: 0.9,
  },
  button: {
    width: '90%',
    backgroundColor: '#4ECCA3',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF0000',
    marginTop: 20,
  },
  // New styles for help modal and button
  helpButton: {
    position: 'absolute',
    right: 20,
    top: 50,
    backgroundColor: '#4ECCA3',
    borderRadius: 20,
    padding: 10,
  },
  helpButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  centeredModalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalExample: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
    color: '#007bff', // Example color for differentiation
    fontWeight: '500', // Slightly bolder than normal text for emphasis
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginTop: 15,
    borderRadius: 20,
    padding: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default InputDisplay;