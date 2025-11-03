import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Atom } from "react-loading-indicators";
import { notify } from "@/components/custom/Notifications";
import { useAuth } from "@/route_protection/AuthContext";
import {
  getCandidateDocuments,
  uploadCandidateDocuments,
} from "@/api/CandidateDocument_api";
import type { CandidateDocumentDto } from "@/interfaces/Candidate_Documents_interface";
import { deleteDocuent, uploadDocument } from "@/api/UploadFiles_api";

const document_url = import.meta.env.VITE_DOCUMENT_URL;

interface CandidateDocument {
  type: string;
  path: string | null;
  status?: string;
  file?: File;
}

const DOCUMENT_TYPES = [
  "Aadhar Card",
  "PAN Card",
  "College Results",
  "HSC/SSC Result",
];

// ✅ Map verification status to UI colors and labels
const statusStyles: Record<string, string> = {
  Verified: "bg-green-600 text-white",
  Pending: "bg-yellow-500 text-black",
  Rejected: "bg-red-600 text-white",
};

export default function UploadCandidateDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Record<string, CandidateDocument>>(
    {}
  );
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // 🔹 Load existing candidate documents
  useEffect(() => {
    const loadDocuments = async () => {
      if (!user || !user.token) {
        notify.error("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const data: CandidateDocumentDto[] = await getCandidateDocuments(
          user.userId,
          user.token
        );

        const docMap: Record<string, CandidateDocument> = {};
        DOCUMENT_TYPES.forEach((type) => {
          const existing = data.find((d) => d.document_type === type);
          docMap[type] = {
            type,
            path: existing ? existing.file_path : null,
            status: existing ? existing.verification_status : "Pending",
          };
        });

        setDocuments(docMap);
      } catch (error: any) {
        notify.error(error.message || "Failed to load documents.");
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [user]);

  // 🔹 Handle file selection
  const handleFileChange = (type: string, file: File) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: { ...prev[type], file },
    }));
  };

  // 🔹 Upload document
  const handleUpload = async (type: string) => {
    const doc = documents[type];
    const file = doc?.file;

    if (!file) {
      notify.error(`Please select a file for ${type}.`);
      return;
    }

    if (!user || !user.token) {
      notify.error("User not authenticated.");
      return;
    }

    setUploading((prev) => ({ ...prev, [type]: true }));
    setProgress((prev) => ({ ...prev, [type]: 0 }));

    try {
      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => ({
          ...prev,
          [type]: Math.min((prev[type] || 0) + 10, 90),
        }));
      }, 200);

      // 🔸 Delete old document if exists
      if (doc.path) {
        const delRes = await deleteDocuent(doc.path, user.token);
        if (!delRes.success)
          throw new Error(`Failed to delete existing ${type}.`);
      }

      // 🔸 Upload file to backend
      const uploadRes = await uploadDocument(file, user.userId, type, user.token);
      const fileUrl = uploadRes.url;

      // 🔸 Update candidate document record in database
      const dbUpdate = await uploadCandidateDocuments(
        {
          candidate_id: user.userId,
          document_type: type,
          file_path: fileUrl,
        },
        user.token
      );

      clearInterval(progressInterval);
      setProgress((prev) => ({ ...prev, [type]: 100 }));

      setDocuments((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          path: dbUpdate.file_path,
          status: dbUpdate.verification_status || "Pending",
        },
      }));

      notify.success(`${type} uploaded successfully!`);
    } catch (error: any) {
      notify.error(error.message || `Failed to upload ${type}.`);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
      setTimeout(
        () => setProgress((prev) => ({ ...prev, [type]: 0 })),
        1500
      );
    }
  };

  // 🔹 Loading state
  if (loading)
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center border-none bg-gray-50">
        <Atom color="#000000" size="medium" text="Loading..." textColor="" />
      </Card>
    );

  // 🔹 UI
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-[#004080] mb-6">
        Upload Your Documents
      </h1>
      <Card className="w-full border border-gray-200 shadow-lg bg-white">
        <CardHeader>
          <CardDescription>
            Upload your verified identification and academic documents below.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {DOCUMENT_TYPES.map((type) => {
            const status = documents[type]?.status || "Pending";
            return (
              <div
                key={type}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4"
              >
                <div className="w-full sm:w-1/2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>{type}</Label>
                    <Badge
                      className={`text-xs px-2 py-1 rounded-full ${
                        statusStyles[status] || "bg-gray-400 text-white"
                      }`}
                    >
                      {status}
                    </Badge>
                  </div>

                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      handleFileChange(type, e.target.files[0])
                    }
                    disabled={uploading[type]}
                  />
                  {uploading[type] && (
                    <div className="mt-2">
                      <Progress value={progress[type] || 0} />
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    onClick={() => handleUpload(type)}
                    disabled={uploading[type] || !(documents[type] as any)?.file}
                    className="bg-gray-600 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {uploading[type] ? "Uploading..." : "Upload"}
                  </Button>

                  {documents[type]?.path && (
                    <a
                      href={document_url + documents[type].path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center bg-gray-600 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>

        <CardFooter className="text-center text-gray-500 text-sm">
          Please ensure all uploaded documents are clear and valid.
        </CardFooter>
      </Card>
    </div>
  );
}