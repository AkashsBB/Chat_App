import {create} from "zustand";
import {axiosInstance} from '../lib/axios.js';
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogin : false,
  isUpdateProfile: false,

  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,


  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check-auth');
      set({ authUser: res.data });
      get().connectSocket();
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
      const errorMessage = error.response?.data?.message || "Failed to check authentication status";
      return { success: false, error: errorMessage };
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  
  signUp: async(data) => {

    set({isSigningUp: true});
    try{
      const res=await axiosInstance.post("/auth/signup", data);
      
      if (res.data) {
        set({ authUser: res.data });
        toast.success("Account created successfully!");
        get().connectSocket();
        return { success: true, data: res.data };
      }
      return { success: false, error: "No data received from server" };
    }catch(error){
      console.error("Signup error:", error);
      
      let errorMessage = "Signup failed. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.message || 
                     error.response.statusText || 
                     `Error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }finally{
      set({isSigningUp: false});
    }
  },

  login : async(data) => {
    console.log("Form Data from useAuth :", data);
    set({ isLoggingIn: true });
    try{
      const res = await axiosInstance.post("/auth/login", data);
      
      if (res.data) {
        set({ authUser: res.data });
        toast.success("Logged in successfully!");
        get().connectSocket();
        return { success: true, data: res.data };
      }
      return { success: false, error: "No data received from server" };
    }catch(error){
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please check your credentials and try again.";
      if (error.response) {
        errorMessage = error.response.data?.message || 
                     error.response.statusText || 
                     `Error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }finally{
      set({isLoggingIn: false});
    }
  },

  logout: async() => {
    try{
      await axiosInstance.post("/auth/logout");
      set({authUser: null});
      toast.success("Logged out successfully!");
      get().disconnectSocket();
      return { success: true };
    }catch(error){
      console.error("Logout error:", error);
      const errorMessage = error.response?.data?.message || "Failed to log out. Please try again.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.post("/auth/update-profile", data);
      
      if (res.data) {
        set({ authUser: res.data });
        toast.success("Profile updated successfully!");
        return { success: true, data: res.data };
      }
      return { success: false, error: "No data received from server" };
    } catch (error) {
      console.error("Update profile error:", error);
      
      let errorMessage = "Failed to update profile. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.message || 
                     error.response.statusText || 
                     `Error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket : () => {
    const authUser = get().authUser;
    if(!authUser || get().socket?.connected) return;

    const socketConn = io(BASE_URL, {
      query: {
        userId : authUser._id,
      },
    });

    socketConn.connect();

    set({socket: socketConn});

    socketConn.on("getOnlineUsers", (userIds) => {
      set({onlineUsers: userIds})
    })
  },

  disconnectSocket : () => {
    if(get().socket?.connected) get().socket.disconnect();
  },
}));