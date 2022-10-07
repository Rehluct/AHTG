import React, {useRef, useState} from 'react';
import {
  Animated,
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {hospitalData} from './hospitalData';
import {hospitalInterface} from './interfaces';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: 'center',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },

  title: {
    fontSize: 32,
  },
  logo: {
    width: 20,
    height: 20,
  },
  deleteBox: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 80,
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    marginTop: 150,
    backgroundColor: '#FFF',
  },

  modal: {
    position: 'relative',
    width: 300,
    height: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

const FlatListBasics = () => {
  const [hospitals, setHospitals] = useState(hospitalData);
  const [modal, setModal] = useState(false);
  const [editmodal, setEditModal] = useState(false);
  const [addText, setAdd] = useState('ADD HOSPITAL');
  const [editText, setEdit] = useState('Edit HOSPITAL');
  const [selectedItem, setSelectedItem] = useState(null);
  const swipeableRef = useRef<Swipeable | null>(null);

  const handleRemoveItem = (name: String) => {
    setHospitals(hospitals.filter(item => item.name !== name));
    closeSwipeable();
  };

  const closeSwipeable = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  const onPressItem = (name: any) => {
    setEditModal(!editmodal);
    setSelectedItem(name);
  };
  const leftSwipe = (progress, dragX, name) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity
        onPress={() => handleRemoveItem(name)}
        activeOpacity={0.6}>
        <View style={styles.deleteBox}>
          <Animated.Text style={{transform: [{scale: scale}]}}>
            Delete
          </Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };

  const Item = (
    item: hospitalInterface,
    index: number,
    separators: {
      highlight: any;
      unhighlight: any;
      updateProps?: (select: 'leading' | 'trailing', newProps: any) => void;
    },
  ) => (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={(progressAnimatedValue: any, dragAnimatedValue: any) =>
        leftSwipe(progressAnimatedValue, dragAnimatedValue, item.name)
      }>
      <View style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>
        <TouchableHighlight onPress={() => onPressItem(item.name)}>
          <Image
            source={require('/Users/stevencenteno/Documents/AHTG/HospitalList/src/burger.png')}
          />
        </TouchableHighlight>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Modal transparent={true} visible={modal} style={styles.modal}>
        <TextInput style={styles.input} onChangeText={setAdd} value={addText} />
        <Button
          onPress={() => {
            setModal(!modal);
            setHospitals(old => [
              ...old,
              {name: addText, address: 'String', Image: 'String'},
            ]);
          }}
          title="Done"
          color="#841584"
        />
      </Modal>

      <Modal transparent={true} visible={editmodal} style={styles.modal}>
        <TextInput
          style={styles.input}
          onChangeText={setEdit}
          value={editText}
        />
        <Button
          onPress={() => {
            setEditModal(!editmodal);
            let tmpHospitals = [...hospitals];
            let index = tmpHospitals.findIndex(el => el.name === selectedItem);
            tmpHospitals[index] = {
              name: editText,
              address: 'String',
              Image: 'String',
            };
            setHospitals(tmpHospitals);
          }}
          title="Done"
          color="#841584"
        />
      </Modal>

      <TouchableHighlight onPress={() => setModal(!modal)}>
        <Image
          style={styles.logo}
          source={{
            uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
          }}
        />
      </TouchableHighlight>
      <FlatList
        data={hospitals}
        renderItem={({item, index, separators}) =>
          Item(item, index, separators)
        }
      />
    </View>
  );
};

export default FlatListBasics;
