import "./chatComponent.css";
import { Paperclip, Send, Search, Sparkles } from 'lucide-react';



function ChatComponent() {
  return (
        <section className="chat-panel">
        <div className="chat-header">
            <h3>AI Assistant Chat</h3>
            <p>Context: Q4_Sales_Report.xlsx</p>
        </div>

        <div className="chat-messages">
            {/* AI Message */}
            <div className="message ai-message">
            <div className="avatar ai-avatar"><Sparkles size={14} /></div>
            <div className="bubble">
                Welcome! Q4 data is ready. I've detected a 14% revenue growth. How can I help?
            </div>
            </div>

            {/* User Message */}
            <div className="message user-message">
            <div className="bubble">
                What drove the Oct revenue spike?
            </div>
            </div>

            {/* AI Message with detailed breakdown */}
            <div className="message ai-message">
            <div className="avatar ai-avatar"><Sparkles size={14} /></div>
            <div className="bubble">
                The October spike was primarily caused by **'Aero'** early sales, which accounted for 65% of that month's revenue.
            </div>
            </div>
        </div>

        <div className="chat-footer">
            <div className="suggestion-chips">
            <button className="chip"><Search size={12} /> Find outliers</button>
            <button className="chip">Pivot by Category</button>
            </div>
            
            <div className="input-container">
            <button className="attachment-btn"><Paperclip size={18} /></button>
            <input type="text" placeholder="Ask AI about your data..." />
            <button className="send-btn"><Send size={18} /></button>
            </div>
        </div>
        </section>
   
  );
}

export default ChatComponent;




