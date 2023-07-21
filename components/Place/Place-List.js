import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { Stack } from "@react-native-material/core";
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase-config";
import { onValue, ref } from "firebase/database";
import Place from "./Place";
import Details from "./Details";

//const uid = auth.currentUser.uid
//const uid = 'h9mAApU7aBVslQiZRmdo0tlNxWG2'
//const dbRef = ref(db, '/places/' + uid);

export default function PlaceList() {
  const [modalVisible, setModalVisible] = useState(false);

  const [places, setPlaces] = useState({});

  const placeKeys = Object.keys(places);
  const [detailKey, setDetailKey] = useState("");
  

  const goToDetail = (k) => {
    
    setDetailKey(k)
    console.log("detailKey", detailKey);
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    const uid = auth.currentUser.uid;
    const dbRef = ref(db, "/places/" + uid);
    return onValue(dbRef, (querySnapshot) => {
      let data = querySnapshot.val() || {};
      let places = { ...data };
      console.log("places", places);
      setPlaces(places);
    });
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}
    >
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <Details place={places[detailKey]} />
          <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={{color:"blue"}}>Close</Text>
            </Pressable>
        </View>

        
      </Modal>
      <Stack m={4} spacing={2} divider={true}>
        <View>
          {
            //replace const placeKey
            placeKeys.length > 0 ? (
              placeKeys.map((key) => (
                <Place
                  key={key}
                  id={key}
                  place={places[key]}
                  goDetail={()=>goToDetail(key)}
                />
              ))
            ) : (
              <Text>No places!</Text>
            )
          }
        </View>
      </Stack>
    </ScrollView>
  );
}

// React Native Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  contentContainerStyle: {
    padding: 24,
  },
  modalContainer: {
    flex:1, 
    justifyContent: "center",
    alignItems:"center"
  }
});
