import { useEffect, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { useAuth } from "@/route_protection/AuthContext";
import { notify } from "@/components/custom/Notifications";
import { useParams } from "react-router-dom";
import { getCandidateSummary } from "@/api/Reports_api";
import { Atom } from "react-loading-indicators";

export interface CandidateSummaryResponse {
  candidateId: string;
  fullName: string;
  email: string;
  phone: string;
  resumePath: string;
  documents: DocumentDto[];
  jobStatusHistories: JobStatusDto[];
  jobInterviews: JobInterviewDto[];
  employeeRecord?: EmployeeRecordDto;
}

interface DocumentDto {
  documentId: number;
  documentType: string;
  filePath: string;
  verificationStatus: string;
  uploadedAt: string;
}

interface JobStatusDto {
  jobId: number;
  jobTitle: string;
  history: {
    status: string;
    reason: string;
    changedAt: string;
    changedBy: string;
  }[];
}

interface JobInterviewDto {
  jobId: number;
  jobTitle: string;
  rounds: InterviewRoundDto[];
}

interface InterviewRoundDto {
  roundNumber: number;
  roundTitle: string;
  skillFeedbacks: SkillFeedbackDto[];
  hrReviews: HrReviewDto[];
}

interface SkillFeedbackDto {
  skillName: string;
  technicalRating: number;
  conceptRating: number;
  comments: string;
}

interface HrReviewDto {
  interviewId: number;
  communicationRating: number;
  teamworkRating: number;
  adaptabilityRating: number;
  leadershipRating: number;
  overallRating: number;
  strengths: string;
  areasForImprovement: string;
  trainingRecommendations: string;
  careerPathNotes: string;
  reviewByUserId: string;
}

interface EmployeeRecordDto {
  employeeId: number;
  joiningDate: string;
  jobTitle: string;
  offerLetterPath: string;
}

export default function CandidateSummary() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { user } = useAuth();
  const doc_url = import.meta.env.VITE_DOCUMENT_URL;

  const [data, setData] = useState<CandidateSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.token) {
      notify.error("Session Expired", "Please login again.");
      return;
    }

    if (!candidateId) {
      notify.error("Error", "Invalid candidate ID.");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getCandidateSummary(candidateId, user.token);
        setData(res);
      } catch (err: any) {
        notify.error("Error", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [candidateId, user?.token]);

  if (loading) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center border-none bg-gray-50">
        <Atom color="#000000" size="medium" text="Loading..." textColor="" />
      </Card>
    );
  }
  if (!data) return null;

  return (
    <div className="space-y-6 p-6">
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-lg font-semibold tracking-tight">
              {data.fullName}
            </span>
            <Badge variant="secondary" className="w-fit text-xs">
              ID: {data.candidateId}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium text-foreground">Email:</span>
            <span className="truncate">{data.email}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium text-foreground">Phone:</span>
            <span>{data.phone}</span>
          </div>

          <div className="sm:col-span-2 pt-2">
            <a
              href={doc_url + data.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              View Resume →
            </a>
          </div>
        </CardContent>
      </Card>

      <Section title="Documents Verification">
        <div className="space-y-2">
          {data.documents.map((d) => (
            <div
              key={d.documentId}
              className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-muted/50"
            >
              <a
                href={doc_url + d.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                {d.documentType}
              </a>

              <Badge
                variant={
                  d.verificationStatus === "Verified"
                    ? "default"
                    : d.verificationStatus === "Rejected"
                    ? "destructive"
                    : "outline"
                }
                className="text-xs"
              >
                {d.verificationStatus}
              </Badge>
            </div>
          ))}

          {data.documents.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No documents uploaded yet.
            </p>
          )}
        </div>
      </Section>

      <Tabs defaultValue="status">
        <TabsList>
          <TabsTrigger value="status">Job Status</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          {data.employeeRecord && (
            <TabsTrigger value="employee">Employee</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="status">
          {data.jobStatusHistories.map((job) => (
            <div className="mb-4" key={job.jobId}>
              <Section title={job.jobTitle}>
                {job.history.map((h, i) => (
                  <div key={i} className="text-sm py-2">
                    <div className="flex justify-between">
                      <Badge className="mb-2">{h.status}</Badge>
                      <span className="text-muted-foreground">
                        {new Date(h.changedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{h.reason}</p>
                    <hr className="my-2" />
                  </div>
                ))}
              </Section>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="interviews">
          {data.jobInterviews.map((job) => (
            <div className="mb-4" key={job.jobId}>
              <Section title={job.jobTitle}>
                {job.rounds.map((round) => (
                  <Card key={round.roundNumber} className="mb-4">
                    <CardHeader>
                      <CardTitle>Round {round.roundNumber}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-semibold mb-2">{round.roundTitle}</h4>
                      {round.skillFeedbacks.map((s, i) => (
                        <div key={i} className="text-sm flex justify-between">
                          <span>{s.skillName}</span>
                          <span>
                            Tech: {s.technicalRating} | Concept:{" "}
                            {s.conceptRating}
                          </span>
                        </div>
                      ))}

                      {round.hrReviews.length > 0 && (
                        <>
                          <div className="space-y-2">
                            {round.hrReviews.map((hr, i) => (
                              <div key={i} className="text-sm space-y-1">
                                <div>
                                  Communication Rating: {hr.communicationRating}
                                </div>
                                <div>Teamwork Rating: {hr.teamworkRating}</div>
                                <div>
                                  Adaptability Rating: {hr.adaptabilityRating}
                                </div>
                                <div>
                                  Leadership Rating: {hr.leadershipRating}
                                </div>
                                <hr />
                                <div>Overall Rating: {hr.overallRating}</div>
                                <hr />
                                <div>Strengths: {hr.strengths}</div>
                                <div>
                                  Areas for Improvement:{" "}
                                  {hr.areasForImprovement}
                                </div>
                                <div>
                                  Training Recommendations:{" "}
                                  {hr.trainingRecommendations}
                                </div>
                                <div>
                                  Career Path Notes: {hr.careerPathNotes}
                                </div>
                                <div>Reviewed By: {hr.reviewByUserId}</div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Section>
            </div>
          ))}
        </TabsContent>

        {data.employeeRecord && (
          <TabsContent value="employee">
            <Section title="Employee Record">
              <div className="space-y-3 text-sm">
                <div className="">
                  <span className="text-muted-foreground">Employee ID: </span>
                  <span className="font-medium">
                    {data.employeeRecord.employeeId}
                  </span>
                </div>

                <div className="">
                  <span className="text-muted-foreground">Job Title: </span>
                  <span className="font-medium">
                    {data.employeeRecord.jobTitle}
                  </span>
                </div>

                <div className="">
                  <span className="text-muted-foreground">Joining Date: </span>
                  <span className="font-medium">
                    {new Date(data.employeeRecord.joiningDate).toDateString()}
                  </span>
                </div>

                <div className="pt-2">
                  <a
                    href={data.employeeRecord.offerLetterPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    View Offer Letter
                  </a>
                </div>
              </div>
            </Section>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
