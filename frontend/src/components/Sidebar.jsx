import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Loader, Users } from "lucide-react";
import {useAuthStore} from "../store/useAuthStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } = useChatStore();
  const {onlineUsers} = useAuthStore(); // TODO: Implement online status tracking

  useEffect(() => {
    getUsers();
  }, [getUsers]);


  if (isUserLoading) {
    return <Loader />;
  }

  return (
    <aside className="w-full md:w-64 bg-white shadow-lg border-r p-4 flex flex-col">
      {/* Sidebar Header */}
      <div>
        <div className="flex items-center space-x-3 pb-4 border-b">
          <Users />
          <span className="text-lg font-semibold">Contacts</span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-3">
        {users.length > 0 ? (
          users.map((user) => {
            return (
              <button
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                }}
                className={`
                  w-full p-3 flex items-center gap-3
                  hover:bg-gray-200 transition-colors
                  ${selectedUser?._id === user._id ? "bg-gray-300 ring-1 ring-gray-400" : ""}
                `}
              >
                {/* Profile Image */}
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.userName || user.fullName || "User"}
                    className="size-12 object-cover rounded-full"
                  />
                  
                  {onlineUsers.includes(user._id) && (
                    <span
                      className="absolute bottom-0 right-0 size-3 bg-green-500 
                      rounded-full ring-2 ring-white"
                    />
                  )}
                </div>

                {/* User Info (Only visible on larger screens) */}
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{user.userName || user.fullName || "Unknown User"}</div>
                  <div className="text-sm text-gray-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
