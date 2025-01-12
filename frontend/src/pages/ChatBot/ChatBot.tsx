import React, { useEffect, useRef, useState } from "react";
import "./chatbot.css";
import { useStore } from "../../context/store";
import useApiCall from "../../hooks/useApiCall";
import {
  ADMIN_CHAT_CONTACT_WEBSOCKET,
  CHAT_USERS_MESSAGE,
  CHAT_WEBSOCKET,
} from "../../config/backendApi";
import { popupMessage } from "../../utils/popupMessage";
import { useNavigate, useParams } from "react-router-dom";
interface IChatMessage {
  message: string;
  is_admin: boolean;
  username: string;
  message_at: string;
}
interface IOldMessages {
  date: string;
  messages: IChatMessage[];
}
export default function AdminChatMessage() {
  const { roomName, username } = useParams();
  const { authToken, userDetails } = useStore();
  const { makeApiCall, loading, reload } = useApiCall();
  const [newMessages, setNewMessages] = useState<IChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [chatSocket, setChatSocket] = useState<WebSocket | null>(null);
  const [isSocketOnline, setIsSocketOnline] = useState<boolean>(true);
  const chatMessagesRef = useRef<HTMLUListElement>(null);
  const [oldmessages, setOldMessages] = useState<IOldMessages[]>([]);
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isReachedTop, setIsReachedTop] = useState(false);
  const [reconnect, setReconnect] = useState(false);
  const [hasTodayMessage, setHasTodayMessage] = useState<boolean>(false);
  const [contactsSocket, setContactsSocket] = useState<WebSocket | null>(null);
  const navigate = useNavigate();
  // this useffect will connect to the websocket and recieve message
  useEffect(() => {
    setIsConnecting(true);
    const socket = new WebSocket(`${CHAT_WEBSOCKET}${roomName}/`);
    socket.onopen = () => {
      setIsSocketOnline(true);
      setIsConnecting(false);
    };
    socket.onclose = () => {
      setIsSocketOnline(false);
      setIsConnecting(false);
    };
    socket.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setNewMessages((prev) => [...prev, message]);
    };
    setChatSocket(socket);

    return () => {
      if (chatSocket) {
        chatSocket.close();
      }
    };
  }, [roomName, reconnect]);
  // this will scroll to bottom when come new message
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [newMessages]);
  // this will scroll to bottom when come old message
  useEffect(() => {
    if (chatMessagesRef.current && !isDataFetched) {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
      });
      setIsDataFetched(true);
    }
  }, [oldmessages]);
  // This will sent message to websocket
  const sendMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    if (!isSocketOnline) {
      popupMessage(true, "Please try again later");
      return;
    }
    if (chatSocket) {
      chatSocket.send(
        JSON.stringify({
          message: messageInput.trim(),
          room: roomName,
          username: userDetails.username,
          is_admin: false,
        })
      );
      
      if (contactsSocket) {
        console.log("contact message sented");
        contactsSocket.send(
          JSON.stringify({
            room_name: roomName,
            username: userDetails.username,
            new_message: messageInput.trim(),
          })
        );
      }
      setMessageInput("");
    }
    const form = e.currentTarget;
    form.reset();
  };
  useEffect(() => {
    fetchData();
  }, []);
  // this will retrieve message of perticular room from user and reset all data
  const fetchData = async () => {
    try {
      const days = oldmessages.length;
      const url = CHAT_USERS_MESSAGE + `${roomName}/` + `${days}/` + "false/";
      const { ok, response } = await makeApiCall(
        url,
        "get",
        {},
        true,
        authToken,
        false
      );
      if (ok) {
        if (response?.data.messages.length == 0) {
          setIsReachedTop(true);
        }
        if (oldmessages.length == 0) {
          setHasTodayMessage(response?.data.has_today);
        }
        setOldMessages([...response?.data.messages, ...oldmessages]);
      }
    } catch (err) {}
  };

  // when user got to the top then fetch more date data
  useEffect(() => {
    const chatMessagesContainer = chatMessagesRef.current;
    const handleScroll = () => {
      if (
        chatMessagesContainer &&
        chatMessagesContainer.scrollTop === 0 &&
        !isReachedTop
      ) {
        // Fetch more messages
        chatMessagesContainer.scrollTop = 20;
        fetchData();
      }
    };
    if (chatMessagesContainer) {
      chatMessagesContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (chatMessagesContainer) {
        chatMessagesContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [newMessages, oldmessages]);

  useEffect(() => {
    const url = ADMIN_CHAT_CONTACT_WEBSOCKET;
    const contactSocket = new WebSocket(ADMIN_CHAT_CONTACT_WEBSOCKET);
    contactSocket.onopen = () => {
      console.log("contact socket just connected");
    };
    contactSocket.onclose = () => {
      console.log("contact socket just disconnected");
    };
    contactSocket.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log(`new message from contact is ${message}`);
    };
    setContactsSocket(contactSocket);
    return () => {
      if (contactSocket) {
        contactSocket.close();
      }
    };
  }, []);
  return (
    <>
      <section className="user-chat-message">
        <div className="section-center-40 user-chat-message-center">
          <div className={`chat-message-section`}>
            <div className="chat-message-header">
              <div className="user-profile">
                <div className="user-profile-logo">
                  <img
                    src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                    alt=""
                  />
                </div>
                <div className="user-profile-info cap">
                  {userDetails.username}
                </div>
                {isConnecting ? (
                  <span className="spinner loading"></span>
                ) : isSocketOnline && !isConnecting ? (
                  <span className="material-symbols-outlined state-icon-online green">
                    wifi
                  </span>
                ) : (
                  <>
                    <span className="material-symbols-outlined state-icon-offline cursor-pointer red">
                      wifi_off
                    </span>
                    <span
                      className="link small-text middle"
                      onClick={() => setReconnect((prev) => !prev)}
                    >
                      reconnect
                    </span>
                  </>
                )}
              </div>
            </div>
            <ul className="chat-message-body" ref={chatMessagesRef}>
              {loading && !reload && !isReachedTop && (
                <div className="loading"></div>
              )}
              {isReachedTop && <li className="chat-reach-end">Chat Ended</li>}
              {oldmessages.map((item, idx) => (
                <>
                  <li className="chats-date">
                    <span>{item.date}</span>
                  </li>
                  {item.messages.map((message, idx) => (
                    <li
                      className={`chat-message chat-message ${
                        message.is_admin ? "left" : "right"
                      }`}
                    >
                      <div className="chat-message-logo">
                        <img
                          src={
                            message.is_admin
                              ? "https://as2.ftcdn.net/v2/jpg/01/37/42/39/1000_F_137423968_fIHWkbv2LoqPQh7iPOuTpIscXBFiprxL.jpg"
                              : "https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                          }
                          alt=""
                        />
                      </div>
                      <div className="chat-message-info">
                        <div className="message">{message.message}</div>
                        <div className="date">{message.message_at}</div>
                      </div>
                    </li>
                  ))}
                </>
              ))}
              {newMessages.length != 0 && !hasTodayMessage && (
                <li className="chats-date">
                  <span>{"Today"}</span>
                </li>
              )}
              {newMessages.map((message, idx) => (
                <>
                  <li
                    className={`chat-message chat-message ${
                      message.is_admin ? "left" : "right"
                    }`}
                  >
                    <div className="chat-message-logo">
                      <img
                        src={
                          message.is_admin
                            ? "https://as2.ftcdn.net/v2/jpg/01/37/42/39/1000_F_137423968_fIHWkbv2LoqPQh7iPOuTpIscXBFiprxL.jpg"
                            : "https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                        }
                        alt=""
                      />
                    </div>
                    <div className="chat-message-info">
                      <div className="message">{message.message}</div>
                      <div className="date">{message.message_at}</div>
                    </div>
                  </li>
                </>
              ))}
            </ul>
            <div className="chat-message-footer">
              <form action="" onSubmit={sendMessage}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Enter message here"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <button type="submit">
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
