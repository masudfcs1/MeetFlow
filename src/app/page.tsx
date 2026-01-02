"use client"

import { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"

import type { MeetingHistory, ScheduledMeeting } from "@/types/types"
import LobbyView from "@/components/lobbyView/lobbyView"
import MeetingView from "@/components/MeetingView/MeetingView"

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
          icon: "🔔",
          duration: 5000,
        })
      })
    }

    const interval = setInterval(checkUpcomingMeetings, 60000)
    return () => clearInterval(interval)
  }, [scheduledMeetings])

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

  if (currentRoom) {
    return (
      <MeetingView
        currentRoom={currentRoom}
        isPasswordProtected={isPasswordProtected}
        displayName={displayName}
        joinStartTime={joinStartTime}
        isDarkMode={isDarkMode}
        shareLink={shareLink}
        leaveRoom={leaveRoom}
      />
    )
  }

  return (
    <>
      <LobbyView
        roomName={roomName}
        setRoomName={setRoomName}
        displayName={displayName}
        setDisplayName={setDisplayName}
        roomPassword={roomPassword}
        setRoomPassword={setRoomPassword}
        isPasswordProtected={isPasswordProtected}
        setIsPasswordProtected={setIsPasswordProtected}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        meetingHistory={meetingHistory}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        maxParticipants={maxParticipants}
        setMaxParticipants={setMaxParticipants}
        roomExpiry={roomExpiry}
        setRoomExpiry={setRoomExpiry}
        scheduledMeetings={scheduledMeetings}
        isScheduling={isScheduling}
        setIsScheduling={setIsScheduling}
        editingMeeting={editingMeeting}
        scheduleForm={scheduleForm}
        setScheduleForm={setScheduleForm}
        createRoom={createRoom}
        scheduleNewMeeting={scheduleNewMeeting}
        editScheduledMeeting={editScheduledMeeting}
        deleteScheduledMeeting={deleteScheduledMeeting}
        joinScheduledMeeting={joinScheduledMeeting}
        joinFromHistory={joinFromHistory}
        clearHistory={clearHistory}
        formatDateTime={formatDateTime}
        isUpcoming={isUpcoming}
        getTimeUntilMeeting={getTimeUntilMeeting}
        genRoom={genRoom}
      />
      <Toaster />
    </>
  )
}