import { useEffect, useState } from "react";
import {
  getAllInterviewTypes,
  addInterviewType,
  updateInterviewType,
  deleteInterviewType,
} from "@/api/InterviewType_api"; // ← your API file

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/route_protection/AuthContext";
import { notify } from "@/components/custom/Notifications";

export default function InterviewTypeManager() {
  const { user } = useAuth();
  const [interviewTypes, setInterviewTypes] = useState([]);

  const [newRoundName, setNewRoundName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const loadData = async () => {
    try {
      if (!user?.token) throw new Error("Token is expired");
      const data = await getAllInterviewTypes(user?.token);
      setInterviewTypes(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async () => {
    if (!newRoundName.trim()) return alert("Round name required");

    try {
      if (!user?.token) throw new Error("Token is expired");
      await addInterviewType(
        {
          interview_round_name: newRoundName,
          process_descreption: newDescription,
        },
        user.token
      );

      setNewRoundName("");
      setNewDescription("");

      loadData();
      notify.success("Interview Added Successfully")
    } catch (error: any) {
      notify.error(error.message);
    }
  };

  const handleUpdate = async (item: any) => {
    try {
      if (!user?.token) throw new Error("Token is expired");
      await updateInterviewType(item, user.token);
      loadData();
      notify.success("Interview Updated Successfully")
    } catch (error: any) {
      notify.error(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
      if (!user?.token) throw new Error("Token is expired");
      await deleteInterviewType({ interview_type_id: id }, user.token);
      loadData();
      notify.success("Interview Deleted Successfully")
    } catch (error: any) {
      notify.error(error.message);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white border rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold text-black mb-4">
        Interview Types Manager
      </h1>

      {/* ADD SECTION */}
      <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
        <Input
          placeholder="Interview Round Name"
          value={newRoundName}
          onChange={(e) => setNewRoundName(e.target.value)}
          className="bg-white text-black border-black"
        />

        <Textarea
          placeholder="Process Description"
          value={newDescription}
          onChange={(e: any) => setNewDescription(e.target.value)}
          className="bg-white text-black border-black h-24"
        />

        <Button
          onClick={handleAdd}
          className="bg-black text-white hover:bg-gray-800 w-full"
        >
          Add Interview Type
        </Button>
      </div>

      {/* LIST SECTION */}
      <h2 className="text-xl font-semibold text-black mt-8 mb-4">
        All Interview Types
      </h2>

      <div className="space-y-5">
        {interviewTypes.map((item: any) => (
          <div
            key={item.interview_type_id}
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            <div className="space-y-3">
              {/* Editable round name */}
              <Input
                value={item.interview_round_name}
                onChange={(e) => {
                  item.interview_round_name = e.target.value;
                  setInterviewTypes([...interviewTypes]);
                }}
                className="bg-white text-black border-black"
              />

              {/* Editable description */}
              <Textarea
                value={item.process_descreption || ""}
                onChange={(e: any) => {
                  item.process_descreption = e.target.value;
                  setInterviewTypes([...interviewTypes]);
                }}
                className="bg-white text-black border-black h-20"
              />

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => handleUpdate(item)}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Update
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => handleDelete(item.interview_type_id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}

        {interviewTypes.length === 0 && (
          <p className="text-center text-gray-600">No interview types found.</p>
        )}
      </div>
    </div>
  );
}
