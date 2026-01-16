export interface EmailScheduler{
  subject: string,
  body: string,
  toUserIds: string[],
  ccUserIds: string[],
  scheduledAt: string
}