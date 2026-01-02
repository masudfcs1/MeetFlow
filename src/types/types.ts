




export interface MeetingHistory {
  roomName: string
  joinedAt: string
  duration?: string
}

export interface ScheduledMeeting {
  id: string
  roomName: string
  title: string
  description?: string
  date: string
  time: string
  duration: number
  isPasswordProtected: boolean
  password?: string
  createdAt: string
  isRecurring?: boolean
  recurringType?: "daily" | "weekly" | "monthly"
  maxParticipants: number
}

