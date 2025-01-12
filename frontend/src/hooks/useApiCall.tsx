import { useState } from "react";
import axios, { Method } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config/backendApi";
import { useStore } from "../context/store";

interface ApiResponse<T> {
  ok: boolean;
  response?: {
    error?: string;
    data?: any;
  };
}
interface UseApiCallResponse<T> {
  makeApiCall: (
    url: string,
    method?: Method,
    data?: any,
    isHeader?: boolean,
    token?: string | null,
    reload?: boolean
  ) => Promise<ApiResponse<T>>;
  loading: boolean;
  isDataFetched: boolean;
  reload: boolean;
}

const useApiCall = <T,>(): UseApiCallResponse<T> => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDataFetched, setIsDataFetched] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(true);
  const { pathname } = useLocation();

  const makeApiCall = async (
    url: string,
    method: Method = "get",
    data: any = null,
    isHeader: boolean = false,
    token: string | null = null,
    reload: boolean = true
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    if (reload) {
      setReload(true);
    } else {
      setReload(false);
    }
    try {
      const headers = isHeader ? { Authorization: `Token ${token}` } : {};
      const absoluteUrl = `${BACKEND_URL}${url}`;
      const response = await axios({
        method,
        url: absoluteUrl,
        data,
        headers,
      });
      setLoading(false);
      setIsDataFetched(true);
      return { ok: true, response: { data: response.data } };
    } catch (error: any) {
      setLoading(false);
      sessionStorage.setItem("isErrorPage", "true");
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 403:
            navigate(`/error/403/?back_url=${pathname}`, {
              state: { is_error: true },
            });
            throw new Error(data.error); // Stop execution here
          case 404:
            navigate(`/error/404/?back_url=${pathname}`, {
              state: { is_error: true },
            });
            throw new Error(data.error); // Stop execution here
          case 401:
            navigate(`/signin`);
            throw new Error(data.error); // Stop execution here
          case 500:
            navigate(`/error/500/?back_url=${pathname}`, {
              state: { is_error: true },
            });
            throw new Error(data.error); // Stop execution here
          case 503:
            navigate(`/error/503/?back_url=${pathname}`, {
              state: { is_error: true },
            });
            throw new Error(data.error); // Stop execution here
          case 400:
            navigate(`/error/400/?back_url=${pathname}`, {
              state: { is_error: true },
            });
            throw new Error(data.error); // Stop execution here
          case 405:
            navigate(`/error/400/?back_url=${pathname}`, {
              state: { is_error: true },
            });
            throw new Error(data.error); // Stop execution here
          default:
            sessionStorage.removeItem("isErrorPage");
            return {
              ok: false,
              response: { error: data.error },
            };
        }
      } else {
        sessionStorage.removeItem("isErrorPage");
        navigate(`/error/503/?back_url=${pathname}`, {
          state: { is_error: true },
        });
        throw new Error("Service Unavailable");
      }
    }
  };

  return { makeApiCall, loading, isDataFetched, reload };
};

export default useApiCall;
