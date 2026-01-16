import { getTechnologyWiseProfiles } from "@/api/Reports_api";
import { getSkills } from "@/api/Skill_api";
import ListManager from "@/components/custom/ListManager";
import { notify } from "@/components/custom/Notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { SkillDto } from "@/interfaces/Skill_interrface";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { JobTitleInterface } from "../Admin/AddMail";
import { getJobTitles } from "@/api/Job_api";
import { useAuth } from "@/route_protection/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface TechnologyWiseDataRes {
  candidate_id: string;
  full_name: string;
  email: string;
  totalExpirence: number;
}

export interface TechnologyWiseDataReq {
  jobId: number;
  skillId: number[];
}

export const columns: ColumnDef<TechnologyWiseDataRes>[] = [
  {
    accessorKey: "candidate_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Candidate ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "totalExpirence",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Experience
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const candidate = row.original;

      return (
        <Link
          to={`/company/dashboard/candidates/profile/view/${candidate.candidate_id}`}
        >
          <Button variant="ghost">View</Button>
        </Link>
      );
    },
  },
];

export default function TechnologyWiseData() {
  const { user } = useAuth();

  const [availableSkills, setAvailableSkills] = useState<SkillDto[]>([]);
  const [jobs, setJobs] = useState<JobTitleInterface[]>();

  const [selectedSkills, setselectedSkills] = useState<SkillDto[]>([]);
  const [selectedSkillInput, setselectedSkillInput] = useState("");

  const [args, setArgs] = useState<TechnologyWiseDataReq>({
    jobId: 0,
    skillId: [],
  });

  useEffect(() => {
    if (!user?.token) {
      notify.error("Session Expired", "Please login again");
      return;
    }
    const fetchData = async () => {
      try {
        const skillsList = await getSkills();
        if (skillsList?.length > 0) {
          setAvailableSkills(skillsList);
        }
        const res = await getJobTitles(user.token);
        setJobs(res);
      } catch (error: any) {
        notify.error("Error while fetching skills", error.message);
      }
    };
    fetchData();

    const storedArgs = sessionStorage.getItem("techWiseArgs");
    if (storedArgs) {
      const parsed = JSON.parse(storedArgs) as TechnologyWiseDataReq;
      setArgs(parsed);
    }
  }, []);

  useEffect(() => {
    if (availableSkills.length > 0 && args.skillId.length > 0) {
      const restoredSkills = availableSkills.filter((skill) =>
        args.skillId.includes(skill.skill_id)
      );

      setselectedSkills(restoredSkills);
    }
  }, [availableSkills, args.skillId]);

  const addSelectedSkill = (skillObj: SkillDto) => {
    if (!selectedSkills.some((s) => s.skill_id === skillObj.skill_id)) {
      setselectedSkills((prev) => [...prev, skillObj]);
    }
    setselectedSkillInput("");
  };

  const removeSelectedSkill = (skillId: number) => {
    setselectedSkills((prev) => prev.filter((s) => s.skill_id !== skillId));
  };

  const filteredselectedSkills = availableSkills.filter(
    (s) =>
      s.skill_name.toLowerCase().includes(selectedSkillInput.toLowerCase()) &&
      !selectedSkills.some((selected) => selected.skill_id === s.skill_id)
  );

  const handleGenerate = () => {
    const payload: TechnologyWiseDataReq = {
      jobId: Number(args.jobId),
      skillId: selectedSkills.map((s) => s.skill_id),
    };

    setArgs(payload);

    sessionStorage.setItem("techWiseArgs", JSON.stringify(payload));
  };

  return (
    <Card className="w-full min-h-full">
      <CardContent>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Select Job:
          </h3>
          <div className="flex flex-row gap-4">
            <Select
              value={args.jobId ? String(args.jobId) : ""}
              onValueChange={(value) =>
                setArgs((prev) => ({
                  ...prev,
                  jobId: Number(value),
                }))
              }
              required
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Job" />
              </SelectTrigger>

              <SelectContent>
                {jobs?.map((s) => (
                  <SelectItem key={s.job_id} value={String(s.job_id)}>
                    {s.job_title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {args?.jobId !== 0 && (
              <div className="flex items-center justify-center border p-1 px-3 rounded-md">
                {jobs?.find((item) => item.job_id === args.jobId)?.job_title}
              </div>
            )}
          </div>
          <br />
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Select Skills
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill.skill_name}
                <button
                  type="button"
                  className="ml-2 text-purple-700 hover:text-purple-900"
                  onClick={() => removeSelectedSkill(skill.skill_id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-row items-start gap-2 relative">
            <div className="relative w-full">
              <Input
                type="text"
                value={selectedSkillInput}
                onChange={(e) => setselectedSkillInput(e.target.value)}
                placeholder="Search and select skill"
                className="h-11 w-full"
              />

              {selectedSkillInput && filteredselectedSkills.length > 0 && (
                <div className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 max-h-40 w-full overflow-y-auto shadow-md">
                  {filteredselectedSkills.map((s) => (
                    <div
                      key={s.skill_id}
                      onClick={() => addSelectedSkill(s)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                    >
                      {s.skill_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="h-11 cursor-pointer"
              onClick={handleGenerate}
            >
              Generate
            </Button>
          </div>
        </div>
        <br />
        {args.skillId.length > 0 && (
          <ListManager<TechnologyWiseDataRes>
            fetchFunction={getTechnologyWiseProfiles}
            addLink=""
            fetchArgs={[args]}
            columns={columns}
            addButton={false}
          />
        )}
      </CardContent>
    </Card>
  );
}
