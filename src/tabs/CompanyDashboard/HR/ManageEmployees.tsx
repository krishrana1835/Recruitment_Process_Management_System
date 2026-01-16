import { sendMail } from "@/api/Email_api";
import {
  DeleteEmployee,
  GetEmployees,
  UpdateEmployee,
} from "@/api/Employee_Records_api";
import { deleteDocuent, uploadDocument } from "@/api/UploadFiles_api";
import ListManager from "@/components/custom/ListManager";
import { notify } from "@/components/custom/Notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/route_protection/AuthContext";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { Link, useParams } from "react-router-dom";

export interface EmployeeList {
  employeeId: number;
  joiningDate: string;
  offerLetterPath: string;
  candidate: {
    candidate_id: string;
    full_name: string;
    email: string;
  };
}

export interface UpdateEmployeeDto {
  employeeId: number;
  joiningDate: string;
  offerLetterPath: string;
}

function buildOfferLetterEmail(candidateName: string, joiningDate: string) {
  return {
    subject: "Offer Letter Updated – Next Steps",
    body: `
<p>Dear <strong>${candidateName}</strong>,</p>

<p>
We are pleased to inform you that your <strong>offer letter has been updated</strong>
and is now available on our web application.
</p>

<p>
<strong>Joining Date:</strong> ${joiningDate}
</p>

<p>
Please log in to the portal to view and download your offer letter and complete
the next steps.
</p>

<p>
If you have any questions, feel free to reach out to us.
</p>

<p>
Best regards,<br />
<strong>HR Team</strong>
</p>
    `.trim(),
  };
}

const formatDateOnly = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseISODate = (dateStr?: string) => {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d));
};

