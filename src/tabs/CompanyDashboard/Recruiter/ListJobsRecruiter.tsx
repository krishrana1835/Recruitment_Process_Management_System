import { getAllJobs, getScheduledJobs } from "@/api/Job_api";
import {
  jobListColumnsInterviewer,
  jobListColumnsRecruiter,
} from "@/components/custom/jobscolumns";
import ListManager from "@/components/custom/ListManager";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { ListAllJobsDto } from "@/interfaces/Jobs_interface";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/route_protection/AuthContext";

export default function ListJobsRecruiter() {
  const { user } = useAuth();
  return (
    <Card className="p-6 w-full min-h-full bg-white text-black shadow-sm">
      <CardTitle className="text-3xl font-semibold mx-auto">
        Interview Schedule
      </CardTitle>
      <CardContent className="w-full">
        <hr className="mb-4" />
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold"></h1>

          {(user?.role === "Admin" || user?.role === "Recruiter") && (
            <Link to="/company/dashboard/manage-interview-types">
              <Button className="bg-black text-white hover:bg-gray-800">
                Manage Interview Types
              </Button>
            </Link>
          )}
        </div>

        <ListManager<ListAllJobsDto>
          fetchFunction={
            user?.role === "Recruiter" ||
            user?.role === "Admin" ||
            user?.role === "Viewer"
              ? getAllJobs
              : getScheduledJobs
          }
          addLink=""
          fetchArgs={
            user?.role === "Recruiter" ||
            user?.role === "Admin" ||
            user?.role === "Viewer"
              ? []
              : ["Scheduled"]
          }
          columns={
            user?.role === "Recruiter" || user?.role === "Admin"
              ? jobListColumnsRecruiter
              : jobListColumnsInterviewer
          }
          addButton={false}
        />
      </CardContent>
    </Card>
  );
}
