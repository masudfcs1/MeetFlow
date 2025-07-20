"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Video,
  Mic,
  MessageSquare,
  PenTool,
  Share2,
  LogOut,
  Lock,
  Settings,
  Moon,
  Sun,
  History,
  Eye,
  EyeOff,
  Shield,
  Timer,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit,
  Bell,
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast" // Changed from "@/hooks/use-toast"

interface MeetingHistory {
  roomName: string
  joinedAt: string
  duration?: string
}

interface ScheduledMeeting {
  id: string
  roomName: string
  title: string
  description?: string
  date: string
  time: string
  duration: number // minutes
  isPasswordProtected: boolean
  password?: string
  createdAt: string
  isRecurring?: boolean
  recurringType?: "daily" | "weekly" | "monthly"
  maxParticipants: number
}

export default function MeetingRoom() {
  // Basic states
  const [roomName, setRoomName] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [currentRoom, setCurrentRoom] = useState<string | null>(null)

  // Feature states
  const [roomPassword, setRoomPassword] = useState("")
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [meetingHistory, setMeetingHistory] = useState<MeetingHistory[]>([])
  const [joinStartTime, setJoinStartTime] = useState<Date | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [maxParticipants, setMaxParticipants] = useState("10")
  const [roomExpiry, setRoomExpiry] = useState("60")

  // Calendar/Scheduling states
  const [scheduledMeetings, setScheduledMeetings] = useState<ScheduledMeeting[]>([])
  const [isScheduling, setIsScheduling] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<ScheduledMeeting | null>(null)

  // Schedule form states
  const [scheduleForm, setScheduleForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "60",
    roomName: "",
    isPasswordProtected: false,
    password: "",
    isRecurring: false,
    recurringType: "weekly" as "daily" | "weekly" | "monthly",
    maxParticipants: "10",
  })

  // Load saved data
  useEffect(() => {
    const savedHistory = localStorage.getItem("meetingHistory")
    const savedTheme = localStorage.getItem("darkMode")
    const savedName = localStorage.getItem("displayName")
    const savedScheduled = localStorage.getItem("scheduledMeetings")

    if (savedHistory) setMeetingHistory(JSON.parse(savedHistory))
    if (savedTheme) setIsDarkMode(JSON.parse(savedTheme))
    if (savedName) setDisplayName(savedName)
    if (savedScheduled) setScheduledMeetings(JSON.parse(savedScheduled))
  }, [])

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode))
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Save scheduled meetings
  useEffect(() => {
    localStorage.setItem("scheduledMeetings", JSON.stringify(scheduledMeetings))
  }, [scheduledMeetings])

  // Check URL for existing room
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const room = params.get("room")
    const password = params.get("password")

    if (room) {
      setCurrentRoom(room)
      if (password) setRoomPassword(password)
    }
  }, [])

  // Check for upcoming meetings
  useEffect(() => {
    const checkUpcomingMeetings = () => {
      const now = new Date()
      const upcoming = scheduledMeetings.filter((meeting) => {
        const meetingDateTime = new Date(`${meeting.date}T${meeting.time}`)
        const timeDiff = meetingDateTime.getTime() - now.getTime()
        return timeDiff > 0 && timeDiff <= 15 * 60 * 1000 // 15 minutes before
      })

      upcoming.forEach((meeting) => {
        toast(`"${meeting.title}" starts in 15 minutes`, {
          icon: "🔔", // Using an emoji for the icon
          duration: 5000,
        })
      })
    }

    const interval = setInterval(checkUpcomingMeetings, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [scheduledMeetings]) // Removed toast from dependency array as it's a stable function

  const genRoom = () => {
    const adj = ["Quick", "Smart", "Bright", "Swift", "Sharp", "Cool", "Fast", "Clear"]
    const noun = ["Meeting", "Chat", "Talk", "Call", "Room", "Hub", "Space", "Session"]
    return `${adj[(Math.random() * adj.length) | 0]}${noun[(Math.random() * noun.length) | 0]}${Math.floor(
      Math.random() * 1000,
    )}`
  }

  const createRoom = () => {
    const room = roomName.trim() || genRoom()

    if (displayName.trim()) {
      localStorage.setItem("displayName", displayName.trim())
    }

    setCurrentRoom(room)
    setJoinStartTime(new Date())

    let newUrl = `${window.location.pathname}?room=${room}`
    if (isPasswordProtected && roomPassword) {
      newUrl += `&password=${roomPassword}`
    }
    window.history.pushState({}, "", newUrl)

    const newMeeting: MeetingHistory = {
      roomName: room,
      joinedAt: new Date().toLocaleString(),
    }
    const updatedHistory = [newMeeting, ...meetingHistory.slice(0, 9)]
    setMeetingHistory(updatedHistory)
    localStorage.setItem("meetingHistory", JSON.stringify(updatedHistory))

    toast.success(`Room "${room}" is ready!`, {
      duration: 3000,
      position: "top-center",
      icon: "🎉",
    })
  }

  const scheduleNewMeeting = () => {
    if (!scheduleForm.title.trim() || !scheduleForm.date || !scheduleForm.time) {
      toast.error("Please fill in title, date, and time.", {
        duration: 3000,
        position: "top-center",
      })
      return
    }

    const meetingDateTime = new Date(`${scheduleForm.date}T${scheduleForm.time}`)
    if (meetingDateTime <= new Date()) {
      toast.error("Please select a future date and time.", {
        duration: 3000,
        position: "top-center",
      })
      return
    }

    const newMeeting: ScheduledMeeting = {
      id: Date.now().toString(),
      roomName: scheduleForm.roomName.trim() || genRoom(),
      title: scheduleForm.title.trim(),
      description: scheduleForm.description.trim(),
      date: scheduleForm.date,
      time: scheduleForm.time,
      duration: Number.parseInt(scheduleForm.duration),
      isPasswordProtected: scheduleForm.isPasswordProtected,
      password: scheduleForm.password,
      createdAt: new Date().toISOString(),
      isRecurring: scheduleForm.isRecurring,
      recurringType: scheduleForm.recurringType,
      maxParticipants: Number.parseInt(scheduleForm.maxParticipants),
    }

    if (editingMeeting) {
      setScheduledMeetings((prev) => prev.map((m) => (m.id === editingMeeting.id ? newMeeting : m)))
      toast.success("Scheduled meeting has been updated.", {
        duration: 3000,
        position: "top-center",
      })
      setEditingMeeting(null)
    } else {
      setScheduledMeetings((prev) => [...prev, newMeeting])
      toast.success(`"${newMeeting.title}" has been scheduled.`, {
        duration: 3000,
        position: "top-center",
      })
    }

    // Reset form
    setScheduleForm({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "60",
      roomName: "",
      isPasswordProtected: false,
      password: "",
      isRecurring: false,
      recurringType: "weekly",
      maxParticipants: "10",
    })
    setIsScheduling(false)
  }

  const editScheduledMeeting = (meeting: ScheduledMeeting) => {
    setScheduleForm({
      title: meeting.title,
      description: meeting.description || "",
      date: meeting.date,
      time: meeting.time,
      duration: meeting.duration.toString(),
      roomName: meeting.roomName,
      isPasswordProtected: meeting.isPasswordProtected,
      password: meeting.password || "",
      isRecurring: meeting.isRecurring || false,
      recurringType: meeting.recurringType || "weekly",
      maxParticipants: meeting.maxParticipants.toString(),
    })
    setEditingMeeting(meeting)
    setIsScheduling(true)
  }

  const deleteScheduledMeeting = (id: string) => {
    setScheduledMeetings((prev) => prev.filter((m) => m.id !== id))
    toast.success("Scheduled meeting has been removed.", {
      duration: 3000,
      position: "top-center",
    })
  }

  const joinScheduledMeeting = (meeting: ScheduledMeeting) => {
    setCurrentRoom(meeting.roomName)
    setJoinStartTime(new Date())
    setRoomPassword(meeting.password || "")
    setIsPasswordProtected(meeting.isPasswordProtected)

    let newUrl = `${window.location.pathname}?room=${meeting.roomName}`
    if (meeting.isPasswordProtected && meeting.password) {
      newUrl += `&password=${meeting.password}`
    }
    window.history.pushState({}, "", newUrl)
  }

  const joinFromHistory = (room: string) => {
    setCurrentRoom(room)
    setJoinStartTime(new Date())
    window.history.pushState({}, "", `${window.location.pathname}?room=${room}`)
  }

  const leaveRoom = () => {
    if (joinStartTime) {
      const duration = Math.round((Date.now() - joinStartTime.getTime()) / 1000 / 60)
      const updatedHistory = meetingHistory.map((meeting) =>
        meeting.roomName === currentRoom && !meeting.duration ? { ...meeting, duration: `${duration} min` } : meeting,
      )
      setMeetingHistory(updatedHistory)
      localStorage.setItem("meetingHistory", JSON.stringify(updatedHistory))
    }

    setCurrentRoom(null)
    setJoinStartTime(null)
    window.history.pushState({}, "", window.location.pathname)
  }

  const copyLink = async () => {
    let url = `${window.location.origin}${window.location.pathname}?room=${currentRoom}`
    if (isPasswordProtected && roomPassword) {
      url += `&password=${roomPassword}`
    }

    try {
      await navigator.clipboard.writeText(url)
      toast.success("Meeting link copied to clipboard!", {
        duration: 3000,
        position: "top-center",
      })
    } catch {
      toast.error("Failed to copy link. Please copy manually.", {
        duration: 3000,
        position: "top-center",
      })
    }
  }

  const shareLink = async () => {
    let url = `${window.location.origin}${window.location.pathname}?room=${currentRoom}`
    if (isPasswordProtected && roomPassword) {
      url += `&password=${roomPassword}`
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my meeting: ${currentRoom}`,
          text: isPasswordProtected ? "Password-protected meeting room" : "Join the video call",
          url,
        })
      } catch {
        /* user cancelled */
      }
    } else copyLink()
  }

  const clearHistory = () => {
    setMeetingHistory([])
    localStorage.removeItem("meetingHistory")
    toast.success("Meeting history has been cleared.", {
      duration: 3000,
      position: "top-center",
    })
  }

  const formatDateTime = (date: string, time: string) => {
    const dateTime = new Date(`${date}T${time}`)
    return dateTime.toLocaleString()
  }

  const isUpcoming = (date: string, time: string) => {
    const meetingDateTime = new Date(`${date}T${time}`)
    return meetingDateTime > new Date()
  }

  const getTimeUntilMeeting = (date: string, time: string) => {
    const meetingDateTime = new Date(`${date}T${time}`)
    const now = new Date()
    const diff = meetingDateTime.getTime() - now.getTime()

    if (diff <= 0) return "Started"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `in ${days}d ${hours}h`
    if (hours > 0) return `in ${hours}h ${minutes}m`
    return `in ${minutes}m`
  }

  /* ---------- UI STATES ---------- */

  // Meeting view
  if (currentRoom) {
    const meetingDuration = joinStartTime ? Math.round((Date.now() - joinStartTime.getTime()) / 1000 / 60) : 0

    return (
      <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <Video className="h-5 w-5 text-green-400" />
            <span className="font-semibold">{currentRoom}</span>
            {isPasswordProtected && <Lock className="h-4 w-4 text-yellow-400" />}
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Timer className="h-3 w-3 mr-1" />
              {meetingDuration}m
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={shareLink}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="destructive" size="sm" onClick={leaveRoom}>
              <LogOut className="h-4 w-4 mr-2" />
              Leave
            </Button>
          </div>
        </header>
        <main className="flex-1 relative">
          <iframe
            title="Jitsi Meeting"
            src={`https://meet.jit.si/${currentRoom}#userInfo.displayName="${encodeURIComponent(
              displayName || "Guest",
            )}"&config.startWithAudioMuted=false&config.startWithVideoMuted=false`}
            className="absolute inset-0 w-full h-full"
            allow="camera; microphone; fullscreen; display-capture"
          />
        </main>
        <footer className="bg-gray-800 border-t border-gray-700 px-4 py-2 text-sm text-gray-300">
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-1">
              <Video className="h-4 w-4" /> Video
            </div>
            <div className="flex items-center gap-1">
              <Mic className="h-4 w-4" /> Audio
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> Chat
            </div>
            <div className="flex items-center gap-1">
              <PenTool className="h-4 w-4" /> Whiteboard
            </div>
            {isPasswordProtected && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Shield className="h-4 w-4" /> Protected
              </div>
            )}
          </div>
        </footer>
        <Toaster /> {/* Toaster component for react-hot-toast */}
      </div>
    )
  }

  // Lobby view
  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isDarkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Video className="h-8 w-8 text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Meeting Room</h1>
            <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              Create, schedule, or join video conferences
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={isDarkMode ? "border-gray-600 text-gray-300" : ""}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="create">Create Room</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Create Room Tab */}
          <TabsContent value="create">
            <Card className={`shadow-xl border-0 ${isDarkMode ? "bg-gray-800 text-white" : ""}`}>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Start a New Meeting</CardTitle>
                <CardDescription className={isDarkMode ? "text-gray-300" : ""}>
                  Create a room and share the link with others
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-name">Room Name (optional)</Label>
                    <Input
                      id="room-name"
                      placeholder="Enter a room name or leave blank"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display-name">Your Name</Label>
                    <Input
                      id="display-name"
                      placeholder="Display name in meeting"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="password-protection"
                      checked={isPasswordProtected}
                      onCheckedChange={setIsPasswordProtected}
                    />
                    <Label htmlFor="password-protection" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password Protection
                    </Label>
                  </div>

                  {isPasswordProtected && (
                    <div className="space-y-2">
                      <Label htmlFor="room-password">Room Password</Label>
                      <div className="relative">
                        <Input
                          id="room-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter room password"
                          value={roomPassword}
                          onChange={(e) => setRoomPassword(e.target.value)}
                          className={`pr-10 ${isDarkMode ? "bg-gray-700 border-gray-600" : ""}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={createRoom}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isPasswordProtected && !roomPassword.trim()}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Create & Join Meeting
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <div className="space-y-6">
              {/* Schedule Form */}
              {isScheduling && (
                <Card className={`shadow-xl border-0 ${isDarkMode ? "bg-gray-800 text-white" : ""}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {editingMeeting ? "Edit Scheduled Meeting" : "Schedule New Meeting"}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="meeting-title">Meeting Title *</Label>
                        <Input
                          id="meeting-title"
                          placeholder="Enter meeting title"
                          value={scheduleForm.title}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                          className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="schedule-room-name">Room Name (optional)</Label>
                        <Input
                          id="schedule-room-name"
                          placeholder="Auto-generated if empty"
                          value={scheduleForm.roomName}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, roomName: e.target.value })}
                          className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meeting-description">Description</Label>
                      <Textarea
                        id="meeting-description"
                        placeholder="Meeting agenda or description"
                        value={scheduleForm.description}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                        className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="meeting-date">Date *</Label>
                        <Input
                          id="meeting-date"
                          type="date"
                          value={scheduleForm.date}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                          className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meeting-time">Time *</Label>
                        <Input
                          id="meeting-time"
                          type="time"
                          value={scheduleForm.time}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                          className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meeting-duration">Duration (minutes)</Label>
                        <Input
                          id="meeting-duration"
                          type="number"
                          min="15"
                          max="480"
                          value={scheduleForm.duration}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, duration: e.target.value })}
                          className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="schedule-password"
                          checked={scheduleForm.isPasswordProtected}
                          onCheckedChange={(checked) =>
                            setScheduleForm({ ...scheduleForm, isPasswordProtected: checked })
                          }
                        />
                        <Label htmlFor="schedule-password" className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Password Protection
                        </Label>
                      </div>

                      {scheduleForm.isPasswordProtected && (
                        <div className="space-y-2">
                          <Label htmlFor="schedule-password-input">Meeting Password</Label>
                          <Input
                            id="schedule-password-input"
                            type="password"
                            placeholder="Enter meeting password"
                            value={scheduleForm.password}
                            onChange={(e) => setScheduleForm({ ...scheduleForm, password: e.target.value })}
                            className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsScheduling(false)
                          setEditingMeeting(null)
                          setScheduleForm({
                            title: "",
                            description: "",
                            date: "",
                            time: "",
                            duration: "60",
                            roomName: "",
                            isPasswordProtected: false,
                            password: "",
                            isRecurring: false,
                            recurringType: "weekly",
                            maxParticipants: "10",
                          })
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={scheduleNewMeeting} className="bg-blue-600 hover:bg-blue-700">
                        {editingMeeting ? "Update Meeting" : "Schedule Meeting"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Scheduled Meetings List */}
              <Card className={`shadow-xl border-0 ${isDarkMode ? "bg-gray-800 text-white" : ""}`}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Scheduled Meetings
                      </CardTitle>
                      <CardDescription className={isDarkMode ? "text-gray-300" : ""}>
                        Your upcoming meetings
                      </CardDescription>
                    </div>
                    {!isScheduling && (
                      <Button onClick={() => setIsScheduling(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Meeting
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {scheduledMeetings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar
                        className={`h-12 w-12 mx-auto mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-300"}`}
                      />
                      <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        No scheduled meetings yet. Create your first scheduled meeting!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {scheduledMeetings
                        .sort(
                          (a, b) =>
                            new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime(),
                        )
                        .map((meeting) => (
                          <div
                            key={meeting.id}
                            className={`p-4 rounded-lg border ${
                              isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"
                            } ${!isUpcoming(meeting.date, meeting.time) ? "opacity-60" : ""}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">{meeting.title}</h3>
                                  {meeting.isPasswordProtected && <Lock className="h-4 w-4 text-yellow-500" />}
                                  {isUpcoming(meeting.date, meeting.time) && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      <Bell className="h-3 w-3 mr-1" />
                                      {getTimeUntilMeeting(meeting.date, meeting.time)}
                                    </Badge>
                                  )}
                                </div>
                                {meeting.description && (
                                  <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    {meeting.description}
                                  </p>
                                )}
                                <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  <div className="flex items-center gap-4 flex-wrap">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      {formatDateTime(meeting.date, meeting.time)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {meeting.duration} minutes
                                    </span>
                                    <span>Room: {meeting.roomName}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                {isUpcoming(meeting.date, meeting.time) && (
                                  <Button
                                    size="sm"
                                    onClick={() => joinScheduledMeeting(meeting)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Video className="h-4 w-4 mr-1" />
                                    Join
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" onClick={() => editScheduledMeeting(meeting)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteScheduledMeeting(meeting.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className={`shadow-xl border-0 ${isDarkMode ? "bg-gray-800 text-white" : ""}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Meeting History
                    </CardTitle>
                    <CardDescription className={isDarkMode ? "text-gray-300" : ""}>
                      Your recent meetings
                    </CardDescription>
                  </div>
                  {meetingHistory.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearHistory}>
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {meetingHistory.length === 0 ? (
                  <p className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    No meeting history yet. Create your first meeting!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {meetingHistory.map((meeting, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div>
                          <p className="font-medium">{meeting.roomName}</p>
                          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {meeting.joinedAt} {meeting.duration && `• ${meeting.duration}`}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => joinFromHistory(meeting.roomName)}>
                          Rejoin
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className={`shadow-xl border-0 ${isDarkMode ? "bg-gray-800 text-white" : ""}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Meeting Settings
                </CardTitle>
                <CardDescription className={isDarkMode ? "text-gray-300" : ""}>
                  Configure your meeting preferences
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-participants">Max Participants</Label>
                    <Input
                      id="max-participants"
                      type="number"
                      min="2"
                      max="100"
                      value={maxParticipants}
                      onChange={(e) => setMaxParticipants(e.target.value)}
                      className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-expiry">Room Expiry (minutes)</Label>
                    <Input
                      id="room-expiry"
                      type="number"
                      min="15"
                      max="480"
                      value={roomExpiry}
                      onChange={(e) => setRoomExpiry(e.target.value)}
                      className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                  <Label htmlFor="dark-mode" className="flex items-center gap-2">
                    {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    Dark Mode
                  </Label>
                </div>

                <Separator />

                <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-blue-50"}`}>
                  <h4 className="font-medium mb-2">Quick Tips</h4>
                  <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    <li>• Schedule meetings in advance with calendar integration</li>
                    <li>• Get notifications 15 minutes before scheduled meetings</li>
                    <li>• Use password protection for private meetings</li>
                    <li>• Share meeting links to invite participants</li>
                    <li>• Your data is saved locally in your browser</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className={`text-center mt-6 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Powered by Jitsi Meet — open-source video conferencing
        </p>
      </div>
      <Toaster /> {/* Toaster component for react-hot-toast */}
    </div>
  )
}
