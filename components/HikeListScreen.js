import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SQLite from 'expo-sqlite'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const db = SQLite.openDatabase('hike.db')

const HikeListScreen = () => {

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [isDataAvailable, setDataAvailability] = useState(false);
  const [hikeList, setHikeList] = useState([]); // initialized array list


  useEffect(() => createTable, []);
  useEffect(() => {
    console.log('useEffect is triggered');
    createTable();
    showAllHike();
  }, [isFocused]);

  const createTable = () => {
    db.transaction((txn) => {
      txn.executeSql(
        'create table if not exists hike(id integer primary key autoincrement, name string, location string, date string, parking string, length string, difficulty string, start string, end string, description string)',
        [],
        (tx, results) => { console.log('Hike table successful'); },
        (tx, error) => { console.log('Error in creating table' + error); }
      )

    }

    );
  }

  const showAllHike = () => {
    console.log('showAllHike');

    db.transaction((txn) => {
      txn.executeSql(
        'select * from hike',
        [],
        (tx, results) => {
          console.log("Number of records" + results.rows.length)

          let temp = [];
          for (let i = 0; i < results.rows.length; i++) {
            temp.push(results.rows.item(i));
            console.log(results.rows.item(i));
          }
          setHikeList(temp);

          setDataAvailability(results.rows.length > 0);
        },
        (tx, error) => { console.log('Error in showing hike.') }
      )
    }

    );
  }

  const showHikeItem = (item) => {

    return (
      <View style={styles.item}>
        <Text style={styles.text}>Name : {item.name}</Text>
        <Text style={styles.text}>Date : {item.date}</Text>
        <Text style={styles.text}>Location : {item.location}</Text>
        <Text style={styles.text}>Length : {item.length}</Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => { updateHike(item) }}>
            <MaterialCommunityIcons name='file-document-edit' color={'green'} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => { confirmAlert(item.id) }}>
            <MaterialCommunityIcons name='delete' color={'red'} size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.horizontalLine} />

      </View>
    )
  }

  const confirmAlert = (hike_id) => {

    Alert.alert('Are you sure?', 'Are you sure want to delete this hike record?',
      [
        {
          text: 'No',
          onPress: () => console.log('Press No')
        },
        {
          text: 'Yes',
          onPress: () => deleteHike(hike_id)
        }
      ]
    )

  }

  const deleteAllHikeConfirmAlert = () => {

    Alert.alert('Are you sure?', 'Are you sure want to delete all hike records?',
      [
        {
          text: 'No',
          onPress: () => console.log('Press No')
        },
        {
          text: 'Yes',
          onPress: () => deleteAllHikeData()
        }
      ]
    )

  }

  const updateHike = (item) => {
    console.log('Update hike :' + item.id + '  ' + item.date + '  ' + item.location + '  ' + item.length + " " + item.difficulty);

    navigation.navigate('EditHike', {
      hike_id: item.id,
      hike_name: item.name,
      hike_location: item.location,
      hike_date: item.date,
      hike_parking: item.parking,
      hike_length: item.length,
      hike_difficulty: item.difficulty,
      hike_start: item.start,
      hike_end: item.end,
      hike_description: item.description
    });

  }

  const deleteHike = (hike_id) => {

    console.log('delete hike for' + hike_id);

    db.transaction((txn) => {
      txn.executeSql(
        'delete from hike where id=?',
        [hike_id],
        (tx, results) => {
          Alert.alert('Deleted', 'Successfully deleted!');
          showAllHike();
        },
        (tx, error) => { console.log('Deletion error:' + error.message) }
      )
    }

    )

  }

  const deleteAllHikeData = () => {
    db.transaction((txn) => {
      txn.executeSql(
        'delete from hike',
        [],
        (tx, results) => {
          Alert.alert('Deleted', 'All hikes have been deleted!');
          showAllHike();
        },
        (tx, error) => {
          console.log('Deletion error: ' + error.message);
        }
      );
    });
  };

  return (
    <View style={styles.container}>

      {isDataAvailable ? (
      <FlatList style={{ marginBottom: 10 }}
        data={hikeList}
        renderItem={({ item }) => showHikeItem(item)}
      />
    ) : (
      <Text style={styles.noDataText}>No hike data found.</Text>
    )}

    {isDataAvailable && (
      <TouchableOpacity style={styles.deleteAllButton} onPress={deleteAllHikeConfirmAlert}>
        <MaterialCommunityIcons name="delete" color="white" size={24} />
        <Text style={{ color: 'white', marginStart: 5 }}>Delete all hike</Text>
      </TouchableOpacity>
    )}

    </View>
  )
}


const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      marginTop: 20,
      width: '100%',
    },
    deleteAllButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-end',
      backgroundColor: 'red',
      marginEnd: 16,
      marginBottom: 10,
      padding: 10,
      borderRadius: 5,
      width: '50%'
    },
    item: {
      width: '100%',
      paddingTop: 15,
      backgroundColor: 'white'
    },
    text: {
      width: '100%',
      marginHorizontal: 16,
    },
    buttons: {
      alignSelf: 'flex-end',
      flexDirection: 'row',
      margin: 5,
      padding: 5,
      padding: 5,
    },
    horizontalLine: {
      borderBottomColor: 'black',
      borderBottomWidth: 1,
    },
    noDataText: {
      textAlign: 'center',
      fontSize: 18,
      marginTop: 20,
    },
  }
)

export default HikeListScreen;