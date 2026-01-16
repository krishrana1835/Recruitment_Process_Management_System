import { getAllJobs } from "@/api/Job_api";
import {
  jobListColumns,
  jobListColumnsViewer,
} from "@/components/custom/jobscolumns";
import ListManager from "@/components/custom/ListManager";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { ListAllJobsDto } from "@/interfaces/Jobs_interface";
import { useAuth } from "@/route_protection/AuthContext";

export default function JobManage() {
  const { user } = useAuth();

  return (
    <Card className="w-full min-h-full">
      <CardTitle className="text-3xl font-semibold mx-auto">
        {user?.role === "Viewer" ? "Jobs" : "Job Management"}
      </CardTitle>
      <CardContent className="">
        {user?.role === "Viewer" ? (
          <ListManager<ListAllJobsDto>
            fetchFunction={getAllJobs}
            addLink=""
            columns={jobListColumnsViewer}
            addButton={false}
          />
        ) : (
          <ListManager<ListAllJobsDto>
            fetchFunction={getAllJobs}
            addLink="/company/dashboard/jobs/add"
            columns={jobListColumns}
            addButton={true}
          />
        )}
      </CardContent>
    </Card>
  );
}
