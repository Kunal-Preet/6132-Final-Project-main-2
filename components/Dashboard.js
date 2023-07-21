import React, { useState } from 'react';
import {
  auth
} from "../firebase-config";
import { 
  Text, 
  View, 
  StyleSheet,  
  Button,
 } from "react-native";
import Settings from './Place/Settings';
import AddPlace from './Place/Place-Add';
import PlaceList from './Place/Place-List';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Dashboard = () => {

  // const [uid, setUid] = useState(auth.currentUser.uid);
  // const [displayName, setDisplayName] = useState(auth.currentUser.displayName);

  

  const Dashboard = () => {
    return (
      <PlaceList/>
    );
  }

  const Tab = createBottomTabNavigator();

  return (
      <Tab.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#3740FE',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Tab.Screen name="PLACES" component={Dashboard} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons 
            name="home" 
            color={color} 
            size={size} 
            />
          ),
          
        }}
        />
        <Tab.Screen name="ADD A PLACE" component={AddPlace} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons 
            name="account" 
            color={color} 
            size={size} 
            />
          ),
        }}
        />
        <Tab.Screen name="SETTINGS" component={Settings} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons 
            name="cog-outline" 
            color={color} 
            size={size} 
            />
          ),
        }}
        />
      </Tab.Navigator>
  );
 }

 const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: "flex",
      justifyContent: 'center',
      alignItems: 'center',
      padding: 35,
      backgroundColor: '#fff'
    },
    textStyle: {
      fontSize: 15,
      marginBottom: 20
    }
  });

 export default Dashboard;