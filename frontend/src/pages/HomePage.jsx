import Sidebar from "../components/Sidebar";
import NoChatComponent from "../components/NoChatComponent";
import ChatComponent from "../components/ChatComponent";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="h-screen bg-base-200 flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
              {!selectedUser ? <NoChatComponent /> : <ChatComponent />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;