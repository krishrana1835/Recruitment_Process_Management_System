import { getUsersInfo } from "@/api/Users_api";
import {
  userListColumns,
  userListColumnsViewer,
} from "@/components/custom/columns";
import ListManager from "@/components/custom/ListManager";
import type { UsersList } from "@/interfaces/User_interface";
import { useAuth } from "@/route_protection/AuthContext";

export default function UserManage() {
  const { user } = useAuth();

  if (user?.role === "Viewer") {
    return (
      <ListManager<UsersList>
        fetchFunction={getUsersInfo}
        addLink=""
        columns={userListColumnsViewer}
        addButton={false}
      />
    );
  } else {
    return (
      <ListManager<UsersList>
        fetchFunction={getUsersInfo}
        addLink="/company/dashboard/users/add"
        columns={userListColumns}
        addButton={true}
      />
    );
  }
}
