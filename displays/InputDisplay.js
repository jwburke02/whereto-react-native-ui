import React, { useState, useRef } from 'react'; // Add useRef
import { View, TextInput, Text, Pressable, ImageBackground, StatusBar, StyleSheet, ActivityIndicator, Modal,TouchableWithoutFeedback, Keyboard } from 'react-native';
import mock_response from '../response.json'; // Assuming the mock_response is still used for demonstration
import axios from 'axios';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


const GOOGLE_PLACES_API_KEY = 'AIzaSyBg-pe_LHT7KSDfsddZCZcCzKggF8fHV5g';

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
function InputDisplay({ setIsOnMap, setResponseData }) {
  const [radius, setRadius] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isHelpModalVisible, setIsHelpModalVisible] = React.useState(false);
  const [address, setAddress] = useState('');


  const googlePlacesAutocompleteRef = useRef(null);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    let reverseGeocode = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    if (reverseGeocode.length > 0) {
      const { street, city, region, postalCode } = reverseGeocode[0];
      const formattedAddress = `${street}, ${city}, ${region} ${postalCode}`;
      googlePlacesAutocompleteRef.current?.setAddressText(formattedAddress);
    }
  };

  async function findParking(address, radius) {
    setIsLoading(true);
    try {
      const params = {
        "address": address,
        "radius": parseInt(radius) * 0.000621371 // meter to mile convert
      };
      const result = await axios.post('http://192.168.4.97:8000/park', params);
      setResponseData(result.data);
      setIsLoading(false);
      setIsOnMap(true);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsError(true);
      setIsOnMap(false);
    }
  }
  

  return (
    
    <ImageBackground source={require('../assets/sample.jpeg')} style={styles.backgroundImage} blurRadius={3}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.overlay}>
      <Text style={styles.title}>
        <Text style={{ color: 'white' }}>Where</Text>
        <Text style={{ color: '#38a681' }}>To</Text>
      </Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4ECCA3" />
        ) : (
          <>
            <GooglePlacesAutocomplete
          placeholder="Enter Address"
          ref={googlePlacesAutocompleteRef}
          onPress={(data, details = null) => {
            // Use this address to find parking when the button is pressed
            setAddress(data.description);
          }}
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'en',
          }}
          styles={{
            textInputContainer: styles.googlePlacesInputContainer,
            textInput: styles.googlePlacesInput,
            listView: styles.listView
            
          }}
          textInputProps={{
            placeholderTextColor: '#6c757d', // Your desired placeholder text color
          }}
        />
            <TextInput
              onChangeText={text => setRadius(text.replace(/[^0-9]/g, ''))}
              value={radius}
              style={styles.input}
              keyboardType="numeric"
              placeholder="Radius in meters (25-200)"
              placeholderTextColor="#6c757d"
            />
            <Pressable onPress={() => findParking(address, radius, setIsLoading, setIsOnMap, setResponseData, setIsError)} style={styles.buttonuser2}>
              <Text style={styles.buttonText1}>Find Parking</Text>
            </Pressable>
            <Pressable onPress={getCurrentLocation} style={styles.buttonuser1}>
              <Text style={styles.buttonText2}>Current Location</Text>
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
      </TouchableWithoutFeedback>
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
    justifyContent: 'flex-start', // Ensures content starts from the top
    paddingTop: 40,
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop:157,
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    zIndex: -1000,
    color: '#333333',
    marginVertical: 10,
    opacity: 0.9,
  },
  googlePlacesInputContainer: {
    width: '90%', // Ensure the container is wide enough
    backgroundColor: 'transparent',
    zIndex: 5,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  googlePlacesInput: {
    width: '90%',
    height: 50,
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333333',
    marginVertical: 10,
    opacity: 0.9,
  },
  listView: {
    position: 'absolute',
    top:65, // Adjust this value based on your layout
    width: '90%',
    borderRadius: 25,
    zIndex: 1000, // Ensure this is very high to bring in front
    backgroundColor: 'white',
    elevation: 3, // For Android to ensure the shadow and elevation
  },
  button: {
    width: '90%',
    backgroundColor: '#4ECCA3',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonuser1: {//current location button
    width: '45%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 25,
    zIndex: -1000, // Ensure this is very high to bring in front
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 300,
  },
  buttonuser2: {//find parking button 
    width: '45%',
    backgroundColor: '#38a681',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    zIndex: -1000,
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText1: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonText2: {
    color: '#38a681',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF0000',
    marginTop: -38,
    marginBottom: 20,
    
  },
  // New styles for help modal and button
  helpButton: {
    position: 'absolute',
    right: 20,
    top: 50,
    backgroundColor: '#38a681',
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