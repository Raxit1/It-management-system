import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/api";
import Loader from "../components/Loader";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const chatEndRef = useRef(null);

  // FETCH HISTORICAL MESSAGES FROM DATABASE
  const fetchChatLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Get current logged in user's profile to know who is typing
      const profileRes = await API.get("/profile", { headers });
      setCurrentUserEmail(profileRes.data.user.email);

      // 2. Fetch all messages matching the current company workspace
      const chatRes = await API.get("/chat", { headers });
      setMessages(chatRes.data);
    } catch (error) {
      console.error("Failed to load secure chat records:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll screen down to latest message
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchChatLogs();
    
    // Optional: Long polling poll interval (refresh chats every 5 seconds)
    const interval = setInterval(fetchChatLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // COMMIT MESSAGE TO DATABASE
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Send structured text block to backend POST /chat endpoint
      const response = await API.post("/chat", { message: newMessage }, { headers });
      
      // Append newest message dynamically to state stream
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to route communication string:", error);
      alert("Message transmission error.");
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="page" style={{ height: "calc(100vh - 80px)", display: "flex", flexDirection: "column" }}>
          <h1 className="page-title" style={{ marginBottom: "15px" }}>Team Workspace Chat</h1>

          <div className="form-container" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden", padding: "20px" }}>
            
            {loading ? (
              <Loader message="Accessing encrypted communication logs..." />
            ) : (
              /* Message Thread Panel */
              <div className="message-history" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px", paddingBottom: "15px" }}>
                {messages.map((msg) => {
                  const isMe = msg.sender === currentUserEmail;
                  return (
                    <div key={msg.id} style={{
                      alignSelf: isMe ? "flex-end" : "flex-start",
                      maxWidth: "70%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMe ? "flex-end" : "flex-start"
                    }}>
                      <span style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px", fontWeight: "600" }}>
                        {isMe ? "You" : msg.sender}
                      </span>
                      <div style={{
                        background: isMe ? "#2563eb" : "#f1f5f9",
                        color: isMe ? "white" : "#1e293b",
                        padding: "12px 16px",
                        borderRadius: isMe ? "16px 16px 0px 16px" : "16px 16px 16px 0px",
                        fontSize: "14px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        wordBreak: "break-word"
                      }}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />

                {messages.length === 0 && (
                  <div className="empty-state" style={{ margin: "auto", color: "#94a3b8" }}>
                    Workspace message boards are empty. Type below to start talking!
                  </div>
                )}
              </div>
            )}

            {/* Input Submission Console */}
            <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "10px", borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
              <input 
                type="text" 
                placeholder="Type your message to operations..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ flex: 1, padding: "14px", borderRadius: "10px", border: "1px solid #cbd5e1" }}
                required
                disabled={loading}
              />
              <button type="submit" className="btn btn-add" style={{ margin: 0, padding: "0 25px" }} disabled={loading}>
                Send
              </button>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
}