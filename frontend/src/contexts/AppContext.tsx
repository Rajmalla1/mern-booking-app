import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";


type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
  }

type AppContext = {
    showToast: (toastMessage: ToastMessage) => void;
    isLoggedIn:boolean;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    //instead of showing those value on console we take showtoast  here  and set t inot set toast
      const [toast, setToast] = useState<ToastMessage | undefined> (undefined);
    
     //validate token to check if user is logged  in, 
      const { isError } = useQuery("validateToken", apiClient.validateToken,{
        retry: false,
      });

      return (
        <AppContext.Provider
          value={{
            showToast: (toastMessage) => {
              setToast(toastMessage);
            },
            isLoggedIn: !isError,
            
          }}
        >
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(undefined)}
            />
          )}
          {children}
        </AppContext.Provider>
      );
    };
    
    export const useAppContext = () => {
      const context = useContext(AppContext);
      return context as AppContext;
    };