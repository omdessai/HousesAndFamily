import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import HouseListScreen from '../screens/HouseListScreen';
import HouseDetailScreen from '../screens/HouseDetailScreen';
import HouseFormScreen from '../screens/HouseFormScreen';
import ItemFormScreen from '../screens/ItemFormScreen';
import ChoreFormScreen from '../screens/ChoreFormScreen';
import PersonListScreen from '../screens/PersonListScreen';
import PersonFormScreen from '../screens/PersonFormScreen';

import { House } from '../types/house';
import { InventoryItem } from '../types/inventory';
import { Chore } from '../types/chore';
import { Person } from '../types/person';

export type RootStackParamList = {
    HouseListScreen: undefined;
    HouseDetailScreen: { house: House };
    HouseFormScreen: { house?: House };
    ItemFormScreen: { houseId: string; item?: InventoryItem };
    ChoreFormScreen: { houseId: string; chore?: Chore };
    PersonListScreen: undefined;
    PersonFormScreen: { personId?: string };
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const HousesStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HouseListScreen"
                component={HouseListScreen}
                options={{ title: 'My Houses' }}
            />
            <Stack.Screen
                name="HouseDetailScreen"
                component={HouseDetailScreen}
                options={({ route }) => ({ title: route.params.house.name })}
            />
            <Stack.Screen
                name="HouseFormScreen"
                component={HouseFormScreen}
                options={({ route }) => ({
                    title: route.params?.house ? 'Edit House' : 'Add New House',
                })}
            />
            <Stack.Screen
                name="ItemFormScreen"
                component={ItemFormScreen}
                options={({ route }) => ({
                    title: route.params?.item ? 'Edit Item' : 'Add Item',
                })}
            />
            <Stack.Screen
                name="ChoreFormScreen"
                component={ChoreFormScreen}
                options={({ route }) => ({
                    title: route.params?.chore ? 'Edit Chore' : 'Add Chore',
                })}
            />
        </Stack.Navigator>
    );
};

const FamilyStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PersonListScreen"
                component={PersonListScreen}
                options={{ title: 'Family & People' }}
            />
            <Stack.Screen
                name="PersonFormScreen"
                component={PersonFormScreen}
                options={({ route }) => ({
                    title: route.params?.personId ? 'Edit Person' : 'Add Person',
                })}
            />
        </Stack.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => {
                        let iconName;

                        if (route.name === 'Houses') {
                            iconName = 'home-city';
                        } else if (route.name === 'Family') {
                            iconName = 'account-group';
                        }

                        return <Icon name={iconName as string} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen name="Houses" component={HousesStackNavigator} />
                <Tab.Screen
                    name="Family"
                    component={FamilyStackNavigator}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

