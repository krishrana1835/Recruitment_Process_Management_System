import { getUsersInfo } from "@/api/Users_api";
import type { UsersList } from "@/interfaces/User_interface";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/custom/data-table";
import { Card } from "@/components/ui/card";
import { userListColumns } from "@/components/custom/column";
import { Atom } from "react-loading-indicators";

export default function UserManage() {
  const [userList, setUserList] = useState<UsersList[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setError(null);
      setLoading(true);
      try {
        const res = await getUsersInfo();
        setUserList(res);
      } catch (error: Error | any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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

  if (error) {
    return <div className="flex items-center justify-center w-full h-full text-red-500">Error: {error}</div>;
  }

  return (
    <Card className="w-full p-4">
      {userList && <DataTable columns={userListColumns} data={userList} />}
    </Card>
  );
}
