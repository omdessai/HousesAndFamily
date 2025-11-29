import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HousesDashboard from '../screens/HousesDashboard';
import AddHouse from '../screens/AddHouse';
import PlaceholderScreen from '../screens/PlaceholderScreen';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

const TabNavigator = () => {
    return (
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
                headerShown: true,
            })}
        >
            <Tab.Screen name="Houses" component={PlaceholderScreen} options={{ title: 'Houses' }} />
            <Tab.Screen name="Family" component={PlaceholderScreen} options={{ title: 'Family' }} />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                <RootStack.Screen
                    name="HousesDashboard"
                    component={HousesDashboard}
                    options={{ headerShown: true, title: 'Houses', headerLeft: () => null }}
                />
                <RootStack.Screen
                    name="AddHouse"
                    component={AddHouse}
                    options={{ headerShown: true, title: 'Add House' }}
                />
                <RootStack.Screen
                    name="MainTabs"
                    component={TabNavigator}
                />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
