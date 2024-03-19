import React from 'react';
import { View, TextInput, Text, Pressable, ImageBackground, StatusBar, StyleSheet, ActivityIndicator } from 'react-native';
import mock_response from '../response.json'; // Assuming the mock_response is still used for demonstration

// not current active, console log example. 
//useCurrentlocation work on this 
function useCurrentLocation() {
  console.log('Using current location...');
}

// not current active, console log example
function useMapPin() {
  console.log('Placing a pin on the map...');
}

// API call to find the parking
async function findParking(address, radius, setIsLoading, setIsOnMap, setResponseData, setIsError) {
  // Change display to emphasize loading (this function call can take a long time)
  setIsLoading(true);
  try {
    console.log(`Finding parking near "${address}" within radius of ${radius} meters.`);
    // Simulate API call
    const result = mock_response; // await axios.post('http://192.168.1.45:7001/park', params)
    setResponseData(result);
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
  // State Variables for address and radius
  const [address, setAddress] = React.useState('');
  const [radius, setRadius] = React.useState('');
  // State to display to user API processing request
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  
  // Input display (Both Input + Loading)
  return (
    <ImageBackground source={require('../assets/sample.jpeg')} style={styles.backgroundImage} blurRadius={3}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Find Parking</Text>
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
              placeholder="Radius in meters"
              placeholderTextColor="#6c757d"
            />
            <Pressable onPress={() => findParking(address, radius, setIsLoading, setIsOnMap, setResponseData, setIsError)} style={styles.button}>
              <Text style={styles.buttonText}>Find Parking</Text>
            </Pressable>
            {isError && <Text style={styles.errorText}>Unable to find parking. Please try again.</Text>}
          </>
        )}
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}

// Style Definitions for Input Display
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a translucent overlay
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
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
    opacity: 0.9, // Makes the input fields slightly translucent
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
});

export default InputDisplay;
