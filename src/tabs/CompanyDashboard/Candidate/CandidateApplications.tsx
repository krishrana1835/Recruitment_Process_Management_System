import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Atom } from "react-loading-indicators";
import { notify } from "@/components/custom/Notifications";
import { useAuth } from "@/route_protection/AuthContext";
import { getJobApplications } from "@/api/Candidate_Status_History_api";
import type { ListJobApplicationStatus } from "@/interfaces/Candidate_Status_History_interface";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function CandidateApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ListJobApplicationStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) {
        notify.error("User not authenticated.");
        return;
      }
      if (!user.token) {
        notify.error("User token not found.");
        return;
      }

      try {
        setLoading(true);
        const response = await getJobApplications(user.userId, user.token);
        setApplications(response);
      } catch (error: any) {
        console.error("Error fetching applications:", error);
        notify.error(error.message || "Failed to fetch applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Atom color="#000000" size="medium" text="Loading..." textColor="#000" />
      </div>
    );

  if (applications.length === 0)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-700 text-lg">No job applications found.</p>
      </div>
    );

  // Group applications by job title
  const groupedApplications = applications.reduce((acc, app) => {
    if (!acc[app.job.job_title]) acc[app.job.job_title] = [];
    acc[app.job.job_title].push(app);
    return acc;
  }, {} as Record<string, ListJobApplicationStatus[]>);

  return (
    <div className="flex flex-col items-start bg-gray-50 min-h-screen p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-[#004080] mb-6">My Job Applications</h1>
      <Card className="w-full shadow-lg border border-gray-200 bg-white text-black">
        <CardContent className="space-y-4">
          {Object.entries(groupedApplications).map(([jobTitle, jobApps]) => (
            <Collapsible key={jobTitle} className="border-b border-gray-200 last:border-b-0">
              <CollapsibleTrigger className="w-full flex justify-between items-center py-3 cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className="text-lg font-medium text-black">{jobTitle}</h3>
                  <Badge variant="outline" className="text-sm border-gray-300">
                    Job Status: {jobApps[jobApps.length - 1].job.status?.status || "Unknown"}
                  </Badge>
                </div>
                <span className="text-gray-500">▼</span>
              </CollapsibleTrigger>

              <CollapsibleContent className="pt-2 pb-4 pl-2">
                {jobApps.map((app) => (
                  <div
                    key={app.candidate_status_id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-2 last:border-b-0"
                  >
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                      <p className="text-sm text-gray-600">
                        Applied on:{" "}
                        {new Date(app.changed_at).toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <Badge
                      className={`text-sm px-3 py-1 rounded-full mt-2 sm:mt-0 ${
                        app.status === "Applied"
                          ? "bg-green-600 text-white"
                          : app.status === "Rejected"
                          ? "bg-red-600 text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
