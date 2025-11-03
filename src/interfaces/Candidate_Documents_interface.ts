export interface CandidateDocumentDto{
    document_id: number;
    document_type: string;
    file_path: string;
    verification_status: string;
    uploaded_at: Date;
}

export interface UploadCandidateDocuments{
    document_type: string;
    file_path: string;
    candidate_id: string;
}