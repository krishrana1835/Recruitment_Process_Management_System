import { getAllJobs } from "@/api/Job_api";
import {
  jobListColumnsInterviewer,
  jobListColumnsRecruiter,
} from "@/components/custom/jobscolumns";
import ListManager from "@/components/custom/ListManager";
import { Card } from "@/components/ui/card";
import type { ListAllJobsDto } from "@/interfaces/Jobs_interface";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/route_protection/AuthContext";

export default function ListJobsRecruiter() {
  const { user } = useAuth();
  return (
    <Card className="p-6 w-full min-h-full bg-white text-black shadow-sm">
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
        fetchFunction={getAllJobs}
        addLink=""
        columns={
          user?.role === "Recruiter" || user?.role === "Admin"
            ? jobListColumnsRecruiter
            : jobListColumnsInterviewer
        }
        addButton={false}
      />
    </Card>
  );
}
