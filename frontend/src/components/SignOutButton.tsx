import { useMutation, useQueryClient } from "react-query";
import  * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {
    const queryClient = useQueryClient();
        const {showToast} = useAppContext();

    const mutation = useMutation(apiClient.signOut, {
        //when ever we click signout it will run this async function andit will give us expired token, and in Appcontext.tsx isLoggedIn {isError} going to be true .
        onSuccess: async() =>{
            await queryClient.invalidateQueries("validateToken")
            //showToast
            showToast({message: "Signed Out", type: "SUCCESS"});
        }, 
        onError:(error: Error) => {
            //show toast
            showToast({message: error.message, type:"ERROR"});
        },
    });

    const handleClick = () => {
        mutation.mutate();
    };
  return (
    <button onClick={handleClick} className="text-blue-700 px-3  font-bold bg-white hover:bg-gray-100 rounded-sm">
        Sign Out
    </button>
  );
};

export default SignOutButton;
