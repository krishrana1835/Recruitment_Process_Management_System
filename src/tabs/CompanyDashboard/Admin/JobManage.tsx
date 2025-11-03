import { getAllJobs } from "@/api/Job_api";
import { jobListColumns } from "@/components/custom/jobscolumns";
import ListManager from "@/components/custom/ListManager";
import type { ListAllJobsDto } from "@/interfaces/Jobs_interface";

export default function JobManage() {
  return (
    <ListManager<ListAllJobsDto>
      fetchFunction={getAllJobs}
      addLink="/company/dashboard/jobs/add"
      columns={jobListColumns}
      addButton={true}
    />
  );
}
