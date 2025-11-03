import { getAllJobs } from "@/api/Job_api";
import { jobListColumnsReviewer } from "@/components/custom/jobscolumns";
import ListManager from "@/components/custom/ListManager";
import type { ListAllJobsDto } from "@/interfaces/Jobs_interface";

export default function ListJobsRecruiter() {
  return (
    <ListManager<ListAllJobsDto>
      fetchFunction={getAllJobs}
      addLink=""
      columns={jobListColumnsReviewer}
      addButton={false}
    />
  );
}