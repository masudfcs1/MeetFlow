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
  Lock,
  Settings,
  Moon,
  Sun,
  History,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit,
  Bell,
  Share2,
} from "lucide-react"
import type { MeetingHistory, ScheduledMeeting } from "@/types/types"

interface LobbyViewProps {
  roomName: string
  setRoomName: (name: string) => void
  displayName: string
  setDisplayName: (name: string) => void
  roomPassword: string
  setRoomPassword: (password: string) => void
  isPasswordProtected: boolean
  setIsPasswordProtected: (isProtected: boolean) => void
  isDarkMode: boolean
  setIsDarkMode: (darkMode: boolean) => void
  meetingHistory: MeetingHistory[]
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  maxParticipants: string
  setMaxParticipants: (participants: string) => void
  roomExpiry: string
  setRoomExpiry: (expiry: string) => void
  scheduledMeetings: ScheduledMeeting[]
  isScheduling: boolean
  setIsScheduling: (scheduling: boolean) => void
  editingMeeting: ScheduledMeeting | null
  scheduleForm: {
    title: string
    description: string
    date: string
    time: string
    duration: string
    roomName: string
    isPasswordProtected: boolean
    password: string
    isRecurring: boolean
    recurringType: "daily" | "weekly" | "monthly"
    maxParticipants: string
  }
  setScheduleForm: (form: any) => void
  createRoom: () => void
  scheduleNewMeeting: () => void
  editScheduledMeeting: (meeting: ScheduledMeeting) => void
  deleteScheduledMeeting: (id: string) => void
  joinScheduledMeeting: (meeting: ScheduledMeeting) => void
  joinFromHistory: (room: string) => void
  clearHistory: () => void
  formatDateTime: (date: string, time: string) => string
  isUpcoming: (date: string, time: string) => boolean
  getTimeUntilMeeting: (date: string, time: string) => string
  genRoom: () => string
}

export default function LobbyView({
  roomName,
  setRoomName,
  displayName,
  setDisplayName,
  roomPassword,
  setRoomPassword,
  isPasswordProtected,
  setIsPasswordProtected,
  isDarkMode,
  setIsDarkMode,
  meetingHistory,
  showPassword,
  setShowPassword,
  maxParticipants,
  setMaxParticipants,
  roomExpiry,
  setRoomExpiry,
  scheduledMeetings,
  isScheduling,
  setIsScheduling,
  editingMeeting,
  scheduleForm,
  setScheduleForm,
  createRoom,
  scheduleNewMeeting,
  editScheduledMeeting,
  deleteScheduledMeeting,
  joinScheduledMeeting,
  joinFromHistory,
  clearHistory,
  formatDateTime,
  isUpcoming,
  getTimeUntilMeeting,
  genRoom,
}: LobbyViewProps) {
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

        <Tabs defaultValue="create" className="w-full dark:text-white">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="create" className={isDarkMode ? "text-blue-500" : "text-black"}>
              Create Room
            </TabsTrigger>
            <TabsTrigger value="schedule" className={isDarkMode ? "text-blue-500" : "text-black"}>
              Schedule
            </TabsTrigger>
            <TabsTrigger value="history" className={isDarkMode ? "text-blue-500" : "text-black"}>
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className={isDarkMode ? "text-blue-500" : "text-black"}>
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Create Room Tab */}
          <TabsContent value="create" className="dark:bg-blue-500">
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
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
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
                      <Button onClick={scheduleNewMeeting} className="bg-blue-600 hover:bg-blue-700 text-white">
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
                      <Button onClick={() => setIsScheduling(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
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
    </div>
  )
}