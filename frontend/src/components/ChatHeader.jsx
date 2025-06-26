import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore} from "../store/useAuthStore";
const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const {onlineUsers} = useAuthStore();

  return (
    <div className="flex items-center justify-between bg-gray-200 p-4 border-b border-gray-300">
      {/* Profile Picture */}
      <div className="flex items-center gap-3">
        <img
          src={selectedUser.profilePic || "/avatar.png"}
          alt={selectedUser.userName}  
          className="w-10 h-10 rounded-full object-cover border"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800">{selectedUser.userName}</h3>
        <p className="text-sm text-gray-600">
          {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"} {/* Replace with online status logic */}
        </p>
      </div>
      

      {/* Close Button */}
      <button
        onClick={() => setSelectedUser(null)}
        className="text-gray-600 hover:text-gray-900"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default ChatHeader;
