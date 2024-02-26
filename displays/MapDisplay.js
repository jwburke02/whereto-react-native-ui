import React from 'react'
import { View, StyleSheet, Button } from 'react-native'
import {Circle, Marker} from 'react-native-maps'
import MapView from 'react-native-maps'

function Markers({responseData}) {
    const marker_params = []
    keys = Object.keys(responseData)
    for(i = 0; i < keys.length; i++) {
        if(keys[i] == 'center_lat' || keys[i] == 'center_lng' || keys[i] == 'radius') {
            continue;
        } else {
            for(j = 0; j < responseData[keys[i]].detections.length; j++) {
                marker_params.push(responseData[keys[i]].detections[j])
            }
        }
    }
    console.log(marker_params)
    return marker_params.map((params) => {
        return(<Marker
            coordinate={{latitude: params.lat,
            longitude: params.lng}}
            title={params.class_name}
            description={params.class_name}
            color={"blue"}
         />)
    })
}

// responseData is an Application State set by InputDisplay
function MapDisplay({responseData, setIsOnMap}) {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                //specify our coordinates.
                initialRegion={{
                latitude: responseData['center_lat'],
                longitude: responseData['center_lng'],
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0042,
                }}
            >
                <Circle 
                    center={{
                        "latitude": responseData['center_lat'],
                        "longitude": responseData['center_lng']
                    }}
                    radius={1609.344 * responseData['radius']}
                    strokeWidth = { 1 }
                    strokeColor = { '#1a66ff' }
                    fillColor = { 'rgba(230,238,255,0.5)' }
                />
                <Markers responseData={responseData}/>
            </MapView>
            <Button onPress={()=>{setIsOnMap(false)}} title='Back to Menu' color='#000065'/>
        </View>
    )
}

// Style Definitions for Map Display
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#343434',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 64,
      color: '#000065'
    },
    map: {
        width: '100%',
        height: '80%',
      },
});

export default MapDisplay