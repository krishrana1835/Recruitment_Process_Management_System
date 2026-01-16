import { getCandidateList } from "@/api/Candidate_api";
import { candidateListColumnsViewer } from "@/components/custom/columns";
import ListManager from "@/components/custom/ListManager";
import { Card, CardContent } from "@/components/ui/card";
import type { CandidateListDto } from "@/interfaces/Candidate_interface";

export default function ListCandidates() {
  return (
    <Card className="w-full h-full">
      <CardContent>
        <h1 className="text-2xl font-semibold mb-4">Candidates</h1>
        <ListManager<CandidateListDto>
          fetchFunction={getCandidateList}
          addLink=""
          columns={candidateListColumnsViewer}
          addButton={false}
        />
      </CardContent>
    </Card>
  );
}
