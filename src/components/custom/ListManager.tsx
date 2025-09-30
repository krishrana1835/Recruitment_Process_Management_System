import { useEffect, useState } from "react";
import { DataTable } from "@/components/custom/data-table";
import { Card } from "@/components/ui/card";
import { Atom } from "react-loading-indicators";
import { useAuth } from "@/route_protection/AuthContext";
import { MdOutlineAdd } from "react-icons/md";
import { Link } from "react-router-dom";

/**
 * Props for the ListManager component.
 * @template T - The type of data being listed.
 */
interface ListManagerProps<T> {
  /** API function to fetch the list (must return Promise<T[]>) */
  fetchFunction: (token: string) => Promise<T[]>;
  /** Route to navigate to on "Add" button click */
  addLink: string;
  /** Column configuration for the DataTable */
  columns: any;
  /** Show Add button on page */
  addButton: boolean;
}

/**
 * ListManager is a reusable component that fetches and displays a list of data
 * (e.g., users, candidates) using a generic table layout.
 *
 * It handles loading, authentication, and error states automatically.
 *
 * @template T - The type of data being listed (e.g., UsersList or CandidateListDto)
 * @param {ListManagerProps<T>} props - The props for the component.
 * @returns {JSX.Element} The ListManager component.
 */
export default function ListManager<T>({ fetchFunction, addLink, columns, addButton }: ListManagerProps<T>) {
  const [dataList, setDataList] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAuth();

  /**
   * Fetches the data when the component mounts.
   */
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setLoading(true);

      if (!user) {
        setError("No user is logged in.");
        setLoading(false);
        return;
      }

      if (!user.token) {
        setError("No token found for the logged-in user.");
        setLoading(false);
        return;
      }

      try {
        const result = await fetchFunction(user.token);
        setDataList(result);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Display a loading indicator while fetching data.
  if (loading) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center">
        <Atom color="#000000" size="medium" text="Loading..." />
      </Card>
    );
  }

  // Display an error message if fetching data fails.
  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <Card className="w-full p-4">
      {dataList && (
        <div className="">
          {
            // Conditionally render the "Add" button.
            addButton ? (
              <div className="w-full flex justify-end mb-2">
            <Link
              to={addLink}
              className="flex items-center gap-2 p-2 shadow-md rounded-lg bg-gray-600 text-white hover:bg-black duration-200"
            >
              <MdOutlineAdd />
              Add
            </Link>
          </div>
            ):(<></>)
          }
          <DataTable columns={columns} data={dataList} />
        </div>
      )}
    </Card>
  );
}