import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Mic, MessageSquare, PenTool, Share2, LogOut, Lock, Shield, Timer } from "lucide-react"

interface MeetingViewProps {
  currentRoom: string
  isPasswordProtected: boolean
  displayName: string
  joinStartTime: Date | null
  isDarkMode: boolean
  shareLink: () => Promise<void>
  leaveRoom: () => void
}

export default function MeetingView({
  currentRoom,
  isPasswordProtected,
  displayName,
  joinStartTime,
  isDarkMode,
  shareLink,
  leaveRoom,
}: MeetingViewProps) {
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
    </div>
  )
}