import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Button, Stack, Surface } from '@react-native-material/core';
import { TextInput, Switch, Portal, Modal, Provider, ActivityIndicator, MD2Colors } from 'react-native-paper';
import { db, storage } from '../../firebase-config';
import { onValue, push, remove, ref, update, updateDoc } from 'firebase/database';
import * as ImagePicker from "expo-image-picker"
import { firebase, auth } from '../../firebase-config';
import * as Location from 'expo-location';

const dbRef = ref(db, '/places');

const placeModel = {
    id: null,
    name: '',
    description: '',
    imageUrl: '',
    location: '',
}

export default function AddPlace() {

    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [newPlace, setNewPlace] = useState(placeModel);
    const [dialogVisibile, setDialogVisible] = useState(false);
    const [dialogContent, setDialogContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [uid, setUid] = useState(auth.currentUser.uid);
    const dbRef = ref(db, '/places/' + uid);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });
            setNewPlace({ ...newPlace, location: location });
            console.log();
        })();
        checkNewPlace();
    }, []);

    const onRegionChange = (x) => {
        setLocation(x);
        setNewPlace({ ...newPlace, location: x });
    }

    const checkNewPlace = () => { return true; }

    const addNewPlace = () => {
        console.log('adding new place');
        setSaving(true);
        const newPlaceId = push(dbRef, {
            name: newPlace.name,
            description: newPlace.description,
            imageUrl: newPlace.imageUrl,
            location: newPlace.location
        }).key;
        if (newPlaceId) {
            setSaving(false);
            // Upload image
            if (image) {
                uploadImage(newPlaceId);
                console.log(newPlaceId);
            }
            setNewPlace({
                id: null,
                name: '',
                description: '',
                imageUrl: '',
                location: '',
            });
        }
    }

    const pickImage = async () => {

        console.log('pick image');

        // Ask the user for the permission to access the media library 
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your photos!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All, //specify if we want images or videos
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1 // 0: compress - small size / 1: compress - max quality
        });
        console.log('result from image picker', result);
        if (!result.cancelled) {
            setImage(result.uri);
            checkNewPlace();
        }
    };

    // This function is triggered when the "Open camera" button pressed
    const openCamera = async () => {
        // Ask the user for the permission to access the camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();

        // Explore the result
        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
            console.log(result.uri);
            checkNewPlace();
        }
    }

    const uploadImage = async (placeId) => {
        console.log('uploadImage');
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', image, true);
            xhr.send(null);
        });
        const refStorage = firebase.storage().ref().child('Pictures/' + uid + '/' + placeId);
        const snapshot = refStorage.put(blob);
        snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED,
            () => {
                setUploading(true)
            },
            (error) => {
                setUploading(false);
                console.log(error);
                blob.close();
                return;
            },
            () => {
                snapshot.snapshot.ref.getDownloadURL().then((url) => {
                    setUploading(false);
                    console.log("Download URL:", url);
                    console.log("id = ", placeId);
                    let updates = {};
                    updates['/places/' + uid + '/' + placeId + '/imageUrl'] = url;
                    update(ref(db), updates)
                        .then(() => {
                            console.log('Place saved successfully')
                            setNewPlace(placeModel);
                            setDialogContent('Place saved successfully!');
                            setDialogVisible(true);
                            setSaving(false);
                        })
                        .catch((error) => {
                            console.log('Errror on saving image:', error);
                        });
                    setImage(url)
                    blob.close()
                    return url;
                })
            }
        )
    }

    const hideDialog = () => {
        setDialogVisible(false);
    }

    return (
        <>
            {saving
                ? (<ActivityIndicator animating={true} color={MD2Colors.red800} size='large' />)
                :
                <Provider>
                    <Portal>
                        <Modal
                            visible={dialogVisibile}
                            onDismiss={hideDialog}
                            contentContainerStyle={styles.modalContainerStyke}>
                            <Text>{dialogContent}</Text>
                        </Modal>
                    </Portal>
                    <ScrollView
                        styles={styles.container}
                        contentContainerStyle={styles.contentContainerStyle}
                    >

                        <Stack>
                            <Surface
                                elevation={4}
                                category="medium"
                                style={
                                    {
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%",
                                        height: "auto",
                                        padding: 10
                                    }
                                }>

                                <TextInput
                                    style={{ width: "100%", marginBottom: 20}}
                                    mode="outlined"
                                    label="Place Name"
                                    value={newPlace.name}
                                    onChangeText={
                                        text => {
                                            console.log(text);
                                            setNewPlace({ ...newPlace, name: text });
                                        }
                                    }
                                />
                                <TextInput
                                    style={{ width: "100%", marginBottom: 20 }}
                                    mode="outlined"
                                    label="Description"
                                    value={newPlace.description}
                                    onChangeText={
                                        text => {
                                            console.log(text);
                                            setNewPlace({ ...newPlace, description: text });
                                        }
                                    }
                                />
                                <View style={styles.row}>
                                    {
                                        image &&
                                        <Image
                                            source={{ uri: image }}
                                            style={{ width: 170, height: 200 }} />
                                    }
                                    </View>
                                    <View style={[styles.container, styles.upload]}>

                                        <Button style={{ marginBottom: 20 }} title='Image from Library' onPress={pickImage} />
                                        <Button style={{ marginBottom: 20 }} title='Take a picture' onPress={openCamera} />

                                    </View>
                                

                            </Surface>
                            <Button
                                style={{ marginTop: 20 }}
                                title="Add new place"
                                onPress={addNewPlace}
                                color="green"
                                disabled={false} />
                        </Stack>
                    </ScrollView>
                </Provider>
            }
        </>
    )
}

// React Native Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 12
    },
    contentContainerStyle: {
        padding: 12
    },
    modalContainerStyke: {
        backgroundColor: 'white',
        padding: 20
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#afafaf',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 20,
        fontSize: 20,
    },
    placeItem: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center'
    },
    placeText: {
        paddingHorizontal: 5,
        fontSize: 16
    },
    upload: {
        marginBottom: 5
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
});