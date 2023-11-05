import { View, Text } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';

 const WeatherScreen = () => {
  return (
    <WebView
      source={{ uri: 'https://openweathermap.org/' }}
      style={{ flex: 1 }}
    />
  )
}

export default WeatherScreen;