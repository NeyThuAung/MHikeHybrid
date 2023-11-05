import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HikeListScreen from './HikeListScreen';
import EditHikeScreen from './EditHikeScreen';

const Stack = createStackNavigator();

const HomeContainer = () => {
  return (
    <Stack.Navigator initialRouteName='HikeList'>

        <Stack.Screen
            name='HikeList'
            component={HikeListScreen}
        />

        <Stack.Screen
            name='EditHike'
            component={EditHikeScreen}
        />

    </Stack.Navigator>
  )
}

export default HomeContainer;