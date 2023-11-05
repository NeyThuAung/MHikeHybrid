import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SQLite from 'expo-sqlite'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RadioButton } from 'react-native-radio-buttons-group';
import { SelectList } from 'react-native-dropdown-select-list'
import DateTimePicker from '@react-native-community/datetimepicker'

const db = SQLite.openDatabase('hike.db')

const EditHikeScreen = () => {

  const navigation = useNavigation();
  const route = useRoute();

  const { hike_id, hike_name, hike_location, hike_date,
    hike_parking, hike_length, hike_difficulty, hike_start,
    hike_end, hike_description } = route.params;


  useEffect(() => {
    setId(hike_id);
    setHikeName(hike_name);
    setLocation(hike_location);
    setDate(hike_date);
    setParking(hike_parking);
    setLength(hike_length);
    setDifficulty(hike_difficulty);
    setStartPoint(hike_start);
    setEndPoint(hike_end);
    setDescription(hike_description);
  }, [])

  const [id, setId] = useState();
  const [hikeName, setHikeName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [parking, setParking] = useState('');
  const [length, setLength] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [description, setDescription] = useState('');
  const [hikeNameError, setHikeNameError] = useState('');
  const [locationError, setlocationError] = useState('');
  const [dateError, setDateError] = useState('');
  const [parkingError, setParkingError] = useState('');
  const [lengthError, setLengthError] = useState('');
  const [difficultyError, setDifficultyError] = useState('');

  useEffect(() => { validateForm(); }, [hikeName, location, date, parking, length, difficulty]);

  const handleRadioChange = (value) => {
    setParking(value);
  }

  const data = [
    { key: '1', value: 'Easy' },
    { key: '2', value: 'Intermediate' },
    { key: '3', value: 'Strenuous' },
  ]

  const [hikeDate, setHikeDate] = useState(new Date());

  const [showPicker, setShowPicker] = useState
    (false);

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setHikeDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
        setDate(
          currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        );
      }
    } else {
      toggleDatePicker();
    }
  }

  const validateForm = () => {

    if (!hikeName.trim()) {
      setHikeNameError('Name of hike is required.');
    } else {
      setHikeNameError('');
    }

    if (!location.trim()) {
      setlocationError('Location is required.');
    } else {
      setlocationError('');
    }

    if (!date) {
      setDateError('Date of hike is required.');
    } else {
      setDateError('');
    }

    if (!parking.trim()) {
      setParkingError('Choose parking available.');
    } else {
      setParkingError('');
    }

    if (!length) {
      setLengthError('Length of hike is required.');
    } else {
      setLengthError('');
    }

    if (!difficulty) {
      setDifficultyError('Level of difficulty is required.');
    } else {
      setDifficultyError('');
    }
  }

  const editButtonClick = () => {

    if (hikeName && location && date && parking && length && difficulty) {
      confirmAlert();
    } else {
      validateForm();
    }

  }

  const confirmAlert = () => {

    const desc = 'Name : ' + hikeName + '\n' +
      'Location : ' + location + '\n' +
      'Date : ' + date + '\n' +
      'Parking available : ' + parking + '\n' +
      'Length of hike : ' + length + '\n' +
      'Difficulty : ' + difficulty + '\n' +
      'Start Point : ' + startPoint + '\n' +
      'End Point : ' + endPoint + '\n' +
      'Description : ' + description + '\n';

    Alert.alert('Are you sure to update hiking?', desc,
      [
        {
          text: 'No',
          onPress: () => console.log('Press No')
        },
        {
          text: 'Yes',
          onPress: () => saveHike()
        }
      ]
    )

  }

  const foundItem = data.find(item => item.value === difficulty);

  const saveHike = () => {
    db.transaction((txn) => {
      txn.executeSql(
        'update hike set name=?, location=?, date=?, parking=?, length=?, difficulty=?, start=?, end=?, description=? where id=?',
        [hikeName, location, date, parking, length, difficulty, startPoint, endPoint, description, id],
        (tx, results) => {
          navigation.navigate('HikeList')
        },
        (tx, error) => { console.log("Update error : " + error.message) }
      )
    }

    );
  }

  return (
    <ScrollView>


      <View style={styles.container}>
        <Text style={styles.titleText}>Add Hiking Details</Text>

        <TextInput
          style={styles.input}
          placeholder='Enter Hike Name'

          value={hikeName}
          onChangeText={setHikeName} />
        {
          hikeNameError ?
            <Text style={styles.errorText}>{hikeNameError}</Text>
            : null
        }

        <TextInput
          style={styles.input}
          placeholder='Enter location'
          value={location}
          onChangeText={setLocation} />

        {
          locationError ?
            <Text style={styles.errorText}>{locationError}</Text>
            : null
        }


        {
          !showPicker && (
            <Pressable
              onPress={toggleDatePicker}
            >
              <TextInput
                style={styles.input}
                placeholder='Select Hiking Date'
                value={date}
                onChangeText={setDate}
                editable={false} />
            </Pressable>
          )
        }

        {
          dateError ?
            <Text style={styles.errorText}>{dateError}</Text>
            : null
        }

        {
          showPicker &&
          (<DateTimePicker
            mode='date'
            display='calendar'
            value={hikeDate}
            onChange={onChange}
          />)
        }

        <Text style={{ fontSize: 18, marginTop: 10 }}>Parking available</Text>

        <View style={styles.radio}>
          <RadioButton
            label="Yes"
            value="Yes"
            selected={parking === 'Yes'}
            onPress={() => handleRadioChange('Yes')}
          />
          <RadioButton
            label="No"
            value="No"
            selected={parking === 'No'}
            onPress={() => handleRadioChange('No')}
          />
        </View>

        {
          parkingError ?
            <Text style={styles.errorText}>{parkingError}</Text>
            : null
        }

        <TextInput
          style={styles.input}
          placeholder='Enter length of hike'
          value={length.toString()}
          onChangeText={setLength}
          keyboardType='numeric' />

        {
          lengthError ?
            <Text style={styles.errorText}>{lengthError}</Text>
            : null
        }

        <View style={styles.list}>
          <SelectList
            setSelected={setDifficulty}
            data={data}
            save='value'
            defaultOption={foundItem}

          />
        </View>

        {
          difficultyError ?
            <Text style={styles.errorText}>{difficultyError}</Text>
            : null
        }

        <TextInput
          style={styles.input}
          placeholder='Start Point'
          value={startPoint}
          onChangeText={setStartPoint} />

        <TextInput
          style={styles.input}
          placeholder='End Point'
          value={endPoint}
          onChangeText={setEndPoint} />

        <TextInput
          style={styles.descriptionInput}
          placeholder='Description'
          value={description}
          onChangeText={setDescription} />

        <TouchableOpacity style={styles.button} onPress={editButtonClick}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 16,
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      fontSize: 18,
      marginStart: 16,
      marginEnd: 16,
      borderRadius: 10,
      marginTop: 20,
      alignSelf: 'center',
      color: 'black'
    },
    descriptionInput: {
      width: '100%',
      height: 120,
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      fontSize: 18,
      marginStart: 16,
      marginEnd: 16,
      borderRadius: 10,
      marginTop: 20,
      alignSelf: 'center',
      textAlignVertical: 'top',
      color: 'black'
  },
    button: {
      width: '100%',
      backgroundColor: '#2E6EFF',
      padding: 10,
      marginLeft: 16,
      marginRight: 16,
      borderRadius: 10,
      marginTop: 20,
      alignSelf: 'center'
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
    titleText: {
      fontSize: 24,
      color: 'black',
      textAlign: 'center',

    },
    errorText: {
      color: 'red',
      textAlign: 'left'
    },
    radio: {
      flexDirection: 'row'
    },
    list: {
      width: '100%',
      color: '#000000',
      fontSize: 22,
      marginTop: 20,
      alignSelf: 'center',
    },
  }
)

export default EditHikeScreen;