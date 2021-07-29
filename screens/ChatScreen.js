import React, {useState, useLayoutEffect} from 'react'
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native';
import { db, auth } from '../firebase';
import firebase from "firebase/app";
import "firebase/database";

const ChatScreen = ({navigation, route}) => {

  const [input, setInput] = useState("");
  const [messsages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View 
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
          <Avatar 
            rounded 
            source={{
              uri: messages[0]?.data.photoURL || "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png"
            }}
          />
          <Text
          style={{
            color: "black",
            marginLeft: 10, fontWeight: "700"
            }}>{route.params.chatName}</Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity 
        style={{marginLeft: 10}}
        onPress={navigation.goBack}
        >
          <AntDesign 
            name="arrowleft"
            size={24}
            color="black"
            />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: 80,
          marginRight: 20,
        }}
        >
          <TouchableOpacity>
          <FontAwesome 
            name="video-camera"
            size={24}
            color="black"
            
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="call" size={24} color="red"/>
        </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages])
  
  const sendMessage = () => {
    Keyboard.dismiss();

    db.collection('chats').doc(route.params.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });
    setInput(''); 
  }

  useLayoutEffect(() => {
    const unsubscribe = db.collection('chats').doc(route.params.id).collection('messages').orderBy('timestamp', 'desc').onSnapshot((snapshot) => setMessages(
      snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      }))
    ));
    return unsubscribe;
  }, [route])

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: "pink"
    }}>
      <StatusBar style="light"/>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" :"height"}
        style={styles.container}
        keyboardVerticalOffset={90}
        >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}>
          <>
          <ScrollView 
          contentContainerStyle={{
            paddingTop: 15
          }}>
          {messsages.map(({id, data}) => (
            data.email === auth.currentUser.email ? (
              <View 
              key={id}
              style={styles.reciever}>
                <Avatar
                position="absolute"
                rounded
                containerStyle={{
                  position: "absolute",
                  bottom: -15,
                  right: -5
                }}
                bottom={-15}
                right={-5}
                size={30}
                  source={{
                    uri: data.photoURL,
                  }}
                />
                <Text
                style={styles.recieverText}>{data.message}</Text>
              </View>
            ) : (
              <View 
              key={id}
              style={styles.sender}>
                <Avatar 
                  position="absolute"
                  rounded
                  containerStyle={{
                    position: "absolute",
                    bottom: -15,
                    left: -5
                  }}
                  bottom={-15}
                  left={-5}
                  size={30}
                  source={{
                    uri: data.photoURL,
                  }}
                />
                <Text
                style={styles.senderText}>{data.message}</Text>
                <Text
                style={styles.senderName}>{data.displayName}</Text>
              </View>
            )
            ))}
          </ScrollView>
          <View style={styles.footer}>
            <TextInput 
            placeholder="Write something ..."
            style={styles.textInput}
            value={input}
            onChangeText={text => setInput(text)}
            onSubmitEditing={sendMessage}
            />
            <TouchableOpacity 
            activeOpacity={0.5}
            onPress= {sendMessage}
            >
              <Ionicons 
              name="send" 
              size={24}
              color="#2B68E6"
              />
            </TouchableOpacity>
          </View>
          </>
          </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Text>{route.params.chatName}</Text>
    </SafeAreaView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reciever: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWIdth: "80%",
    position: "relative",
  },
  recieverText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginRight: 15,
    maxWIdth: "80%",
    position: "relative",
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: WebGLQuery,
    borderRadius: 30,
  },

})
