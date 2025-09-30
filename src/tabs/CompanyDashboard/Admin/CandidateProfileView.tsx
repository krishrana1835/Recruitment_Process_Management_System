import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Atom } from "react-loading-indicators";
import { useAuth } from "@/route_protection/AuthContext";
import { DataTable } from "@/components/custom/data-table";

import { IoDocumentsOutline } from "react-icons/io5";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { MdOutlineRateReview } from "react-icons/md";
import { GiSkills } from "react-icons/gi";
import { GoHistory } from "react-icons/go";

import { getCandidateProfile } from "@/api/Candidate_api";
import type { CandidateProfileDto } from "@/interfaces/Candidate_interface";
import {
  candidateInterviewColumns,
  candidateSkillColumns,
  candidateStatusHistoryColumns,
  documentColumns,
  reviewColumns,
} from "@/components/custom/columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CandidateProfileView = ({ allowUpdate }: { allowUpdate: boolean }) => {
  const { id } = useParams<{ id: string }>();
  const [candidateData, setCandidateData] =
    useState<CandidateProfileDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<
    | "Candidate Documents"
    | "Reviews"
    | "Skills"
    | "Interview"
    | "Status History"
  >("Candidate Documents");

  const statusOptions = [
    "Hired",
    "On Hold",
    "Rejected",
    "In Review",
    "Interviewing",
  ];

  const latestStatus =
    candidateData?.candidate_Status_Histories?.[
      candidateData.candidate_Status_Histories.length - 1
    ]?.status || "No Data";

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setError(null);
      setLoading(true);
      try {
        if (!user?.token) {
          setError("No token found for the logged-in user.");
          return;
        }
        const candidateInfo = await getCandidateProfile(id, user.token);
        setCandidateData(candidateInfo);
      } catch (err: any) {
        setError(err.message || "Failed to fetch candidate data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleUpdate = async () => {
    // The user did not provide any instructions on how to update the data.
  };

  if (loading) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center">
        <Atom color="#000000" size="medium" text="Loading..." textColor="" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white text-gray-800 font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10">
          <div className="flex items-center space-x-4">
            <img
              src={`https://placehold.co/64x64/7c3aed/ffffff?text=${candidateData?.full_name.charAt(
                0
              )}`}
              alt="Candidate Avatar"
              className="w-16 h-16 rounded-full border-2 border-black-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {candidateData?.full_name}
              </h1>
              <p className="text-gray-500">{candidateData?.email}</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Candidate Details
          </h2>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Candidate ID
                </label>
                <input
                  type="text"
                  className="border block w-full bg-gray-100 border-gray-300 rounded-md text-gray-900 h-10 px-3"
                  value={candidateData?.candidate_id || ""}
                  disabled={true}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 h-10 px-3"
                  value={candidateData?.full_name || ""}
                  onChange={(e) =>
                    setCandidateData((prev) =>
                      prev ? { ...prev, full_name: e.target.value } : null
                    )
                  }
                  disabled={!allowUpdate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 h-10 px-3"
                  value={candidateData?.phone || ""}
                  onChange={(e) =>
                    setCandidateData((prev) =>
                      prev ? { ...prev, phone: e.target.value } : null
                    )
                  }
                  disabled={!allowUpdate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="text"
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 h-10 px-3"
                  value={candidateData?.email || ""}
                  disabled={!allowUpdate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume
                </label>
                <a
                  href={candidateData?.resume_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "bg-gray-500 text-white hover:bg-black hover:text-white duration-300",
                  })}
                >
                  View Resume
                </a>
                <a
                  href={candidateData?.resume_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "bg-red-400 text-white hover:bg-red-500 hover:text-white duration-300",
                  })}
                >
                  Update Resume
                </a>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status
                </label>
                <Select
                  value={candidateData?.candidate_Status_Histories?.length ? latestStatus : ""}
                  onValueChange={(value) => {
                    console.log("New Status:", value);
                  }}
                  disabled={!allowUpdate} // Set to true if you want it read-only
                >
                  <SelectTrigger className="w-full h-10 bg-white border border-gray-300 rounded-md px-3 text-left">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {allowUpdate && (
              <div className="mt-8 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUpdate}
                  className="bg-gray-500 text-white hover:bg-black hover:text-white duration-300 cursor-pointer"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </div>

        {!allowUpdate ? (
          <>
            <div className="mb-8">
              <nav className="flex space-x-2">
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
                    tab === "Candidate Documents" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setTab("Candidate Documents")}
                >
                  <IoDocumentsOutline className="size-5 mr-2" />
                  Documents
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
                    tab === "Reviews" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setTab("Reviews")}
                >
                  <MdOutlineRateReview className="size-5 mr-2" />
                  Reviews
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
                    tab === "Skills" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setTab("Skills")}
                >
                  <GiSkills className="size-5 mr-2" />
                  Skills
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
                    tab === "Interview" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setTab("Interview")}
                >
                  <RiCalendarScheduleLine className="size-5 mr-2" />
                  Interview
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
                    tab === "Status History" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setTab("Status History")}
                >
                  <GoHistory className="size-5 mr-2" />
                  Status History
                </button>
              </nav>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {tab}
              </h2>
              {tab === "Candidate Documents" && (
                <DataTable
                  columns={documentColumns}
                  data={candidateData?.candidate_Documents || []}
                />
              )}
              {tab === "Reviews" && (
                <DataTable
                  columns={reviewColumns}
                  data={candidateData?.candidate_Reviews || []}
                />
              )}
              {tab === "Skills" && (
                <DataTable
                  columns={candidateSkillColumns}
                  data={candidateData?.candidate_Skills || []}
                />
              )}
              {tab === "Interview" && (
                <DataTable
                  columns={candidateInterviewColumns}
                  data={candidateData?.interviews || []}
                />
              )}
              {tab === "Status History" && (
                <DataTable
                  columns={candidateStatusHistoryColumns}
                  data={candidateData?.candidate_Status_Histories || []}
                />
              )}
            </div>
          </>
        ) : null}
      </div>
    </Card>
  );
};

export default CandidateProfileView;
