import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import api from './api'; // 💡 لاستدعاء لارافيل

export const chatService = {

    // 1. بدء محادثة عبر لارافيل (للحصول على firebase_chat_id)
    initializeChat: async (receiverId) => {
        const response = await api.post('/chat/initialize', { receiver_id: receiverId });
        return response.data;
    },

    // 2. مراقبة قائمة المحادثات (الغرف) لايف من فايربيز
    listenToConversations: (currentUserId, callback) => {
        const chatsRef = collection(db, 'chats');
        // جلب الغرف التي يتواجد فيها الـ ID الخاص بك
        const q = query(chatsRef, where('participants', 'array-contains', String(currentUserId)));

        return onSnapshot(q, (snapshot) => {
            const conversations = snapshot.docs.map(doc => ({
                firebase_chat_id: doc.id,
                ...doc.data()
            }));

            // ترتيب المحادثات من الأحدث للأقدم
            conversations.sort((a, b) => {
                const timeA = a.last_message_time?.toMillis() || 0;
                const timeB = b.last_message_time?.toMillis() || 0;
                return timeB - timeA;
            });

            callback(conversations);
        });
    },

    // 3. إرسال رسالة لفايربيز مباشرة
    sendMessageToFirebase: async (chatId, senderId, receiverId, text) => {
        const messagesRef = collection(db, 'chats', chatId, 'messages');

        await addDoc(messagesRef, {
            sender_id: String(senderId),
            receiver_id: String(receiverId),
            text: text,
            timestamp: serverTimestamp()
        });

        const chatDocRef = doc(db, 'chats', chatId);
        await updateDoc(chatDocRef, {
            last_message: text,
            last_message_time: serverTimestamp()
        });
    },

    // 4. مراقبة الرسائل لايف (Real-time)
    listenToMessages: (chatId, callback) => {
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(messages);
        });
    }
};