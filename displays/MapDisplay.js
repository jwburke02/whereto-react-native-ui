import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Button, TouchableOpacity, Image, Dimensions } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const detailedInfo = {
  address: "123 Example Street, Boston MA, 02184",
  class_name: "Single Space Parking Meter",
  conf: 0.91,
  image_data: null
};

// Component for displaying modal with marker's detailed information
function MarkerInfoModal({ visible, onClose, info }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image source={{ uri: info.image_data }} style={styles.parkingImage} resizeMode="cover" />
          <Text style={styles.modalText}>Address: {info.address}</Text>
          <Text style={styles.modalText}>Detection: {info.class_name}</Text>
          <Text style={styles.modalText}>Confidence: {info.conf.toFixed(2)}</Text>
          <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onClose}>
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Component for rendering all markers on the map based on responseData
function Markers({ responseData, onSelect }) {
    return Object.keys(responseData).filter(key => key !== 'center_lat' && key !== 'center_lng' && key !== 'radius')
      .flatMap(key => responseData[key].detections)
      .map((params, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: params.lat, longitude: params.lng }}
          title={params.class_name}
          description={`Confidence: ${params.conf.toFixed(2)}`}
          onPress={(event) => onSelect(params.did, params.lat, params.lng)}
        />
      ));
  }
  
  function MapDisplay({ responseData, setIsOnMap }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState(detailedInfo);
  
    const handleSelectMarker = async (did, lat, lng) => {
      // use the did to call the detail endpoint
      const params = {
        "did": did,
        "lat": lat,
        "lng": lng
      }
      result = await axios.post('http://10.239.172.191:7001/detail', params)
      let base64Image = 'data:image/jpeg;base64,'
      base64Image = base64Image + result.data.image_data
      result.data.image_data = base64Image
      setSelectedInfo(result.data);
      setModalVisible(true);
    };
    return (
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: responseData['center_lat'],
              longitude: responseData['center_lng'],
              latitudeDelta: 0.0122,
              longitudeDelta: 0.0042,
            }}>
            <Circle
              center={{ latitude: responseData['center_lat'], longitude: responseData['center_lng'] }}
              radius={responseData['radius'] * 1609.34}
              strokeWidth={1}
              strokeColor={'#1a66ff'}
              fillColor={'rgba(230,238,255,0.5)'}
            />
            <Markers responseData={responseData} onSelect={handleSelectMarker} />
          </MapView>
          <TouchableOpacity style={styles.backButton} onPress={() => setIsOnMap(false)}>
            <Text style={styles.backButtonText}>Back to Menu</Text>
          </TouchableOpacity>
          <MarkerInfoModal visible={modalVisible} onClose={() => setModalVisible(false)} info={selectedInfo} />
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-end',
      },
      map: {
        width: width,
        height: height * 0.8,
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
      },
      modalView: {
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
      parkingImage: {
        width: 300,
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
      },
      backButton: {
        backgroundColor: "#4ECCA3",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginBottom: 30,
        alignSelf: 'center',
      },
      backButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      buttonClose: {
        backgroundColor: "#2196F3",
        marginTop: 15,
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 16,
      }
    });
    
    export default MapDisplay;