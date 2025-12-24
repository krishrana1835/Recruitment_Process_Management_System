import { getAllJobs } from "@/api/Job_api";
import { jobListColumns, jobListColumnsViewer } from "@/components/custom/jobscolumns";
import ListManager from "@/components/custom/ListManager";
import type { ListAllJobsDto } from "@/interfaces/Jobs_interface";
import { useAuth } from "@/route_protection/AuthContext";

export default function JobManage() {
  const {user} = useAuth();

  if(user?.role === "Viewer"){
    return (
    <ListManager<ListAllJobsDto>
      fetchFunction={getAllJobs}
      addLink=""
      columns={jobListColumnsViewer}
      addButton={false}
    />
  );
  }else{
    return (
    <ListManager<ListAllJobsDto>
      fetchFunction={getAllJobs}
      addLink="/company/dashboard/jobs/add"
      columns={jobListColumns}
      addButton={true}
    />
  );
  }
}
