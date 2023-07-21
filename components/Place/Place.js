import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
  Stack,
  Text
} from "@react-native-material/core";

export default function Place({ place: { name, description, location, imageUrl }, id, goDetail}) {

  
  const goToDetails = () => {
    goDetail()
    console.log("I'm touched");
  }

  return (
    <View style={styles.placeItem}>


      <Stack spacing={2}>

        <TouchableOpacity onPress={() => goToDetails()}>
          <View style={styles.wrapper}>
            <View style={styles.image}>
              {
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: 50, height: 50 }} />
              }
            </View>
            <View style={styles.texts}>
              <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{name}</Text>
              {/* <Text style={{ fontSize: 15, fontWeight: '10' }}>{description}</Text> */}
            </View>
          </View>
        </TouchableOpacity>

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
    margin: 10
  },
  image: {
    margin: 10
  },
  wrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: 335,
    height: 70,
    borderRadius: 10,
    borderColor: 'blue',
    borderWidth: 1
  },
})

