import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Pressable } from 'react-native';
import axios from 'axios';

async function findParking(address, radius, setIsLoading) {
  console.log(`Attempting to find parking at address "${address}" with a radius of ${radius}...`)
  // result = await axios.get(`http://10.0.0.249:5001/park/query_with_location_and_radius?address=${address}&radius=${radius}`)
  result = await axios.get('http://10.0.0.249:5001/park/query_mock_response')
  console.log(JSON.stringify(result.data, null, 4));
  setIsLoading(false)
}

function useCurrentLocation() {
  console.log("Attempting to use current location as input...")
}

function useMapPin() {
  console.log("Attempting to place a pin on the map for input...")
}

export default function App() {
  const [address, setAddress] = React.useState("")
  const [radius, setRadius] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)

  const [isOnMap, setIsOnMap] = React.useState(false)

  return (
    !isOnMap ? 
    <View style={styles.container}>
      <Text style={styles.title}>WhereTo</Text>
      {
        !isLoading ?
        <>
          <TextInput onChangeText={setAddress} style={styles.input} placeholder='Address' />
          <TextInput onChangeText={setRadius} style={styles.input} keyboardType='numeric' placeholder='Radius' />
          <View style={styles.input_row} >
            <Pressable onPress={()=>useCurrentLocation()} style={styles.press}>
              <Text style={styles.press_text}>Use Current Location</Text>
            </Pressable>
            <Pressable onPress={()=>useMapPin()} style={styles.press}>
              <Text style={styles.press_text}>Pin a Location</Text>
            </Pressable>
          </View>
          <Button onPress={()=>{setIsLoading(true); findParking(address, radius, setIsLoading)}} title='Find Parking' color='#000065'/>
        </>
        :
        <>
          <Text>Please wait while your Parking is found...</Text>
        </>
      }
      <StatusBar style="auto" />
    </View> 
    : 
    <View style={styles.container}>
      <Text style={styles.title}>WhereTo</Text>
      <StatusBar style="auto" />
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
    fontSize: 64,
    color: '#000065'
  },
  input_row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 312,
    height: 32,
    marginTop: 8,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: '#898989',
    borderRadius: 5,
    backgroundColor: "#EFEFEF",
    paddingLeft: 4,
  },
  press: {
    marginTop: 16,
    marginLeft: 4,
    marginBottom: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0000FF',
    padding: 4,
    borderRadius: 4,
    borderColor: '#0000AB',
    borderWidth: 2,
  },
  press_text: {
    color: '#FFFFFF',
    fontSize: 14
  }
});
