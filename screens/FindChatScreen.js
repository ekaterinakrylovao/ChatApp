import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Input} from 'react-native-elements';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import ChatListItem from '../components/ChatListItem';
import {db} from '../firebase';
import {collection, onSnapshot, query, where} from 'firebase/firestore';

const FindChatScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const q = query(collection(db, "chats"), where("chatName", '!=', ""));
        return onSnapshot(q, (querySnaphots) => {
            const chats = [];
            querySnaphots.forEach((doc) => {
                let flag = true;
                for (let i = 0; i < input.length; i++) {
                    if (doc.data().chatName[i] !== input[i]) {
                        flag = false;
                    }
                }
                if (flag) {
                    chats.push({
                        id: doc.id,
                        data: doc.data()
                    });
                }
            });
            console.log(chats);
            setChats(chats);
        });
    }, [input])
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "InterestsChat",
            headerStyle: { backgroundColor: "#fff" },
            headerTitleStyle: { color: "black"},
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity style={{ marginLeft: 10 }}
                                      onPress={navigation.goBack}>
                        <Text>Back</Text>
                    </TouchableOpacity>

                </View>
            ),
            headerRight: () => (
                <View style={{ marginLeft: 20 }}>
                    <Input
                        placeholder="Find chat..."
                        onChangeText={(text) => setInput(text)}
                        inputContainerStyle={{
                            height: 40,
                            width: 100,
                        }}
                    />
                </View>
            )
        })
    }, [navigation])
    const enterChat = (id, chatName) => {
        navigation.navigate("Chat", { id, chatName, })
    }
    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {chats.map(({ id, data: { chatName } }) => (
                    <ChatListItem key={id} id={id} chatName={chatName} enterChat={enterChat} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
};

export default FindChatScreen

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width:"100%"
    }
})