export interface InterviewType {
  interview_type_id: number;
  interview_round_name: string;
  process_descreption?: string;
}

export interface AddInterviewType {
  interview_round_name: string;
  process_descreption?: string;
}

export interface DeleteInterviewType {
  interview_type_id: number;
}