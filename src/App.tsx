import "./App.css";
import SidebarComponent from "./components/sidebar/SidebarComponent";
import MainAreaComponent from "./components/mainArea/MainAreaComponent";
import ChatComponent from "./components/chatWithAI/ChatComponent";


function App() {
  return (
    <div className="container">
      <SidebarComponent/>
      <MainAreaComponent/>
      <ChatComponent />
    </div>
  );
};

export default App;


