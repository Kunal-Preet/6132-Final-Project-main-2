import React from 'react';
import { View, StyleSheet, Image} from "react-native";
import {
  Stack,
  Text
} from "@react-native-material/core";

export default function Details({ place: { name, description, location, imageUrl }}) {


  return (
    <View style={styles.placeItem}>
      <Stack spacing={2}>

          <View style={styles.wrapper}>
          <View style={styles.texts}>
              <Text style={{ fontSize: 45, fontWeight: 'bold' }}>{name}</Text>
              
            </View>
            <View style={{justifyContent:"center", alignItems:"center", width:300, height:150}}>
              <Text style={{ fontSize: 25, fontWeight: '120' }}>{description}</Text>
            </View>
            <View style={styles.image}>
              {
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: 300, height: 250 }} />
              }
            </View>
            
          </View>

      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
    placeItem: {
      flexDirection: 'row',
      marginVertical: 10,
      alignItems: 'center',
    },
    placeText: {
      paddingHorizontal: 5,
      fontSize: 16
    },
    texts: {
      margin: 10,
      alignItems: 'center'
    },
    image: {
      margin: 18
    },
    wrapper: {
      backgroundColor: 'white',
      width: 335,
      height: 550,
      borderRadius: 10,
      borderColor: 'blue',
      borderWidth: 1
    },
  })