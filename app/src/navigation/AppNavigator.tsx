import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HousesDashboard from '../screens/HousesDashboard';
import AddHouse from '../screens/AddHouse';
import FamilyDashboard from '../screens/FamilyDashboard';

import HouseDetails from '../screens/HouseDetails';
import AddItem from '../screens/AddItem';
import AddChore from '../screens/AddChore';
import AddPerson from '../screens/AddPerson';

const Tab = createBottomTabNavigator();
const HousesStack = createStackNavigator();
const FamilyStack = createStackNavigator();

const HousesStackNavigator = () => {
    return (
        <HousesStack.Navigator>
            <HousesStack.Screen
                name="HousesDashboard"
                component={HousesDashboard}
                options={{ title: 'Houses', headerLeft: () => null }}
            />
            <HousesStack.Screen
                name="HouseDetails"
                component={HouseDetails}
                options={{ title: 'House Details' }}
            />
            <HousesStack.Screen
                name="AddHouse"
                component={AddHouse}
                options={{ title: 'Add House' }}
            />
            <HousesStack.Screen
                name="AddItem"
                component={AddItem}
                options={({ route }: any) => ({
                    title: route.params?.item ? 'Edit Item' : 'Add Item'
                })}
            />
            <HousesStack.Screen
                name="AddChore"
                component={AddChore}
                options={({ route }: any) => ({
                    title: route.params?.chore ? 'Edit Chore' : 'Add Chore'
                })}
            />
        </HousesStack.Navigator>
    );
};

const FamilyStackNavigator = () => {
    return (
        <FamilyStack.Navigator>
            <FamilyStack.Screen
                name="FamilyDashboard"
                component={FamilyDashboard}
                options={{ title: 'Family', headerLeft: () => null }}
            />
            <FamilyStack.Screen
                name="AddPerson"
                component={AddPerson}
                options={({ route }: any) => ({
                    title: route.params?.person ? 'Edit Person' : 'Add Person'
                })}
            />
        </FamilyStack.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'HousesTab') {
                            iconName = 'home-analytics';
                        } else if (route.name === 'FamilyTab') {
                            iconName = 'account-group';
                        }

                        return <Icon name={iconName || 'circle'} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#6200ee',
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false,
                })}
            >
                <Tab.Screen
                    name="HousesTab"
                    component={HousesStackNavigator}
                    options={{ title: 'Houses' }}
                />
                <Tab.Screen
                    name="FamilyTab"
                    component={FamilyStackNavigator}
                    options={{ title: 'Family' }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

