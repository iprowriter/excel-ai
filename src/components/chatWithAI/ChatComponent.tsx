import "./chatComponent.css";
import { useState, useEffect, useRef } from "react";
import { useStore } from "../../store/useStore";
import { Search, Paperclip, Send, Sparkles } from "lucide-react";

function ChatComponent() {
  const { analysis, chat, addChatMessage, suggestions, setSuggestions } = useStore();

  const fileName = useStore((state) => state.fileName);

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
          <button className="attachment-btn"><Paperclip size={18} /></button>

          <input
            type="text"
            placeholder="Ask AI about your data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button className="send-btn" onClick={sendMessage}>
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


const  chatMessages = [
    {
        type: "ai",
        content: "Welcome! Q4 data is ready. I've detected a 14% revenue growth. How can I help?",
        timestamp: "2026-03-04T10:00:00Z"
    },
    {
        type: "user",
        content: "What drove the Oct revenue spike?",
        timestamp: "2026-03-04T10:05:00Z"
    },
    {
        type: "ai",
        content: "The October spike was primarily caused by **'Aero'** early sales, which accounted for 65% of that month's revenue.",
        timestamp: "2026-03-04T10:07:00Z"
    },
    {
        type: "user",
        content: "That is crazy, man!",
        timestamp: "2026-03-04T10:10:00Z"
    },
]