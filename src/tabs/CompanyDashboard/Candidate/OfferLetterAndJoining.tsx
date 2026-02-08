import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CalendarCheck, Briefcase } from "lucide-react";
import { useAuth } from "@/route_protection/AuthContext";
import { Atom } from "react-loading-indicators";
import { notify } from "@/components/custom/Notifications";
import { GetOfferLatterAndJoiningDate } from "@/api/Employee_Records_api";

export interface OfferData {
  employeeId: number;
  joiningDate: string;
  offerLetterPath: string;
  job: {
    jobId: number;
    jobTitle: string;
    jobDescription: string;
  };
}

export default function OfferLetterAndJoining() {
  const { user } = useAuth();
  const [data, setData] = useState<OfferData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const document_url = import.meta.env.VITE_DOCUMENT_URL;

  useEffect(() => {
    if (!user?.token) {
      notify.error("User not authenticated");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await GetOfferLatterAndJoiningDate(
          user?.userId,
          user.token,
        );
        setData(response);
      } catch (err: any) {
        setError(err.message || "Failed to fetch offer details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Atom color="#000000" size="medium" text="Loading..." />
      </div>
    );
  }

  if (error) {
    return <Card className="p-6 text-center text-red-500">{error}</Card>;
  }

  if (!data) return null;

  return (
    <div className="flex justify-center items-center w-full min-h-full p-2">
      <Card className="shadow-md w-5xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#004080]">
            <Briefcase className="h-5 w-5" />
            Offer Letter & Joining Details
          </CardTitle>
          <CardDescription>
            Review your offer letter and joining information
          </CardDescription>
        </CardHeader>

        <hr />

        <CardContent className="space-y-6 pt-6">
          <div>
            <h3 className="font-semibold text-lg">{data.job.jobTitle}</h3>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
              {data.job.jobDescription}
            </p>
          </div>

          <hr />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-green-600" />
              <span className="font-medium">Joining Date</span>
            </div>
            <Badge variant="secondary">
              {new Date(data.joiningDate).toLocaleDateString()}
            </Badge>
          </div>

          <hr />

          {/* Offer Letter */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Offer Letter</span>
            </div>

            <Button variant="outline" asChild>
              <a
                href={document_url+data.offerLetterPath}
                target="_blank"
                rel="noopener noreferrer"
              >
                View / Download
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
