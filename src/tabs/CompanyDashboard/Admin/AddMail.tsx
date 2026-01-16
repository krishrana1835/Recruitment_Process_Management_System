import { scheduleAutoMail } from "@/api/Email_api";
import { getJobTitles } from "@/api/Job_api";
import { notify } from "@/components/custom/Notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/route_protection/AuthContext";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { MdWarningAmber } from "react-icons/md";

export interface JobTitleInterface {
  job_id: number;
  job_title: string;
  scheduled: string;
}

export interface AutoMailerAddReq {
  jobId: number;
  subject: string;
  Body: string;
  scheduledAt: string;
  to: string[];
  cc: string[];
}

const RECIPIENT_OPTIONS = [
  "All Interviewers & HR",
  "All Candidates",
  "Selected Candidates",
];

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const textToHtml = (text: string) =>
  escapeHtml(text)
    .split("\n")
    .map((line) => `<p>${line || "&nbsp;"}</p>`)
    .join("");

const toUTCISOString = (localDateTime: string) =>
  new Date(localDateTime).toISOString();

export default function AddMail() {
  const { user } = useAuth();

  const [jobTitles, setJobTitles] = useState<JobTitleInterface[] | null>(null);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [jobId, setJobId] = useState<number>();

  const [toRecipients, setToRecipients] = useState<string[]>([]);
  const [ccRecipients, setCcRecipients] = useState<string[]>([]);

  useEffect(() => {
    if (!user?.token) {
      notify.error("Session Expired", "Please login again");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getJobTitles(user.token);
        setJobTitles(res);
      } catch (error: any) {
        notify.error("Error", error.message);
      }
    };

    fetchData();
  }, [user?.token]);

  const toggleRecipient = (
    value: string,
    type: "to" | "cc",
    checked: boolean
  ) => {
    if (type === "to") {
      setToRecipients((prev) =>
        checked ? [...prev, value] : prev.filter((v) => v !== value)
      );

      // Remove from CC if added to TO
      if (checked) {
        setCcRecipients((prev) => prev.filter((v) => v !== value));
      }
    } else {
      setCcRecipients((prev) =>
        checked ? [...prev, value] : prev.filter((v) => v !== value)
      );
    }
  };

  const handleSend = async () => {
    if (!subject || !body || !scheduledAt) {
      notify.error("Validation Error", "All fields are required");
      return;
    }

    if (toRecipients.length === 0 && ccRecipients.length === 0) {
      notify.error("Validation Error", "At least one recipient is required");
      return;
    }

    if (!jobId) {
      notify.error("Validation Error", "Job is required");
      return;
    }

    if (!user?.token) {
      notify.error("Session Expired", "Please login again");
      return;
    }

    const payload: AutoMailerAddReq = {
      jobId: jobId,
      subject: subject,
      Body: textToHtml(body),
      scheduledAt: toUTCISOString(scheduledAt),
      to: toRecipients,
      cc: ccRecipients,
    };

    try {
      await scheduleAutoMail(payload, user.token);
      notify.success("Success", "Mail scheduled successfully");
    } catch (err: any) {
      notify.error("Error", err.message);
      return;
    }
  };

  return (
    <Card className="min-h-full">
      <CardContent>
        <div className="bg-yellow-100 rounded-md border border-yellow-500 p-4 my-4 flex">
          <MdWarningAmber className="size-5 mr-2" />
          Once Email is sent then recipients cannot be changed
        </div>

        <div className="font-medium">Send to:</div>
        <Select onValueChange={(value) => setJobId(Number(value))} required>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Job" />
          </SelectTrigger>

          <SelectContent>
            {jobTitles?.map((s) => (
              <SelectItem key={s.job_id} value={String(s.job_id)}>
                {s.job_title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {/* TO */}
          <div className="border rounded-md p-4 shadow-sm">
            <div className="mt-2 font-medium">To:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-4">
              {RECIPIENT_OPTIONS.map((opt) => (
                <div key={opt} className="flex items-center gap-2">
                  <Checkbox
                    checked={toRecipients.includes(opt)}
                    onCheckedChange={(checked) =>
                      toggleRecipient(opt, "to", !!checked)
                    }
                  />
                  <Label>{opt}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* CC */}
          <div className="border rounded-md p-4 shadow-sm">
            <div className="font-medium">Cc:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-4">
              {RECIPIENT_OPTIONS.map((opt) => (
                <div key={opt} className="flex items-center gap-2">
                  <Checkbox
                    disabled={toRecipients.includes(opt)}
                    checked={ccRecipients.includes(opt)}
                    onCheckedChange={(checked) =>
                      toggleRecipient(opt, "cc", !!checked)
                    }
                  />
                  <Label
                    className={toRecipients.includes(opt) ? "opacity-50" : ""}
                  >
                    {opt}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 border p-4 rounded-md shadow-sm max-w-4xl mx-auto">
          <div>
            <Label className="font-medium">Subject</Label>
            <Input
              placeholder="Subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div>
            <Label className="font-medium">Body</Label>
            <Textarea
              className="h-52"
              placeholder="Body..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>

          <div>
            <Label className="font-medium mr-4">Scheduled At</Label>
            <DatePicker
              selected={scheduledAt ? new Date(scheduledAt) : null}
              onChange={(date: Date | null) =>
                setScheduledAt(date ? date.toISOString() : "")
              }
              showTimeSelect
              dateFormat="dd/MM/yyyy h:mm aa"
              timeFormat="h:mm aa"
              timeIntervals={15}
              className="
    flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 
    text-sm ring-offset-background placeholder:text-muted-foreground 
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
    focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
        </div>

        <Button className="mt-4" onClick={handleSend}>
          Send
        </Button>
      </CardContent>
    </Card>
  );
}
