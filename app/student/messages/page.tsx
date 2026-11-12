"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, Phone, Video, Info, MoreVertical, Send, Smile, CheckCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { actions } from "@/lib/siteActions";

export default function MessagingPage() {
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [contactsList, setContactsList] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const EMOJIS = ["😀", "😂", "😊", "😍", "👍", "🙏", "🎉", "🔥", "❤️", "😢", "🤔", "👏"];
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 1. Fetch Student Profile and Contacts
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const [profileRes, contactsRes] = await Promise.all([
          fetch("/api/student/profile"),
          fetch("/api/student/messages/contacts")
        ]);

        const profileData = await profileRes.json();
        const contactsData = await contactsRes.json();

        if (profileData.student) {
          setStudentInfo(profileData.student);
        }

        if (contactsData.success && contactsData.contacts) {
          setContactsList(contactsData.contacts);
          if (contactsData.contacts.length > 0) {
            setActiveChat(contactsData.contacts[0]);
          }
        }
      } catch (err) {
        console.error("Failed to initialize chat:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, []);

  // 2. Fetch Chat History when activeChat changes
  useEffect(() => {
    if (!activeChat || !studentInfo) return;

    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await fetch(`/api/student/messages/history?receiverId=${activeChat.id}`);
        const data = await res.json();
        if (data.success && data.messages) {
          const formatted = data.messages.map((m: any) => ({
            id: m._id,
            sender: m.senderId === studentInfo.id ? "Me" : m.senderName,
            text: m.text,
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: m.senderId === studentInfo.id ? "sent" : "received"
          }));
          setMessagesList(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [activeChat, studentInfo]);

  // 3. Connect to Socket.io server
  useEffect(() => {
    if (!studentInfo) return;

    // Connect to Socket server
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || `${window.location.protocol}//${window.location.hostname}:3001`);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
      socket.emit("join", studentInfo.id);
    });

    // Listen for incoming messages
    socket.on("receiveMessage", (message: any) => {
      // Check if message belongs to active chat contact
      if (activeChat && message.senderId === activeChat.id) {
        setMessagesList((prev) => {
          if (prev.some((m) => m.id === message._id)) return prev;
          return [
            ...prev,
            {
              id: message._id,
              sender: message.senderName,
              text: message.text,
              time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: "received"
            }
          ];
        });
      }

      // Update sidebar last message
      setContactsList((prev) =>
        prev.map((c) => {
          if (c.id === message.senderId) {
            return {
              ...c,
              lastMsg: message.text,
              time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              unread: activeChat?.id === c.id ? 0 : c.unread + 1
            };
          }
          return c;
        })
      );
    });

    // Listen for sender confirmation (optimistic UI update verification)
    socket.on("messageSent", (message: any) => {
      setMessagesList((prev) => {
        // If we find an optimistic message with same text, replace its temporary ID
        const index = prev.findIndex((m) => m.type === "sent" && m.text === message.text && m.id.startsWith("temp-"));
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            id: message._id,
            time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          return updated;
        }

        // Fallback: if not found, don't append duplicate
        if (prev.some((m) => m.id === message._id)) return prev;
        return [
          ...prev,
          {
            id: message._id,
            sender: "Me",
            text: message.text,
            time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: "sent"
          }
        ];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [studentInfo, activeChat]);

  // 4. Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesList]);

  // 5. Send Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat || !studentInfo || !socketRef.current) return;

    const payload = {
      senderId: studentInfo.id,
      senderName: studentInfo.name,
      receiverId: activeChat.id,
      text: inputText.trim()
    };

    // Emit event to Socket server
    socketRef.current.emit("sendMessage", payload);

    // Optimistically update UI
    const tempId = "temp-" + Date.now().toString();
    setMessagesList((prev) => [
      ...prev,
      {
        id: tempId,
        sender: "Me",
        text: inputText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "sent"
      }
    ]);

    // Update contacts list last message
    setContactsList((prev) =>
      prev.map((c) => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            lastMsg: inputText.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return c;
      })
    );

    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Filter contacts by search query
  const filteredContacts = contactsList.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
      {/* Sidebar - Contacts */}
      <div className="w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/30 shrink-0">
        <div className="p-6 border-b border-gray-100 bg-white">
          <h2 className="text-xl font-black text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => {
                setActiveChat(contact);
                // Clear unread local count on select
                setContactsList(prev => prev.map(c => c.id === contact.id ? { ...c, unread: 0 } : c));
              }}
              className={cn(
                "w-full p-4 flex items-center gap-4 transition-all hover:bg-white border-b border-gray-50/50",
                activeChat?.id === contact.id ? "bg-white shadow-sm border-l-4 border-l-primary font-semibold" : "opacity-75"
              )}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
                  {contact.image}
                </div>
                {contact.status === "online" && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{contact.name}</h4>
                  <span className="text-[10px] text-gray-400">{contact.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate pr-4">{contact.lastMsg}</p>
              </div>
              {contact.unread > 0 && (
                <div className="w-5 h-5 bg-primary text-white rounded-lg flex items-center justify-center text-[9px] font-black shadow-lg shadow-primary/20 shrink-0">
                  {contact.unread}
                </div>
              )}
            </button>
          ))}
          {filteredContacts.length === 0 && (
            <p className="text-center text-gray-400 text-xs py-8">No contacts found.</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 px-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold">
                  {activeChat.image}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">{activeChat.name}</h3>
                  <p className="text-[10px] font-medium text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {activeChat.status === "online" ? "Active Now" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => actions.go("/student/meetings")} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                  <Phone size={18} />
                </button>
                <button onClick={() => actions.go("/student/meetings")} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                  <Video size={18} />
                </button>
                <button onClick={() => setShowInfo((v) => !v)} aria-pressed={showInfo} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                  <Info size={18} />
                </button>
                <div className="w-px h-6 bg-gray-100 mx-2" />
                <button onClick={() => setShowMenu((v) => !v)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {showInfo && (
              <div className="px-8 py-3 bg-primary/5 border-b border-gray-100 text-xs text-gray-600 flex flex-wrap gap-x-8 gap-y-1">
                <span><b>Name:</b> {activeChat.name}</span>
                <span><b>Status:</b> {activeChat.status === "online" ? "Online" : "Offline"}</span>
                {activeChat.role && <span><b>Role:</b> {activeChat.role}</span>}
                <span><b>Messages in this chat:</b> {messagesList.length}</span>
              </div>
            )}
            {showMenu && (
              <div className="absolute right-6 top-16 z-20 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 text-sm">
                <button
                  onClick={() => {
                    navigator.clipboard
                      .writeText(messagesList.map((m: any) => `${m.type === "sent" ? "Me" : activeChat.name}: ${m.text}`).join(String.fromCharCode(10)))
                      .then(() => toast.success("Conversation copied"));
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700"
                >
                  Copy conversation
                </button>
                <button
                  onClick={() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700"
                >
                  Jump to latest message
                </button>
                <button
                  onClick={() => {
                    setActiveChat(null);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700"
                >
                  Close chat
                </button>
              </div>
            )}

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-gray-50/20">
              {loadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : (
                <>
                  <AnimatePresence initial={false}>
                    {messagesList.map((msg, i) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={cn(
                          "flex flex-col max-w-[80%]",
                          msg.type === "sent" ? "ml-auto items-end" : "mr-auto items-start"
                        )}
                      >
                        <div
                          className={cn(
                            "p-4 rounded-2xl text-sm font-medium shadow-sm break-words whitespace-pre-wrap max-w-full",
                            msg.type === "sent"
                              ? "bg-primary text-white rounded-tr-none"
                              : "bg-white border border-gray-100 text-gray-700 rounded-tl-none"
                          )}
                        >
                          {msg.text}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 px-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                            {msg.time}
                          </span>
                          {msg.type === "sent" && <CheckCheck size={12} className="text-emerald-500" />}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-6 pt-2 bg-white border-t border-gray-50">
              {showEmoji && (
                <div className="mb-2 p-3 bg-white border border-gray-100 rounded-2xl shadow-lg flex flex-wrap gap-2 w-fit">
                  {EMOJIS.map((em) => (
                    <button key={em} type="button" onClick={() => { setInputText((t) => t + em); setShowEmoji(false); }} className="text-xl hover:scale-125 transition-transform">
                      {em}
                    </button>
                  ))}
                </div>
              )}
              <form onSubmit={handleSendMessage} className="p-2 bg-gray-50 border border-gray-100 rounded-2xl flex items-end gap-2 shadow-inner group-focus-within:border-primary/20 transition-all">
                <textarea
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2.5 px-2 no-scrollbar resize-none font-medium placeholder:text-gray-400 outline-none"
                />
                <button onClick={() => setShowEmoji((v) => !v)} aria-label="Emoji" type="button" className="p-2.5 text-gray-400 hover:text-primary transition-colors">
                  <Smile size={20} />
                </button>
                <button type="submit" className="p-3 bg-primary text-white rounded-xl shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all">
                  <Send size={20} fill="currentColor" />
                </button>
              </form>
              <p className="text-center text-[10px] text-gray-400 mt-4">
                Press Enter to send, Shift + Enter for a new line.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/10">
            <h3 className="text-lg font-bold text-gray-800 mb-2">No Active Chat</h3>
            <p className="text-xs text-gray-500 max-w-sm">
              Please select a contact from the sidebar list to start exchanging messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
