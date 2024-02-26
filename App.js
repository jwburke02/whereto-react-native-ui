import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Pressable, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
// Assuming temp.json is in your project's root
import result from './temp.json';

async function findParking(address, radius, setIsLoading, setMarkers) {
  console.log(`Attempting to find parking at address "${address}" with a radius of ${radius}...`);
  setIsLoading(true);
  // Simulate fetching data. Replace with your actual API call
  // const result = await axios.get(`http://your-api-endpoint/park/query?address=${address}&radius=${radius}`);
  console.log(JSON.stringify(result, null, 4));
  // Assuming result.data contains an array of parking spots, each with latitude and longitude
  setMarkers(result.data.map(spot => ({ latitude: spot.lat, longitude: spot.lon })));
  setIsLoading(false);
}

function App() {
  const [address, setAddress] = React.useState('');
  const [radius, setRadius] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOnMap, setIsOnMap] = React.useState(false);
  const [markers, setMarkers] = React.useState([]);

  return (
    <View style={styles.container}>
      {!isOnMap ? (
        <>
          <Text style={styles.title}>WhereTo</Text>
          {!isLoading ? (
            <>
              <TextInput onChangeText={setAddress} style={styles.input} placeholder='Address' />
              <TextInput onChangeText={(text) => setRadius(text)} style={styles.input} keyboardType='numeric' placeholder='Radius' />
              <Button onPress={() => {findParking(address, radius, setIsLoading, setMarkers); setIsOnMap(true);}} title='Find Parking' color='#000065' />
              <Pressable onPress={() => setIsOnMap(true)} style={styles.press}>
                <Text style={styles.press_text}>View Map</Text>
              </Pressable>
            </>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </>
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            {markers.map((marker, index) => (
              <Marker key={index} coordinate={marker} />
            ))}
          </MapView>
          <Pressable onPress={() => setIsOnMap(false)} style={styles.press}>
            <Text style={styles.press_text}>Back to Search</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  press: {
    marginTop: 16,
    backgroundColor: '#0000FF',
    padding: 10,
    borderRadius: 4,
  },
  press_text: {
    color: '#FFFFFF',
  },
  map: {
    width: '100%',
    height: '80%',
  },
});

export default App;
