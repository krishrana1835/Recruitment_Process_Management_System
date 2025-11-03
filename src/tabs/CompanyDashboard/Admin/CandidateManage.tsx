import {
  getCandidateList,
  getLastCandidateId,
  candidateBulkInsert,
  candidateBulkUpdate,
  candidateBulkDelete,
} from "@/api/Candidate_api";

import { candidateListColumns } from "@/components/custom/columns";
import ListManager from "@/components/custom/ListManager";

import type {
  CandidateListDto,
  CreateBulkCandidate,
  CreateCandidateDto,
  DeleteBulkCandidate,
  UpdateBulkCandidate,
} from "@/interfaces/Candidate_interface";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { excelToJson } from "@/components/custom/exceltojson";
import { useAuth } from "@/route_protection/AuthContext";
import { generateRandomPassword } from "@/components/custom/PasswordGenerator";
import { MdInfoOutline } from "react-icons/md";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Images } from "@/constants/Images";
import { Card } from "@/components/ui/card";
import { Atom } from "react-loading-indicators";
import { notify } from "@/components/custom/Notifications";

function transformBulkToCreate(
  bulkData: CreateBulkCandidate[],
  lastId: string
): CreateCandidateDto[] {
  return bulkData.map((item, index) => {
    const number = parseInt(lastId.slice(4), 10) + 1 + index;
    return {
      ...item,
      candidate_id: `CAND${number.toString().padStart(4, "0")}`,
      password: generateRandomPassword(),
    };
  });
}

