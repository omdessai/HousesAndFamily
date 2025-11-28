import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HousesDashboard from '../screens/HousesDashboard';
import PlaceholderScreen from '../screens/PlaceholderScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HousesStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HousesDashboard"
                component={HousesDashboard}
                options={{ title: 'Houses' }}
            />
        </Stack.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Houses') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Family') {
                            iconName = focused ? 'account-group' : 'account-group-outline';
                        }

                        return <Icon name={iconName || 'circle'} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#6200ee',
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Houses" component={HousesStack} />
                <Tab.Screen name="Family" component={PlaceholderScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
