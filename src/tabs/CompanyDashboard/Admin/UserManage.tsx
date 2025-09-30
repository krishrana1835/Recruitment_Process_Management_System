import { getUsersInfo } from "@/api/Users_api";
import { userListColumns } from "@/components/custom/columns";
import ListManager from "@/components/custom/ListManager";
import type { UsersList } from "@/interfaces/User_interface";

export default function UserManage() {
  return (
    <ListManager<UsersList>
      fetchFunction={getUsersInfo}
      addLink="/company/dashboard/users/add"
      columns={userListColumns}
      addButton={true}
    />
  );
}
