import { AddEmployee, GetEmployeeCandidates } from "@/api/Employee_Records_api";
import { uploadDocument } from "@/api/UploadFiles_api";
import ListManager from "@/components/custom/ListManager";
import { notify } from "@/components/custom/Notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SelectedCandidatesDto } from "@/interfaces/Candidate_interface";
import { useAuth } from "@/route_protection/AuthContext";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { useParams } from "react-router-dom";
import { sendMail } from "@/api/Email_api";

function buildOfferLetterEmail(
  candidateName: string,
  joiningDate: string
) {
  return {
    subject: "Offer Letter Uploaded – Next Steps",
    body: `
<p>Dear <strong>${candidateName}</strong>,</p>

<p>
We are pleased to inform you that your offer letter has been uploaded to our web application.
</p>

<p>
<strong>Joining Date:</strong> ${joiningDate}
</p>

<p>
Please log in to the portal to view and download your offer letter and complete the next steps.
</p>

<p>
If you have any questions, feel free to reach out.
</p>

<p>
Best regards,<br />
<strong>HR Team</strong>
</p>
    `.trim(),
  };
}

export interface EmployeeRecordInsert {
  joiningDate: string;
  offerLetterPath: string;
  candidateId: string;
  jobId: number;
  userId: string;
}

const formatDateOnly = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function EmployeeCandidates() {
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();

  const [joiningDateMap, setJoiningDateMap] = useState<
    Record<string, Date | null>
  >({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [fileMap, setFileMap] = useState<Record<string, File | null>>({});
  const [refereshKey, setRefreshKey] = useState(0);

  const handleFileChange = (candidateId: string, file: File | null) => {
    setFileMap((prev) => ({
      ...prev,
      [candidateId]: file,
    }));
  };

  const handleJoiningDateChange = (candidateId: string, date: Date | null) => {
    setJoiningDateMap((prev) => ({
      ...prev,
      [candidateId]: date,
    }));
  };

  const handleAddAsEmployee = async (candidate: SelectedCandidatesDto) => {
    try {
      const joiningDate = joiningDateMap[candidate.candidate_id];
      const file = fileMap[candidate.candidate_id];

      if (!joiningDate) {
        notify.error("Missing Joining Date", "Please select joining date");
        return;
      }

      if (!file) {
        notify.error("Missing File", "Please upload offer letter");
        return;
      }

      if (!user?.token) {
        notify.error("Unauthorized", "User token missing");
        return;
      }

      setLoadingMap((prev) => ({
        ...prev,
        [candidate.candidate_id]: true,
      }));

      // 1️⃣ Upload document
      const uploadResponse = await uploadDocument(
        file,
        candidate.candidate_id,
        "offer-letter",
        user.token
      );

      // 2️⃣ Build payload (IST Date)
      const payload: EmployeeRecordInsert = {
        joiningDate: formatDateOnly(joiningDate),
        offerLetterPath: uploadResponse.url,
        candidateId: candidate.candidate_id,
        jobId: Number(jobId),
        userId: user.userId,
      };
      await AddEmployee(payload, user?.token);
      setRefreshKey((prev) => prev + 1);

      notify.success("Employee Ready", "Payload created successfully");

      const { subject, body } = buildOfferLetterEmail(
        candidate.full_name,
        payload.joiningDate
      );

      await sendMail(candidate.email, subject, body, user.token);
    } catch (error: any) {
      notify.error("Upload Failed", error.message || "Something went wrong");
    } finally {
      setLoadingMap((prev) => ({
        ...prev,
        [candidate.candidate_id]: false,
      }));
    }
  };

  const jobListDocVerification: ColumnDef<SelectedCandidatesDto>[] = [
    {
      accessorKey: "candidate_id",
      header: "Candidate ID",
    },
    {
      accessorKey: "full_name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      header: "Joining Date",
      cell: ({ row }) => {
        const candidate = row.original;

        return (
          <DatePicker
            selected={joiningDateMap[candidate.candidate_id] || null}
            onChange={(date) =>
              handleJoiningDateChange(candidate.candidate_id, date)
            }
            withPortal
            portalId="datepicker-portal"
            dateFormat="dd/MM/yyyy"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
        );
      },
    },
    {
      header: "Upload File",
      cell: ({ row }) => {
        const candidate = row.original;

        return (
          <div className="flex flex-col gap-1">
            <input
              type="file"
              className="text-sm border p-2 rounded-md shadow-sm"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                handleFileChange(
                  candidate.candidate_id,
                  e.target.files?.[0] || null
                )
              }
              required
            />
            {fileMap[candidate.candidate_id] && (
              <span className="text-xs text-gray-600 truncate max-w-[200px]">
                {fileMap[candidate.candidate_id]?.name}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => {
        const candidate = row.original;

        return (
          <Button
            size="sm"
            disabled={loadingMap[candidate.candidate_id]}
            onClick={() => handleAddAsEmployee(candidate)}
          >
            {loadingMap[candidate.candidate_id]
              ? "Uploading..."
              : "Add as Employee"}
          </Button>
        );
      },
    },
  ];

  return (
    <Card className="w-full h-full">
      <CardContent className="w-full">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Selected Candidates
        </h1>

        <ListManager<SelectedCandidatesDto>
          fetchFunction={GetEmployeeCandidates}
          fetchArgs={[Number(jobId), refereshKey]}
          addLink=""
          columns={jobListDocVerification}
          addButton={false}
        />
      </CardContent>
    </Card>
  );
}
