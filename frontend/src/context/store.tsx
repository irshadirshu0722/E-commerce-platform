import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useRef,
  Ref,
  RefObject,
  LegacyRef,
} from "react";
import useApiCall from "../hooks/useApiCall";
import Loading from "../components/common/Loading/Loading";
import * as backend from "../config/backendApi";
import {
  IBankDetails,
  IPaymentModes,
  IDeliveryDetails,
} from "../interfaces/IPlaceOrder";
interface IUserDetails {
  username: string;
  email: string;
  quantity: number;
  roomName:string;
  is_admin:boolean
}

interface IStoreContext {
  isUser: boolean;
  userDetails: IUserDetails;
  authToken: string;
  saveAuthToken: (authToken: string) => void;
  Logout: () => void;
  setUserDetails: Function;
  paymentModes?: IPaymentModes;
  contactDetails?: IBankDetails;
  deliveryDetails?: IDeliveryDetails;
  isErrorPage: boolean;
  setIsErrorPage: Function;
  setSearchHistory: (searchName: string) => void;
  navBarRef: RefObject<HTMLDivElement>;
  footerRef: RefObject<HTMLElement>;
  chatBotRef: RefObject<HTMLElement>;
}

const GlobalContext = createContext<IStoreContext | undefined>(undefined);

export const useStore = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
interface StoreProviderProps {
  children: ReactNode;
}
const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [isUser, setIsUser] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<IUserDetails>({
    username: "",
    email: "",
    quantity: 0,
    roomName:"",
    is_admin:false
  });
  const [authToken, setAuthToken] = useState<string>("");
  const { makeApiCall, loading } = useApiCall();
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [globalDataFetched, setGlobalDataFetched] = useState<boolean>(false);
  const [paymentModes, setPaymentModes] = useState<IPaymentModes>();
  const [contactDetails, setContactDetails] = useState<IBankDetails>();
  const [deliveryDetails, setDeliveryDetails] = useState<IDeliveryDetails>();
  const [isErrorPage, setIsErrorPage] = useState<boolean>(false);
  const navBarRef = useRef(null)
  const footerRef = useRef(null)
  const chatBotRef = useRef(null)
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchGlobalData();
  }, []);

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      setAuthToken(authToken || "");
      if (authToken) {
        const { ok, response } = await makeApiCall(
          backend.TOKEN_VERIFY_ENDPOINT,
          "get",
          null,
          true,
          authToken
        );
        if (ok && response) {
          setIsUser(true);
          setUserDetails({
            is_admin:response.data.is_admin || false,
            email: response.data.email,
            quantity: response.data.quantity,
            username: response.data.username,
            roomName: response.data.room_name,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching authentication data:", error);
    } finally {
      setLoadingAuth(false);
    }
  };
  const fetchGlobalData = async () => {
    try {
      const { ok, response } = await makeApiCall(
        backend.GLOBAL_DATA,
        "get",
        null,
        false,
        null,
        true
      );
      if (ok && response) {
        setContactDetails(response.data.contact_details);
        setPaymentModes(response.data.payment_mode);
        setDeliveryDetails(response.data.delivery_details);
      }
    } catch (error) {
      console.error("Error fetching authentication data:", error);
    } finally {
      setGlobalDataFetched(true);
    }
  };
  const saveAuthToken = (authToken: string) => {
    localStorage.setItem("authToken", authToken);
    setIsUser(true);
    setAuthToken(authToken);
  };
  const Logout = () => {
    localStorage.removeItem("authToken");
    setIsUser(false);
    setAuthToken("");
    setUserDetails({ email: "", username: "", quantity: 0,roomName:'',is_admin:false });
  };

  function setSearchHistory(searchName: string) {
    console.log(searchName)
    const searchHistory = localStorage.getItem("searchHistory");
    console.log(searchHistory);
    if (searchHistory) {
      const searchHistoryList: string[] = JSON.parse(searchHistory);
      searchHistoryList.unshift(searchName);
      if(searchHistoryList.length>=10){
        searchHistoryList.pop()
      }
      console.log(searchHistoryList);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistoryList));
    } else {
      localStorage.setItem("searchHistory", JSON.stringify([]));
    }
  }
  if (loading || loadingAuth || !globalDataFetched) {
    return <Loading />;
  }

  return (
    <GlobalContext.Provider
      value={{
        isUser,
        userDetails,
        authToken,
        saveAuthToken,
        Logout,
        setUserDetails,
        paymentModes,
        contactDetails,
        deliveryDetails,
        isErrorPage,
        setIsErrorPage,
        setSearchHistory,
        navBarRef,
        footerRef,
        chatBotRef,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default StoreProvider;
