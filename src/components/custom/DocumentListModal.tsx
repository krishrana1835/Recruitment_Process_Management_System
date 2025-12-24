import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { notify } from "@/components/custom/Notifications";
import { useAuth } from "@/route_protection/AuthContext";
import { getCandidateDocuments } from "@/api/CandidateDocument_api";
import type { CandidateDocumentDto } from "@/interfaces/Candidate_Documents_interface";
import { UpdateVerificationStatus } from "@/api/DocVerification_api";

interface Props {
  open: boolean;
  onClose: (open: boolean) => void;
  candidateId: string;
}

const statusDotColor = (
  status: CandidateDocumentDto["verification_status"]
) => {
  switch (status) {
    case "Verified":
      return "bg-green-500";
    case "Rejected":
      return "bg-red-500";
    case "Pending":
    default:
      return "bg-yellow-500";
  }
};

export default function CandidateDocumentsDialog({
  open,
  onClose,
  candidateId,
}: Props) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<CandidateDocumentDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const doc_url = import.meta.env.VITE_DOCUMENT_URL;

  const fetchDocuments = async () => {
    if (!user?.token || !candidateId) return;

    try {
      setLoading(true);
      const res = await getCandidateDocuments(candidateId, user.token);
      setDocuments(res ?? []);
    } catch (err: any) {
      notify.error("Error", err?.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDocuments();
    }
  }, [open, candidateId]);

  const handleStatusChange = async (
    document_id: number,
    status: CandidateDocumentDto["verification_status"]
  ) => {
    if (!user?.token) return;

    try {
      await UpdateVerificationStatus(
        { document_id, verification_status: status },
        user.token
      );

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.document_id === document_id
            ? { ...doc, verification_status: status }
            : doc
        )
      );

      notify.success("Updated", "Status updated successfully");
    } catch (err: any) {
      notify.error("Error", err?.message || "Failed to update status");
    }
  };

  // const handleDelete = async (document_id: number) => {
  //   if (!user?.token) return;

  //   try {
  //     // await DeleteDocument(document_id, user.token);

  //     setDocuments((prev) =>
  //       prev.filter((doc) => doc.document_id !== document_id)
  //     );

  //     notify.success("Deleted", "Document removed");
  //   } catch (err: any) {
  //     notify.error("Error", err?.message || "Failed to delete document");
  //   }
  // };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Uploaded Documents</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No documents uploaded.
          </p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div key={index}>
                <div
                  key={doc.document_id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  {/* Left */}
                  <div className="flex items-start gap-2">
                    {/* Status dot */}
                    <span
                      className={`mt-1 h-3 w-3 rounded-full ${statusDotColor(
                        doc.verification_status
                      )}`}
                    />

                    <div>
                      <p className="font-medium">{doc.document_type}</p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded on{" "}
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>

                      <a
                        href={doc_url + doc.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 underline"
                      >
                        View Document
                      </a>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-2">
                    <Select
                      value={doc.verification_status}
                      onValueChange={(value) =>
                        handleStatusChange(
                          doc.document_id,
                          value as CandidateDocumentDto["verification_status"]
                        )
                      }
                      disabled={user?.role === "Viewer"}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Verified">Verified</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
