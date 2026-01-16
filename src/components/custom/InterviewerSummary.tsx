import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CandidateSummary {
  candidateId: string;
  candidateName: string;
  email?: string;
}

export interface InterviewSummaryResponse {
  jobId: number;
  totalCandidates: number;
  selectedCandidates: number;
  averageScore: number;
  lastInterviewDate: string;
  selectedCandidateDetails?: CandidateSummary[] | null;
}

const COLORS = ["#22c55e", "#ef4444"];

interface Props {
  interviewerName: string;
  summaries: InterviewSummaryResponse[] | null;
}

const InterviewerSummary: React.FC<Props> = ({
  interviewerName,
  summaries,
}) => {
  if (!summaries || summaries.length === 0) {
    return null;
  }

  const totalCandidates = summaries.reduce(
    (sum, s) => sum + (s.totalCandidates ?? 0),
    0
  );

  const selectedCandidates = summaries.reduce(
    (sum, s) => sum + (s.selectedCandidates ?? 0),
    0
  );

  const rejectedCandidates = totalCandidates - selectedCandidates;

  const totalScore = summaries.reduce(
    (sum, s) => sum + (s.averageScore ?? 0) * (s.totalCandidates ?? 0),
    0
  );

  const averageScore =
    totalCandidates > 0 ? (totalScore / totalCandidates).toFixed(2) : "0";

  const lastInterviewDate = summaries
    .map((s) => new Date(s.lastInterviewDate))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const formattedDate = lastInterviewDate
    ? lastInterviewDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const pieData = [
    { name: "Selected", value: selectedCandidates },
    { name: "Rejected", value: rejectedCandidates },
  ];

  const downloadSummary = () => {
    const text = `
Interviewer Summary (All Jobs)

Interviewer: ${interviewerName}

Total interviews conducted: ${totalCandidates}
Selected candidates: ${selectedCandidates}
Rejected candidates: ${rejectedCandidates}
Average interviewer rating: ${averageScore}/5

Last interview conducted on: ${formattedDate}
`;

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "interviewer-summary-all-jobs.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        Interviewer Summary (All Jobs)
      </h2>

      <p>
        <strong>{interviewerName}</strong> has conducted{" "}
        <strong>{totalCandidates}</strong> interviews.
      </p>

      <p className="mt-2">
        Selected <strong>{selectedCandidates}</strong> candidates and rejected{" "}
        <strong>{rejectedCandidates}</strong> candidates.
      </p>

      <p className="mt-2">
        Average interviewer rating:{" "}
        <strong>{averageScore}/5</strong>
      </p>

      <div className="mt-8 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-6">
        <strong>Last interview conducted on:</strong> {formattedDate}
      </p>

      <button
        onClick={downloadSummary}
        className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Download Combined Summary
      </button>
    </div>
  );
};

export default InterviewerSummary;