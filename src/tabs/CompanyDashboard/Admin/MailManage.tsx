import { useEffect, useState } from "react";
import {
  deleteEmail,
  getAllMails,
  getRecipients,
  updateEmail,
} from "@/api/Email_api";
import ListManager from "@/components/custom/ListManager";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useAuth } from "@/route_protection/AuthContext";
import { notify } from "@/components/custom/Notifications";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { MdOutlineDelete, MdOutlinePreview } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export interface EmailMessage {
  id: number;
  subject: string;
  body: string;
  isSent: boolean;
  createdAt: string;
  scheduledAt: string;
}

export interface EmailUpdateReq {
  Id: number;
  Subject: string;
  Body: string;
  ScheduledAt: string;
}

export interface RecipientsRes {
  email: string;
  type: number;
}

const stripHtmlTags = (html: string) =>
  html
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/p>/gi, "\n")
    .replace(/&nbsp;/gi, " ")
    .trim();

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const textToHtml = (text: string) =>
  escapeHtml(text)
    .split("\n")
    .map((line) => `<p>${line || "&nbsp;"}</p>`)
    .join("");

const toUTCISOString = (localDateTime: string) =>
  new Date(localDateTime).toISOString();

function EmailDialog({
  email: initialEmail,
  open,
  onOpenChange,
  mode,
  onUpdated,
}: {
  email: EmailMessage;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "view" | "edit";
  onUpdated: () => void;
}) {
  const { user } = useAuth();
  const [email, setEmail] = useState<EmailMessage>(initialEmail);
  const [body, setBody] = useState(stripHtmlTags(initialEmail.body));
  const [to, setTo] = useState<RecipientsRes[]>();
  const [cc, setCc] = useState<RecipientsRes[]>();

  useEffect(() => {
    if (!user?.token) {
      notify.error("Session Expired", "Please login again");
      return;
    }
    const fetchData = async () => {
      try {
        const res = await getRecipients(email.id, user.token);
        setTo(res.filter((r) => r.type === 1));
        setCc(res.filter((r) => r.type === 2));
      } catch (error: any) {
        notify.error("Error", error.message);
      }
    };
    fetchData();
  }, [email.id]);

  const handleUpdate = async () => {
    if (!user?.token) {
      notify.error("Session Expired", "Please login again");
      return;
    }

    const payload: EmailUpdateReq = {
      Id: email.id,
      Subject: email.subject,
      Body: textToHtml(body),
      ScheduledAt: toUTCISOString(email.scheduledAt),
    };

    try {
      await updateEmail(payload, user.token);
      notify.success("Success", "Email updated successfully");
      onUpdated();
    } catch (err: any) {
      notify.error("Error", err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-transparent" />

      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto md:no-scrollbar">
        <DialogHeader>
          <DialogTitle>
            {mode === "view" ? "View Email" : "Update Email"}
          </DialogTitle>
        </DialogHeader>

        {mode === "edit" && email.isSent && (
          <div className="bg-red-100 border border-red-600 rounded-md p-3">
            Email is already sent. Can't Update !!
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label>Subject</Label>
            <Input
              value={email.subject}
              onChange={(e) => setEmail({ ...email, subject: e.target.value })}
              disabled={mode === "view" || email.isSent}
            />
          </div>

          <div>
            <Label>Body</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="h-52"
              disabled={mode === "view" || email.isSent}
            />
          </div>

          <div>
            <Label>Scheduled At</Label>
            <Input
              type="datetime-local"
              value={
                email.scheduledAt !== "0001-01-01T00:00:00"
                  ? email.scheduledAt.slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                setEmail({ ...email, scheduledAt: e.target.value })
              }
              disabled={mode === "view" || email.isSent}
            />
          </div>

          {mode === "edit" && !email.isSent && (
            <Button onClick={handleUpdate}>Save</Button>
          )}
        </div>

        <div className="border rounded-md p-4 mt-4">
          <Label>To:</Label>
          <hr className="my-2" />
          {to?.map((item, index) => (
            <p key={index} className="text-gray-500">
              {item.email}
            </p>
          ))}
        </div>

        <div className="border rounded-md p-4 mt-4">
          <Label>Cc:</Label>
          <hr className="my-2" />
          {cc?.map((item, index) => (
            <p key={index} className="text-gray-500">
              {item.email}
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ===================== MAIN ===================== */

export default function MailManager() {
  const { user } = useAuth();
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [dialogMode, setDialogMode] = useState<"view" | "edit">("view");
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDelete = async (id: number) => {
    if (!user?.token) {
      notify.error("Session Expired", "Please login again");
      return;
    }

    try {
      await deleteEmail(id, user.token);
      notify.success("Success", "Email deleted successfully");
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      notify.error("Error", err.message);
    }
  };

  const columns: ColumnDef<EmailMessage>[] = [
    { accessorKey: "id", header: "Email ID" },
    { accessorKey: "subject", header: "Subject" },
    {
      accessorKey: "isSent",
      header: "Status",
      cell: ({ row }) => (row.getValue<boolean>("isSent") ? "Sent" : "Pending"),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.getValue<string>("createdAt")).toLocaleDateString(),
    },
    {
      accessorKey: "scheduledAt",
      header: "Scheduled At",
      cell: ({ row }) => {
        const value = row.getValue<string>("scheduledAt");
        if (!value || value === "0001-01-01T00:00:00") return "-";
        return new Date(value + "Z").toLocaleString();
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const email = row.original;

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedEmail(email);
                    setDialogMode("view");
                    setOpen(true);
                  }}
                >
                  <MdOutlinePreview className="mr-2" /> View
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setSelectedEmail(email);
                    setDialogMode("edit");
                    setOpen(true);
                  }}
                >
                  <FaRegEdit className="mr-2" /> Update
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleDelete(email.id)}
                >
                  <MdOutlineDelete className="mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedEmail && (
              <EmailDialog
                email={selectedEmail}
                open={open}
                onOpenChange={setOpen}
                mode={dialogMode}
                onUpdated={() => {
                  setOpen(false);
                  setRefreshKey((k) => k + 1);
                }}
              />
            )}
          </>
        );
      },
    },
  ];

  return (
    <Card className="w-full min-h-full">
      <CardTitle className="text-3xl font-semibold mx-auto">
        Auto Mailer
      </CardTitle>
      <CardContent className="w-full">
        <ListManager<EmailMessage>
      key={refreshKey}
      fetchFunction={getAllMails}
      addLink="add"
      columns={columns}
      addButton={true}
    />
      </CardContent>
    </Card>
  );
}
