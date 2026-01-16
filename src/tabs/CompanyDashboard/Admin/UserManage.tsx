import { getUsersInfo } from "@/api/Users_api";
import {
  userListColumns,
  userListColumnsViewer,
} from "@/components/custom/columns";
import ListManager from "@/components/custom/ListManager";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { UsersList } from "@/interfaces/User_interface";
import { useAuth } from "@/route_protection/AuthContext";

export default function UserManage() {
  const { user } = useAuth();

  return (
    <Card className="w-full min-h-full">
      <CardTitle className="text-3xl font-semibold mx-auto">
        {user?.role === "Viewer" ? "Users" : "User Management"}
      </CardTitle>
      <CardContent className="">
        {user?.role === "Viewer" ? (
          <ListManager<UsersList>
            fetchFunction={getUsersInfo}
            addLink=""
            columns={userListColumnsViewer}
            addButton={false}
          />
        ) : (
          <ListManager<UsersList>
            fetchFunction={getUsersInfo}
            addLink="/company/dashboard/users/add"
            columns={userListColumns}
            addButton={true}
          />
        )}
      </CardContent>
    </Card>
  );
}