export default function CandidateManage() {
  const navigate = useNavigate();
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showpopup, setShowPopup] = useState<boolean>(false);
  const [uninsertedEmails, setUninsertedEmails] = useState<string[]>([]);
  const [popupMessage, setPopupMessage] = useState<string>("inserted");

  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFile(file);
    }
  };

  const handleExcelUploadAdd = async () => {
    setError("");
    setLoading(true);
    setShowPopup(false);

    if (!excelFile) {
      notify.warning("No file selected", "Please select an Excel file.");
      setLoading(false);
      return;
    }

    if (!user || !user.token) {
      setError("User is not authorized");
      setLoading(false);
      return;
    }

    try {
      const formData: CreateBulkCandidate[] = await excelToJson(excelFile);

      formData.forEach((item) => {
        item.phone = String(item.phone);
      });

      const lastId = await getLastCandidateId(user.token);

      if (!lastId || !lastId.startsWith("CAND")) {
        throw new Error("Invalid candidate ID format");
      }

      const insertData: CreateCandidateDto[] = transformBulkToCreate(
        formData,
        lastId
      );

      const response = await candidateBulkInsert(insertData, user.token);

      if (
        Array.isArray(response) &&
        response.every((item) => typeof item === "string")
      ) {
        setShowPopup(true);
        setUninsertedEmails(response);
        setPopupMessage("inserted");
      } else {
        notify.success("Success", "Candidates are added");
      }

      setExcelFile(null);
    } catch (err: any) {
      console.error(err);
      notify.error("Error", err.message || "Something went wrong.");
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleExcelUploadUpdate = async () => {
    setError("");
    setLoading(true);
    setShowPopup(false);

    if (!excelFile) {
      notify.warning("No file selected", "Please select an Excel file.");
      setLoading(false);
      return;
    }

    if (!user || !user.token) {
      setError("User is not authorized");
      setLoading(false);
      return;
    }

    try {
      const formData: UpdateBulkCandidate[] = await excelToJson(excelFile);

      formData.forEach((item) => {
        item.phone = String(item.phone);
      });

      const response = await candidateBulkUpdate(formData, user.token);

      if (
        Array.isArray(response) &&
        response.every((item) => typeof item === "string")
      ) {
        setShowPopup(true);
        setUninsertedEmails(response);
        setPopupMessage("updated");
      } else {
        notify.success("Success", "Candidates are updated");
      }

      setExcelFile(null);
    } catch (err: any) {
      console.error(err);
      notify.error("Error", err.message || "Something went wrong.");
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleExcelUploadDelete = async () => {
    setError("");
    setLoading(true);
    setShowPopup(false);
    if (!excelFile) {
      notify.warning("No file selected", "Please select an Excel file.");
      setLoading(false);
      return;
    }
    if (!user || !user.token) {
      setError("User is not authorized");
      setLoading(false);
      return;
    }
    try {
      const formData: DeleteBulkCandidate[] = await excelToJson(excelFile);
      const response = await candidateBulkDelete(formData, user.token);

      if (
        Array.isArray(response) &&
        response.every((item) => typeof item === "string")
      ) {
        setShowPopup(true);
        setUninsertedEmails(response);
        setPopupMessage("deleted");
      } else {
        notify.success("Success", "Candidates are updated");
      }
      setExcelFile(null);
    } catch (err: any) {
      console.error(err);
      notify.error("Error", err.message || "Something went wrong.");
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full text-red-500">
        Error: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center">
        <Atom color="#000000" size="medium" text="Loading..." textColor="" />
      </Card>
    );
  }

  return (
    <div className="h-full w-full">
      <Menubar className="gap-8 mb-6 flex justify-center items-center">
        {/* Add Candidate */}
        <MenubarMenu>
          <MenubarTrigger>Add Candidate</MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              onClick={() => navigate("/company/dashboard/candidates/add")}
            >
              Use dashboard
            </MenubarItem>
            <MenubarItem
              onClick={() =>
                navigate("/company/dashboard/candidates/add/resume")
              }
            >
              Import Resume
            </MenubarItem>
            <Popover>
              <PopoverTrigger asChild>
                <MenubarItem onSelect={(e) => e.preventDefault()}>
                  Import Excel
                </MenubarItem>
              </PopoverTrigger>
              <PopoverContent
                className="flex flex-col gap-3 p-4 mt-4 w-72"
                onFocusOutside={(e) => e.preventDefault()}
              >
                <Input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />
                <button
                  className="bg-primary text-white px-4 py-2 rounded text-sm"
                  onClick={() => handleExcelUploadAdd()}
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </PopoverContent>
            </Popover>
          </MenubarContent>
        </MenubarMenu>

        {/* Update Candidate */}
        <MenubarMenu>
          <MenubarTrigger>Update Candidate</MenubarTrigger>
          <MenubarContent>
            <Popover>
              <PopoverTrigger asChild>
                <MenubarItem onSelect={(e) => e.preventDefault()}>
                  Import Excel
                </MenubarItem>
              </PopoverTrigger>
              <PopoverContent
                className="flex flex-col gap-3 p-4 mt-4 w-72"
                onFocusOutside={(e) => e.preventDefault()}
              >
                <Input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />
                <button
                  className="bg-primary text-white px-4 py-2 rounded text-sm"
                  onClick={() => handleExcelUploadUpdate()}
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </PopoverContent>
            </Popover>
          </MenubarContent>
        </MenubarMenu>

        {/* Delete Candidate */}
        <MenubarMenu>
          <MenubarTrigger>Delete Candidate</MenubarTrigger>
          <MenubarContent>
            <Popover>
              <PopoverTrigger asChild>
                <MenubarItem onSelect={(e) => e.preventDefault()}>
                  Import Excel
                </MenubarItem>
              </PopoverTrigger>
              <PopoverContent
                className="flex flex-col gap-3 p-4 mt-4 w-72"
                onFocusOutside={(e) => e.preventDefault()}
              >
                <Input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />
                <button
                  className="bg-destructive text-white px-4 py-2 rounded text-sm"
                  onClick={() => handleExcelUploadDelete()}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Upload"}
                </button>
              </PopoverContent>
            </Popover>
          </MenubarContent>
        </MenubarMenu>

        {/* Tooltip with all three formats */}
        <Tooltip>
          <TooltipTrigger className="cursor-pointer">
            <MdInfoOutline className="text-2xl" />
          </TooltipTrigger>
          <TooltipContent className="bg-white text-black border-2 shadow-lg p-4 space-y-6 max-w-3xl m-4 mt-0">
            <div>
              <h4 className="font-semibold mb-2">Add Candidate Excel Format</h4>
              <img
                src={Images.candidateExcelFormatAdd}
                alt="Add Candidate Excel Format"
              />
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                Update Candidate Excel Format
              </h4>
              <img
                src={Images.candidateExcelFormatUpdate}
                alt="Update Candidate Excel Format"
              />
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                Delete Candidate Excel Format
              </h4>
              <img
                src={Images.candidateExcelFormatDelete}
                alt="Delete Candidate Excel Format"
              />
            </div>
          </TooltipContent>
        </Tooltip>
      </Menubar>

      {showpopup && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -20%)",
            backgroundColor: "white",
            padding: "20px",
            border: "1px solid gray",
            borderRadius: "8px",
            zIndex: 1000,
            width: "400px",
          }}
        >
          <h3>⚠️ Some Candidates Were Not {popupMessage}</h3>
          <p>The following emails were not {popupMessage}:</p>
          <ul>
            {uninsertedEmails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
          <button
            onClick={() => {
              navigator.clipboard.writeText(uninsertedEmails.join(", "));
              notify.success("Copied", "Emails copied to clipboard.");
            }}
            style={{ marginTop: "10px", marginRight: "10px" }}
          >
            📋 Copy Emails
          </button>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}

      {!showpopup && (
        <ListManager<CandidateListDto>
          fetchFunction={getCandidateList}
          addLink="/company/dashboard/candidates/add"
          columns={candidateListColumns}
          addButton={false}
        />
      )}
    </div>
  );
}
