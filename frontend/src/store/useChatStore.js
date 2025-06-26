import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance} from "../lib/axios";
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,


  // for side bar
  getUsers: async() => {
    set({isUserLoading: true});

    try{
      const res = await axiosInstance.get("/messages/users");
      console.log("Server response:", res.data);
      if (Array.isArray(res.data)) {
        set({ users: res.data });
      } else {
        set({ users: [] });
        toast.error("Invalid response format from server.");
      }
    }catch(error){
      toast.error(error.response.data.message);
    } finally{
      set({isUserLoading: false});
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true, messages: [] });
  
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      console.log("Messages Received from Backend:", res.data);
      set({ messages: res.data });
    } catch (error) {
      console.error("Error fetching messages:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      console.error("No selected user to send message.");
      return;
    }
  
    try {
      console.log("Sending Message to:", selectedUser, messageData);
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      console.log("Message Sent, Server Response:", res.data);
  
      set({ messages: [...messages, res.data] }); // Ensures reactivity
      await get().getMessages(selectedUser._id); // Refresh messages after sending
  
    } catch (error) {
      console.error("Error sending message:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },
  
  connectToMessages: () => {
    const { selectedUser} = get();
    if(!selectedUser) return

    const socket = useAuthStore.getState().socket;
    socket.off("get-Messages"); 
    //tode: optimize this later
    socket.on("get-Messages", (newMessages) => {
      console.log("Message received from server:", newMessages);
      set({
        messages: [...get().messages, newMessages]
      });
    });
  }, 

  disconnectToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("get-Messages");
  },

  setSelectedUser: (selectedUser) => set({selectedUser}),
}))