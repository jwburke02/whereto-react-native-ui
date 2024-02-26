import React from 'react'
import { View, TextInput, Text, Pressable, Button, StatusBar, StyleSheet } from 'react-native'
import axios from 'axios'

// not current active, console log example
function useCurrentLocation() {
    console.log("Attempting to use current location as input...")
}
 
// not current active, console log example
function useMapPin() {
console.log("Attempting to place a pin on the map for input...")
}

// API call to find the parking
async function findParking(address, radius, setIsLoading, setIsOnMap, setResponseData, setIsError) {
    // Change display to emphasize loading (this function call can take a long time)
    setIsLoading(true)
    try {
        setIsError(false)
        console.log(`Attempting to find parking at address "${address}" with a radius of ${radius}...`)
        const params = {
            "address": address,
            "radius": radius
        }
        result = await axios.post('http://10.0.0.249:7001/park', params)
        console.log(JSON.stringify(result.data, null, 4));
        setResponseData(result.data)
        setIsLoading(false) // end loading 
        setIsOnMap(true) // display map results 
    }
    catch (e) {
        console.log(e)
        setIsLoading(false)
        setIsError(true)
        setIsOnMap(false) // if there was an exception we should not display results
    }
  }

// Input Display Component 
function InputDisplay({setIsOnMap, setResponseData}) {
    // State Variables for address and radius
    const [address, setAddress] = React.useState("")
    const [radius, setRadius] = React.useState(0)
    // State to display to user API processing request
    const [isLoading, setIsLoading] = React.useState(false)
    const [isError, setIsError] = React.useState(false)

    // Input display (Both Input + Loading)
    return (
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
                <Button onPress={()=>{findParking(address, radius, setIsLoading, setIsOnMap, setResponseData, setIsError)}} title='Find Parking' color='#000065'/>
                {isError? <Text>There was an issue with your request...</Text> : <></>}
            </>
            :
            <>
                <Text>Please wait while your Parking is found...</Text>
            </>
            }
            <StatusBar style="auto" />
        </View> 
    )
}

// Style Definitions for Input Display
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
  
export default InputDisplay