import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "react-router-dom";
import { useAuth } from "@/route_protection/AuthContext";
import { notify } from "@/components/custom/Notifications";
import { getAllInterviewTypes } from "@/api/InterviewType_api";
import { getAllInterviewers } from "@/api/Users_api";
import type { SheduleInterviewDto } from "@/interfaces/Interview_interface";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { fetchRounds, scheduleInterview } from "@/api/Interview_api";

interface Interviewer {
  user_id: string;
  name: string;
  roles: {
    role_name: string;
  }[];
}

interface Panel {
  members: string[];
  mode: "Online" | "Offline";
  link?: string;
}

interface InterviewRounds {
  round_number: number;
  interview_round_name: string;
  process_descreption: string;
  name: string;
}

export default function ScheduleInterviewForm() {
  const { user } = useAuth();
  const params = useParams();
  const job_id = params.job_id;

  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [duration, setDuration] = useState<number>(30);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [panels, setPanels] = useState<Panel[]>([
    { members: [], mode: "Offline", link: "" },
  ]);
  const [location, setLocation] = useState<string>("");
  const [interviewTypes, setInterviewTypes] = useState<
    { interview_type_id: number; interview_round_name: string }[]
  >([]);
  const [selectedInterviewType, setSelectedInterviewType] = useState<number>(1);
  const [interviewRounds, setInterviewRounds] = useState<InterviewRounds[]>([
    {
      round_number: 0,
      interview_round_name: "Short Listed",
      process_descreption: "",
      name: "",
    },
  ]);
  const [round, setSelectedRound] = useState<number>(0);

  // Fetch interviewers
  useEffect(() => {
    const fetchInterviewers = async () => {
      if (!user?.token) {
        notify.error("Token is expired");
        return;
      }
      try {
        const res = await getAllInterviewers(user.token);
        setInterviewers(res);
      } catch (err: any) {
        notify.error(err.message);
      }
    };

    const fetchInterviewTypes = async () => {
      if (!user?.token) {
        notify.error("Token is expired");
        return;
      }
      try {
        const res = await getAllInterviewTypes(user.token);
        setInterviewTypes(res);
      } catch (err: any) {
        notify.error(err.message);
      }
    };

    const fetchInterviewRounds = async () => {
      if (!user?.token) {
        notify.error("Token is expired");
        return;
      }
      if (!job_id) {
        notify.error("Job id is required");
        return;
      }
      try {
        const res = await fetchRounds(parseInt(job_id), user.token);
        setInterviewRounds([...interviewRounds,...(res.roundData || [])]);
      } catch (err: any) {
        notify.error(err.message);
      }
    };

    fetchInterviewers();
    fetchInterviewTypes();
    fetchInterviewRounds();
  }, [user]);

  const addPanel = () =>
    setPanels([...panels, { members: [], mode: "Offline", link: "" }]);
  const removePanel = (index: number) =>
    setPanels(panels.filter((_, i) => i !== index));
  const handlePanelChange = (index: number, key: string, value: any) => {
    const newPanels = [...panels];
    (newPanels[index] as any)[key] = value;
    setPanels(newPanels);
  };

  const handleSubmit = async () => {
    try {
      if (!user?.token) throw new Error("Token is expired");

      const interviewersPayload = panels.map((p) => [...p.members, p.mode]);
      const panelLinks = panels.map((p) => (p.mode === "Online" ? p.link : ""));

      const payload: SheduleInterviewDto = {
        job_id: Number(job_id),
        round_number: roundNumber,
        scheduled_start_time: startTime,
        duration_per_interview: duration,
        interviewers: interviewersPayload,
        panel_links: panelLinks,
        location,
        result_of: round,
        scheduled_by: user.userId,
        interview_type_id: selectedInterviewType,
      };

      await scheduleInterview(payload, user.token);
      notify.success("Interviews scheduled successfully!");
    } catch (err: any) {
      notify.error(err.message);
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-3xl font-bold mb-4 text-center">
        Schedule Interviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="pb-2">Round Number</Label>
          <Input
            type="number"
            value={roundNumber}
            onChange={(e) => setRoundNumber(Number(e.target.value))}
          />
        </div>
        <div>
          <Label className="pb-2">Start Time</Label>
          <DatePicker
            selected={startTime}
            onChange={(date) => setStartTime(date)}
            showTimeSelect
            className="
              flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 
              text-sm ring-offset-background placeholder:text-muted-foreground 
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
              focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div>
          <Label className="pb-2">Duration (minutes)</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="pb-2">Interview Type</Label>
          <Select
            value={String(selectedInterviewType)}
            onValueChange={(val) => setSelectedInterviewType(Number(val))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Interview Type" />
            </SelectTrigger>
            <SelectContent>
              {interviewTypes.map((type) => (
                <SelectItem
                  key={type.interview_type_id}
                  value={String(type.interview_type_id)}
                >
                  {type.interview_round_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="">
          <Label className="pb-2">Select Result of</Label>
          <Select
            value={String(round)}
            onValueChange={(val) => setSelectedRound(Number(val))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Interview Type" />
            </SelectTrigger>
            <SelectContent>
              {interviewRounds.map((type) => (
                <SelectItem
                  key={type.interview_round_name}
                  value={String(type.round_number)}
                >
                  {type.round_number}. {type.interview_round_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="pb-2">Location (for Offline)</Label>
        <Input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        <h3 className="font-semibold text-xl">Panels</h3>
        {panels.map((panel, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-lg">Panel {index + 1}</span>
              {panels.length > 1 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removePanel(index)}
                  className="cursor-pointer"
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="pb-2">Mode</Label>
                <Select
                  value={panel.mode}
                  onValueChange={(val) => handlePanelChange(index, "mode", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="pb-2">Interviewers</Label>
                {panel.members.sort().map((member, i) => (
                  <div className="mb-2" key={i}>
                    <Select
                      key={i}
                      value={member}
                      onValueChange={(val) => {
                        const newMembers = [...panel.members];
                        newMembers[i] = val;
                        handlePanelChange(index, "members", newMembers);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select interviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        {interviewers.map((iv) => (
                          <SelectItem key={iv.user_id} value={iv.user_id}>
                            {iv.name} {"( "+ iv.roles.sort().map((r) => r.role_name).join(" / ") +" )"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handlePanelChange(index, "members", [...panel.members, ""])
                  }
                  className="cursor-pointer"
                >
                  Add Interviewer
                </Button>
              </div>

              {panel.mode === "Online" && (
                <div>
                  <Label className="pb-2">Online Link</Label>
                  <Input
                    type="text"
                    placeholder="Enter online link"
                    value={panel.link}
                    onChange={(e) =>
                      handlePanelChange(index, "link", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addPanel} className="cursor-pointer">
          Add Panel
        </Button>
      </div>

      <div className="pt-6 flex justify-center">
        <Button size="lg" onClick={handleSubmit} className="cursor-pointer">
          Schedule Interviews
        </Button>
      </div>
    </div>
  );
}
