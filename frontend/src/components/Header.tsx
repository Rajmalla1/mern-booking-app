import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from '../components/SignOutButton'


const Header = () => {
  const {isLoggedIn} = useAppContext();
  return (
    <div className="bg-blue-900 py-6">
  <div className="container mx-auto flex justify-between">
    <span className="text-3xl text-white font-bold tracking-tight">
      <Link to="/">RajHolidays.com</Link>
    </span>
    <span className="flex space-x-2">
      {isLoggedIn ? 
      <>
      <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-700 rounded-sm" to = "/my-bookings">My Bookings</Link>
      <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-700 rounded-sm" to = "/my-dorms">My Hotels</Link>
      <SignOutButton />
      </>: 
      (<Link to="/sign-in" className="bg-white flex rounded-sm items-center text-blue-600 px-3 font-bold hover:bg-gray-200">Sign In</Link>)}
      
    </span>
  </div>
</div>

    
  )
};

export default Header;