export default function ManageEmployees() {
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();
  const doc_url = import.meta.env.VITE_DOCUMENT_URL;

  const [joiningDateMap, setJoiningDateMap] = useState<
    Record<string, Date | null>
  >({});
  const [fileMap, setFileMap] = useState<Record<string, File | null>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  const handleJoiningDateChange = (candidateId: string, date: Date | null) => {
    setJoiningDateMap((prev) => ({
      ...prev,
      [candidateId]: date,
    }));
  };

  const handleUpdateEmployee = async (row: EmployeeList) => {
    if (!user?.token) {
      notify.error("Session Error", "Please login again");
      return;
    }

    const candidateId = row.candidate.candidate_id;

    const joiningDate =
      joiningDateMap[candidateId] ?? parseISODate(row.joiningDate);

    if (!joiningDate) {
      notify.error("Missing Date", "Please select joining date");
      return;
    }

    try {
      setLoadingMap((prev) => ({ ...prev, [candidateId]: true }));

      let offerLetterPath = row.offerLetterPath;
      const file = fileMap[candidateId];

      if (file) {
        if (offerLetterPath) {
          const delRes = await deleteDocuent(offerLetterPath, user.token);
          if (!delRes.success)
            throw new Error("Failed to delete existing file");
        }

        const uploadRes = await uploadDocument(
          file,
          candidateId,
          "offer-letter",
          user.token
        );

        offerLetterPath = uploadRes.url;
      }

      const payload: UpdateEmployeeDto = {
        employeeId: row.employeeId,
        joiningDate: formatDateOnly(joiningDate),
        offerLetterPath,
      };
      await UpdateEmployee(payload, user.token);

      notify.success("Updated", "Employee updated successfully");
      setRefreshKey((prev) => prev + 1);

      const { subject, body } = buildOfferLetterEmail(
        row.candidate.full_name,
        payload.joiningDate
      );

      await sendMail(row.candidate.email, subject, body, user.token);
    } catch (error: any) {
      notify.error("Update Failed", error.message || "Something went wrong");
    } finally {
      setLoadingMap((prev) => ({ ...prev, [candidateId]: false }));
    }
  };

  const handleRemoveEmployee = async (row: EmployeeList) => {
    const candidateId = row.candidate.candidate_id;
    if (!user?.token) {
      notify.error("Session Error", "Please login again");
      return;
    }
    try {
      setLoadingMap((prev) => ({ ...prev, [candidateId]: true }));
      if (row.offerLetterPath) {
        const delRes = await deleteDocuent(row.offerLetterPath, user.token);
        if (!delRes.success) throw new Error("Failed to delete existing file");
      }
      await DeleteEmployee(row.employeeId, user?.token);
      notify.success("Removed", "Employee removed successfully");
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      notify.error("Remove Failed", error.message || "Something went wrong");
    } finally {
      setLoadingMap((prev) => ({ ...prev, [candidateId]: false }));
    }
  };

  const handleFileChange = (candidateId: string, file: File | null) => {
    setFileMap((prev) => ({
      ...prev,
      [candidateId]: file,
    }));
  };

  const columns: ColumnDef<EmployeeList>[] = [
    { accessorKey: "employeeId", header: "Employee ID" },
    { accessorKey: "candidate.full_name", header: "Name" },
    { accessorKey: "candidate.email", header: "Email" },
    {
      header: "Joining Date",
      cell: ({ row }) => {
        const data = row.original;
        const candidateId = data.candidate.candidate_id;

        return (
          <DatePicker
            selected={
              joiningDateMap[candidateId] ?? parseISODate(data.joiningDate)
            }
            onChange={(date) => handleJoiningDateChange(candidateId, date)}
            dateFormat="dd/MM/yyyy"
            withPortal
            portalId="datepicker-portal"
            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
          />
        );
      },
    },
    {
      header: "Offer Lattera",
      cell: ({ row }) => {
        const candidate = row.original;

        return (
          <div className="flex gap-2">
            <div className="flex flex-col gap-1">
              <input
                type="file"
                className="text-sm border p-2 rounded-md shadow-sm"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  handleFileChange(
                    candidate.candidate.candidate_id,
                    e.target.files?.[0] || null
                  )
                }
                required
              />
              {fileMap[candidate.candidate.candidate_id] && (
                <span className="text-xs text-gray-600 truncate max-w-[200px]">
                  {fileMap[candidate.candidate.candidate_id]?.name}
                </span>
              )}
            </div>
            {candidate.offerLetterPath && (
              <Link to={doc_url + candidate.offerLetterPath} target="_blank">
                <Button variant="ghost">View</Button>
              </Link>
            )}
          </div>
        );
      },
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const data = row.original;
        const candidateId = data.candidate.candidate_id;

        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={loadingMap[candidateId]}
              onClick={() => handleUpdateEmployee(data)}
            >
              {loadingMap[candidateId] ? "Saving..." : "Update"}
            </Button>

            <Button
              size="sm"
              variant="destructive"
              disabled={loadingMap[candidateId]}
              onClick={() => handleRemoveEmployee(data)}
            >
              Remove
            </Button>
          </div>
        );
      },
    },
  ];

  const ViewerColumns: ColumnDef<EmployeeList>[] = [
    { accessorKey: "employeeId", header: "Employee ID" },
    { accessorKey: "candidate.full_name", header: "Name" },
    { accessorKey: "candidate.email", header: "Email" },
    {
      header: "Joining Date",
      cell: ({ row }) => {
        const data = row.original;
        const candidateId = data.candidate.candidate_id;

        return (
          <DatePicker
            selected={
              joiningDateMap[candidateId] ?? parseISODate(data.joiningDate)
            }
            onChange={(date) => handleJoiningDateChange(candidateId, date)}
            dateFormat="dd/MM/yyyy"
            withPortal
            disabled
            portalId="datepicker-portal"
            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
          />
        );
      },
    },
    {
      header: "Offer Latter",
      cell: ({ row }) => {
        const candidate = row.original;

        return (
          <div className="flex gap-2">
            <div className="flex flex-col gap-1">
              {fileMap[candidate.candidate.candidate_id] && (
                <span className="text-xs text-gray-600 truncate max-w-[200px]">
                  {fileMap[candidate.candidate.candidate_id]?.name}
                </span>
              )}
            </div>
            {candidate.offerLetterPath && (
              <Link to={doc_url + candidate.offerLetterPath} target="_blank">
                <Button variant="ghost">View</Button>
              </Link>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Card className="w-full h-full">
      <CardContent>
        <h1 className="text-2xl font-semibold mb-4">Employees</h1>

        <ListManager<EmployeeList>
          fetchFunction={GetEmployees}
          fetchArgs={[Number(jobId), refreshKey]}
          columns={
            user?.role === "HR" || user?.role === "Admin"
              ? columns
              : ViewerColumns
          }
          addButton={false}
          addLink=""
        />
      </CardContent>
    </Card>
  );
}
