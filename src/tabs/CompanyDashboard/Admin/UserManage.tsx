import { getUsersInfo } from "@/api/Users_api";
import type { UsersList } from "@/interfaces/User_interface";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/custom/data-table";
import { Card } from "@/components/ui/card";
import { userListColumns } from "@/components/custom/column";
import { Atom } from "react-loading-indicators";
import { useAuth } from "@/route_protection/AuthContext";
import { MdOutlineAdd } from "react-icons/md";
import { Link } from "react-router-dom";

/**
 * UserManage component displays a list of users in a data table.
 * It fetches user information from the API, handles loading and error states,
 * and provides an option to add new users.
 */
export default function UserManage() {
  // State to store the list of users
  const [userList, setUserList] = useState<UsersList[] | null>(null);
  // State for error handling
  const [error, setError] = useState<string | null>(null);
  // State for loading indicator
  const [loading, setLoading] = useState<boolean>(true);

  // Get user authentication context
  const {user} = useAuth ();

  // Effect hook to fetch user data when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      setError(null); // Clear any previous errors
      setLoading(true); // Set loading to true
      try {
        // Check for authenticated user
        if(!user){
          setError("No user logged in");
          return;
        }
        // Check for user token
        if(!user?.token){
          setError("No token found for the logged-in user.");
          return;
        }
        if(error) return; // If there's an existing error, prevent fetching
        // Fetch user information from the API
        const res = await getUsersInfo(user.token);
        setUserList(res); // Set the fetched user list
      } catch (error: Error | any) {
        setError(error.message); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };
    fetchUsers(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once on mount

  // Display loading indicator while data is being fetched
  if (loading) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center">
        <Atom
        color="#000000"
        size="medium"
        text="Loading..."
        textColor=""
      />
      </Card>
    );
  }

  // Display error message if an error occurred
  if (error) {
    return <div className="flex items-center justify-center w-full h-full text-red-500">Error: {error}</div>;
  }

  return (
    <Card className="w-full p-4">
      {
        userList && ( // Render the data table only if userList is available
          <div className="">
            <div className="w-full flex justify-end">
              {/* Link to add new user page */}
              <Link to="/company/dashboard/users/add" className="w-auto cursor-pointer flex flex-row justify-center items-center gap-2 outline p-2 shadow-md rounded-lg bg-gray-500 text-white hover:bg-black hover:text-white duration-300"><MdOutlineAdd /> Add</Link>
            </div>
            {/* Render the DataTable component with user data and columns */}
            <DataTable columns={userListColumns} data={userList} />
          </div>
        )
      }
    </Card>
  );
}
