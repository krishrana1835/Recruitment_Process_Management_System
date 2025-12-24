import { fetchRounds, deleteRound } from "@/api/Interview_api";
import { notify } from "@/components/custom/Notifications";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/route_protection/AuthContext";
import { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { DeleteRoundDto } from "@/interfaces/Interview_interface";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface DeleteRound {
  job_id: number;
  roundData: roundData[];
}

interface roundData {
  round_number: number;
  interview_round_name: string;
  process_descreption: string;
  name: string;
  interview_date: string;
}

export default function DeleteRound({ allowUpdate }: { allowUpdate: boolean }) {
  const { job_id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [rounds, setRounds] = useState<DeleteRound>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        if (!user?.token) {
          notify.error("User not authenticated.");
          return;
        }

        if (!job_id) {
          notify.error("Job ID is missing.");
          return;
        }

        const res = await fetchRounds(parseInt(job_id), user.token);
        setRounds(res);
      } catch (err: any) {
        notify.error("Error", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleShowCandidates = (round_number: number) => {
    if (!job_id) {
      notify.error("Job ID is missing.");
      return;
    }

    navigate(
      `/company/dashboard/list-interview-round/candidates/${job_id}/${round_number}`
    );
  };

  const handleDelete = async (round_number: number, round_name: string) => {
    if (!user?.token) {
      notify.error("User not authenticated.");
      return;
    }

    if (!job_id) {
      notify.error("Job ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${round_name} round?`
    );

    if (!confirmed) return;

    try {
      const payload: DeleteRoundDto = {
        job_id: parseInt(job_id),
        round_number: round_number,
      };
      await deleteRound(payload, user.token);

      setRounds((prev) =>
        prev
          ? {
              ...prev,
              roundData: prev.roundData.filter(
                (r) => r.round_number !== round_number
              ),
            }
          : prev
      );
      notify.success("Round deleted successfully");
    } catch (err: any) {
      notify.error("Failed to delete round", err.message);
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center border-none bg-gray-50">
        <Atom color="#000000" size="medium" text="Loading..." textColor="" />
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Interview Rounds</h2>

      {rounds?.roundData.length ? (
        <div className="">
          {rounds.roundData.map((round) => (
            <Card
              key={round.round_number}
              className="p-4 flex justify-between items-start mb-4"
            >
              <div className="space-y-1">
                <p className="font-medium">
                  Round {round.round_number}: {round.interview_round_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {round.process_descreption}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(round.interview_date).toLocaleDateString()}
                </p>
              </div>

              {allowUpdate ? (
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() =>
                    handleDelete(round.round_number, round.interview_round_name)
                  }
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              ) : (
                <Button
                  onClick={() => handleShowCandidates(round.round_number)}
                  className="cursor-pointer"
                >
                  Show Candidates
                </Button>
              )}
            </Card>
          ))}
          <Card className="p-4 flex justify-between items-start">
            <div className="space-y-1">
              <p className="font-medium">Score Cards</p>
              <p className="text-sm text-muted-foreground flex flex-row gap-4 mt-4">
                {rounds?.roundData.map((round, index) => (
                  <Link
                    key={index}
                    to={`/company/dashboard/list-interview-round/scores/${job_id}/${round.round_number}`}
                  >
                    <Badge variant={"outline"} className="p-4">
                      {round.round_number}
                    </Badge>
                  </Link>
                ))}
              </p>
            </div>
          </Card>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No interview rounds found.
        </p>
      )}
    </Card>
  );
}
