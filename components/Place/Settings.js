import React from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { auth, signOut } from "../../firebase-config";

export default function Settings({ navigation }) {

  const logOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => console.error(error));
  }

  return (

    <View>
    <View style={styles.wrapper}>
      <Text style={styles.details}>This app can be used to save places.
      Firebase realtime database is used here.
      This app was made by,</Text>
      <Text style={styles.names}>Sampath Wanni Adipaththu Mudiyanselage</Text>
      <Text style={styles.names}>Jianwei wang</Text>
      <Text style={styles.names}>Kunal Preet</Text>
      </View>
      <View style={styles.logOut}>
      <Button
        color="green"
        title="Logout"
        onPress={() => logOut()} />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  textStyle: {
    fontSize: 15,
    marginBottom: 20
  },
  logOut: {
    marginTop: 50
  },
  names: {
    margin: 10,
    fontSize: 20,
    color: 'blue'
  },
  details: {
    margin: 10,
    fontSize: 20,
  },
  wrapper: {
    backgroundColor: 'white',
    width: 335,
    height: 400,
    borderRadius: 10,
    borderColor: 'blue',
    borderWidth: 1,
    margin: 25
  },
});