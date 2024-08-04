import React, { useEffect, useRef, useState } from "react";
import "./adminChatContact.css";
import { useStore } from "../../../context/store";
import useApiCall from "../../../hooks/useApiCall";
import {
  ADMIN_CHAT_CONTACT,
  ADMIN_CHAT_CONTACT_WEBSOCKET,
  CHAT_USERS_MESSAGE,
  CHAT_WEBSOCKET,
} from "../../../config/backendApi";
import { IChatContacts } from "../../../interfaces/IAdminChat";
import Loading from "../../../components/common/Loading/Loading";
import { popupMessage } from "../../../utils/popupMessage";
import { useNavigate } from "react-router-dom";

const notificationSound = require("../../../assets/audio/sounds/notification_sound.mp3");
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
interface IroomDetails {
  roomName: string;
  username: string;
}
export default function AdminChatContact() {
  const { authToken, userDetails } = useStore();
  const [contacts, setContacts] = useState<IChatContacts[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<IChatContacts[]>([]);
  const { makeApiCall, loading, reload } = useApiCall();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState<string>("");
  const [newMessages, setNewMessages] = useState<IChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [chatSocket, setChatSocket] = useState<WebSocket | null>(null);
  const [contactsSocket, setContactsSocket] = useState<WebSocket | null>(null);
  const [isSocketOnline, setIsSocketOnline] = useState({
    chat: true,
    contact: true,
  });
  const chatMessagesRef = useRef<HTMLUListElement>(null);
  const [oldmessages, setOldMessages] = useState<IOldMessages[]>([]);
  const [isConnecting, setIsConnecting] = useState({
    chat: true,
    contact: true,
  });
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isReachedTop, setIsReachedTop] = useState(false);
  const [reconnect, setReconnect] = useState({ chat: true, contact: true });
  const [hasTodayMessage, setHasTodayMessage] = useState<boolean>(false);
  const [isOpenChat, setIsOpenChat] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(true);
  const [roomDetails, setRoomDetails] = useState<IroomDetails>({
    roomName: "",
    username: "",
  });
  const [notificationMessage, setNotificationMessage] =
    useState<IChatContacts | null>(null);
  // this useffect will connect to the websocket and recieve message
  useEffect(() => {
    FetchConactData();
  }, []);
  const FetchConactData = async () => {
    try {
      const url = ADMIN_CHAT_CONTACT;
      const { ok, response } = await makeApiCall(
        url,
        "get",
        {},
        true,
        authToken,
        true
      );
      if (ok) {
        setContacts(response?.data.contacts);
      }
    } catch {}
  };
  function onOpenChat(
    type: boolean,
    roomName: string = "",
    username: string = ""
  ) {
    setRoomDetails({ roomName: roomName, username: username });
    setIsOpenChat(type);
  }
  useEffect(() => {
    setIsConnecting((prev) => ({ ...prev, contact: true }));
    const contactSocket = new WebSocket(ADMIN_CHAT_CONTACT_WEBSOCKET);
    contactSocket.onopen = () => {
      setIsSocketOnline({ ...isSocketOnline, contact: true });
      setIsConnecting({ ...isConnecting, contact: false });
    };
    contactSocket.onclose = () => {
      setIsSocketOnline({ ...isSocketOnline, contact: false });
      setIsConnecting({ ...isConnecting, contact: false });
    };
    contactSocket.onmessage = (e) => {
      const new_contacts = JSON.parse(e.data);
      setNotificationMessage(new_contacts);
      console.log(
        roomDetails.roomName == "",
        roomDetails.username == "",
        roomDetails
      );
      if (roomDetails.roomName == "" || roomDetails.username == "") {
        const sound = new Audio(notificationSound);
        sound.play();
      }
    };
    setContactsSocket(contactSocket);
    return () => {
      if (contactSocket) {
        contactSocket.close();
      }
    };
  }, [reconnect.contact]);
  useEffect(() => {
    if (notificationMessage) {
      let updated_contacts = [...contacts];
      const conactExistIdx = contacts.findIndex(
        (contact) => contact.room_name == notificationMessage.room_name
      );
      let removed_contact;
      if (conactExistIdx != -1) {
        removed_contact = updated_contacts.splice(conactExistIdx, 1)[0];
        notificationMessage.total_unseen_messages =
          removed_contact.total_unseen_messages + 1;
      }
      setContacts([notificationMessage, ...updated_contacts]);
    }
  }, [notificationMessage]);
  // =========================== Message control==============================
  // this useffect will connect to the websocket and recieve message
  useEffect(() => {
    if (roomDetails.roomName && roomDetails.username) {
      setIsConnecting((prev) => ({ ...prev, chat: true }));
      const socket = new WebSocket(`${CHAT_WEBSOCKET}${roomDetails.roomName}/`);
      socket.onopen = () => {
        setIsSocketOnline({ ...isSocketOnline, chat: true });
        setIsConnecting({ ...isConnecting, chat: false });
      };
      socket.onclose = () => {
        setIsSocketOnline({ ...isSocketOnline, chat: false });
        setIsConnecting({ ...isConnecting, chat: false });
      };
      socket.onmessage = (e) => {
        const message = JSON.parse(e.data);
        setNewMessages((prev) => [...prev, message]);
      };
      setChatSocket(socket);
    } else {
      if (chatSocket) {
        chatSocket.close();
      }
      setOldMessages([]);
      setNewMessages([]);
      setIsConnecting({ ...isConnecting, chat: true });
      setIsDataFetched(false);
      setIsReachedTop(false);
      setHasTodayMessage(false);
    }

    return () => {
      if (chatSocket) {
        chatSocket.close();
      }
    };
  }, [roomDetails, reconnect.chat]);
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
    console.log("entered outer");
    if (chatMessagesRef.current && !isDataFetched) {
      console.log("entered");
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
      });
      if (oldmessages.length != 0) {
        setIsDataFetched(true);
      }
    }
  }, [oldmessages]);
  // This will sent message to websocket
  const sendMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log(messageInput, messageInput.trim());
    if (!messageInput.trim()) return;
    if (!isSocketOnline.chat) {
      popupMessage(true, "Please reconnect ");
      return;
    }
    if (chatSocket) {
      chatSocket.send(
        JSON.stringify({
          message: messageInput.trim(),
          room: roomDetails.roomName,
          username: roomDetails.username,
          is_admin: true,
        })
      );
      setMessageInput("");
    }
    const form = e.currentTarget;
    form.reset();
  };
  useEffect(() => {
    if (roomDetails.roomName && roomDetails.username) {
      fetchData();
    }
  }, [roomDetails]);
  // this will retrieve message of perticular room from user and reset all data
  const fetchData = async () => {
    if (roomDetails.roomName) {
      try {
        const days = oldmessages.length;
        setChatLoading(true);
        const url =
          CHAT_USERS_MESSAGE +
          `${roomDetails.roomName}/` +
          `${days}/` +
          "true/";
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
      } catch (err) {
      } finally {
        setChatLoading(false);
      }
    }
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
    if (filterName) {
      const regex = new RegExp(filterName, "i");
      let filteredList = contacts.filter((user) => regex.test(user.username));
      console.log(filteredList);
      setFilteredContacts(filteredList);
    } else {
      setFilteredContacts([]);
    }
  }, [filterName]);

  if (loading && reload) {
    return <Loading />;
  }

  return (
    <>
      <section className=" admin-chat-contact">
        <div className="section-center-40 admin-chat-contact-center">
          <div className="chat-contact-section">
            <div className="chat-contact-header">
              {/* <div className="status-header section-sub-heading">
                <h3>chat with customer</h3>
              </div> */}
              <div className="contact-search">
                <form action="">
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Search Contact"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                    />
                    {isConnecting.contact ? (
                      <span className="spinner loading"></span>
                    ) : isSocketOnline.contact ? (
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
                          onClick={() =>
                            setReconnect((prev) => ({
                              ...prev,
                              contact: !prev.contact,
                            }))
                          }
                        >
                          reconnect
                        </span>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
            <ul className="chat-contacts">
              {filterName != ""
                ? filteredContacts.map((item, idx) => (
                    <li
                      key={item.room_name}
                      className="chat-contact"
                      onClick={() =>
                        onOpenChat(true, item.room_name, item.username)
                      }
                    >
                      <div className="left chat-message">
                        <div className="user-logo">
                          <img
                            src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                            alt=""
                          />
                        </div>
                        <div className="user-info">
                          <h5 className="username cap">{item.username}</h5>
                          <p className="last-message">{item.latest_message}</p>
                        </div>
                      </div>
                      <div className="right chat-message">
                        <p className="last-message-date">
                          {item.last_message_date}
                        </p>
                        {item.total_unseen_messages > 0 && (
                          <div className="unseen-count">
                            <span>{item.total_unseen_messages}</span>
                          </div>
                        )}
                      </div>
                    </li>
                  ))
                : contacts.map((item, idx) => (
                    <li
                      key={item.room_name}
                      className="chat-contact"
                      onClick={() =>
                        onOpenChat(true, item.room_name, item.username)
                      }
                    >
                      <div className="left chat-message">
                        <div className="user-logo">
                          <img
                            src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                            alt=""
                          />
                        </div>
                        <div className="user-info">
                          <h5 className="username cap">{item.username}</h5>
                          <p className="last-message">{item.latest_message}</p>
                        </div>
                      </div>
                      <div className="right chat-message">
                        <p className="last-message-date">
                          {item.last_message_date}
                        </p>
                        {item.total_unseen_messages > 0 && (
                          <div className="unseen-count">
                            <span>{item.total_unseen_messages}</span>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
            </ul>
          </div>
          <div
            className={`chat-message-section ${isOpenChat ? "open" : "close"}`}
          >
            <div className="chat-message-header">
              <div
                className="back-navigation-btn cursor-pointer"
                onClick={() => onOpenChat(false)}
              >
                <span className="material-symbols-outlined">
                  arrow_back_ios_new
                </span>
              </div>
              <div className="user-profile">
                <div className="user-profile-logo">
                  <img
                    src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                    alt=""
                  />
                </div>
                <div className="user-profile-info cap">
                  {roomDetails.username}
                </div>
                {isConnecting.chat ? (
                  <span className="spinner loading"></span>
                ) : isSocketOnline.chat ? (
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
                      onClick={() =>
                        setReconnect((prev) => ({ ...prev, chat: !prev.chat }))
                      }
                    >
                      reconnect
                    </span>
                  </>
                )}
              </div>
            </div>
            <ul className="chat-message-body" ref={chatMessagesRef}>
              {chatLoading && !reload && !isReachedTop && (
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
                        message.is_admin ? "right" : "left"
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
                      message.is_admin ? "right" : "left"
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
