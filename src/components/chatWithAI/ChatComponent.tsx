import "./chatComponent.css";
import { useState, useEffect, useRef } from "react";
import { useStore } from "../../store/useStore";
import { Send, Sparkles } from "lucide-react";

function ChatComponent() {
  const { analysis, chat, addChatMessage, suggestions, setSuggestions } = useStore();

  const fileName = useStore((state) => state.fileName);
  const chatDisabled = !analysis?.sessionId;

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isTyping]);

  const sendMessage = async () => {
  if (!analysis?.sessionId || !input.trim()) return;

  addChatMessage({ role: "user", content: input });

  const userMessage = input;
  setInput("");
  setIsTyping(true);

  const res = await fetch("http://localhost:4000/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: analysis.sessionId,
      message: userMessage,
    }),
  });

    const json = await res.json();

    addChatMessage({ role: "assistant", content: json.reply });

    // NEW: store suggestions
    if (json.suggestions) {
        setSuggestions(json.suggestions);
    }

    setIsTyping(false);
 };


  return (
    <section className="chat-panel">
      <div className="chat-header">
        <h3>AI Assistant Chat</h3>
        <p>Context: {fileName ?? "No file uploaded"}</p>
      </div>

      <div className="chat-messages">
        {chat.map((msg, index) =>
          msg.role === "assistant" ? (
            <AIChatMessage key={index} message={msg.content} />
          ) : (
            <UserChatMessage key={index} message={msg.content} />
          )
        )}

        {isTyping && (
          <div className="message ai-message typing-indicator">
            <div className="avatar ai-avatar"><Sparkles size={14} /></div>
            <div className="bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-footer">
        <div className="suggestion-chips">
            {suggestions.map((s, i) => (
                <button
                key={i}
                className="chip"
                onClick={() => {
                    setInput(s);
                    sendMessage();
                }}
                >
                {s}
                </button>
            ))}
            </div>


        <div className="input-container">
          {/* <button className="attachment-btn"><Paperclip size={18} /></button> */}

          <input
            type="text"
            placeholder={ chatDisabled ? "Upload a file to start chatting..." : "Ask AI about your data..." }
            disabled={chatDisabled}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => !chatDisabled && e.key === "Enter" && sendMessage()}
          />

          <button className="send-btn" onClick={sendMessage} disabled={chatDisabled}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}


export default ChatComponent;


function AIChatMessage({ message }: { message: string }) {
  return (
    <div className="message ai-message">
      <div className="avatar ai-avatar"><Sparkles size={14} /></div>
      <div className="bubble">{message}</div>
    </div>
  );
}

function UserChatMessage({ message }: { message: string }) {
  return (
    <div className="message user-message">
      <div className="bubble">{message}</div>
    </div>
  );
}


