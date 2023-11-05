import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeContainer from './components/HomeContainer';
import { Ionicons } from '@expo/vector-icons'
import AddHikeScreen from './components/AddHikeScreen';
import WeatherScreen from './components/WeatherScreen';


const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Add') {
              iconName = 'add-circle';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarLabelStyle: { fontSize: 14},
          headerShown: false,
        })}
      >

        <Tab.Screen
          name='Home'
          component={HomeContainer}
          options={
            {
              tabBarIcon: () => (
                <Ionicons
                  name='home'
                  size={24}
                />
              ),
              headerShown: false
            }
          }
        />

        <Tab.Screen
          name='Add'
          component={AddHikeScreen}
          options={
            {
              tabBarIcon: () => (
                <Ionicons
                  name='add-circle'
                  size={24}
                />
              ),
              headerShown: false
            }
          }
        />

        <Tab.Screen
          name='Weather'
          component={WeatherScreen}
          options={
            {
              tabBarIcon: () => (
                <Ionicons
                  name='cloudy'
                  size={24}
                />
              ),
              headerShown: false
            }
          }
        />

      </Tab.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
