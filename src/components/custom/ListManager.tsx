import { useEffect, useState } from "react";
import { DataTable } from "@/components/custom/data-table";
import { Card } from "@/components/ui/card";
import { Atom } from "react-loading-indicators";
import { useAuth } from "@/route_protection/AuthContext";
import { MdOutlineAdd } from "react-icons/md";
import { Link } from "react-router-dom";

interface ListManagerProps<T> {
  /** API function to fetch the list (returns Promise<T[]>) */
  fetchFunction: (...args: any[]) => Promise<T[]>;
  /** Optional arguments to pass before token */
  fetchArgs?: any[];
  /** Route for the Add button */
  addLink: string;
  /** Table column configuration */
  columns: any;
  /** Show or hide Add button */
  addButton: boolean;
}

/**
 * Generic ListManager that can handle any fetch function and arguments dynamically.
 */
export default function ListManager<T>({
  fetchFunction,
  fetchArgs = [],
  addLink,
  columns,
  addButton,
}: ListManagerProps<T>) {
  const [dataList, setDataList] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAuth();

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
        const args = fetchArgs.length > 0 ? [...fetchArgs, user.token] : [user.token];
        const result = await fetchFunction(...args);
        setDataList(result);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, JSON.stringify(fetchArgs)]); // re-fetch if user or args change

  if (loading) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center">
        <Atom color="#000000" size="medium" text="Loading..." />
      </Card>
    );
  }

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
        <div>
          {addButton && (
            <div className="w-full flex justify-end mb-2">
              <Link
                to={addLink}
                className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 
               text-sm font-medium text-white shadow-sm transition 
               hover:bg-gray-900 hover:shadow-md focus:outline-none 
               focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                <MdOutlineAdd className="text-lg" />
                Add
              </Link>
            </div>
          )}
          <DataTable columns={columns} data={dataList} />
        </div>
      )}
    </Card>
  );
}
