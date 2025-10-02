'use client'

import { Mic, Plus, Calendar } from 'lucide-react'

interface MeetingsHeaderProps {
  onStartRecording: () => void
  onScheduleMeeting: () => void
  selectedCount: number
  totalMeetings: number
}

export default function MeetingsHeader({ 
  onStartRecording, 
  onScheduleMeeting, 
  selectedCount,
  totalMeetings 
}: MeetingsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="mt-2 text-gray-600">
            Schedule meetings and record sessions with AI transcription
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {selectedCount} selected
          </div>
          
          <button
            onClick={onStartRecording}
            className="btn btn-primary flex items-center"
          >
            <Mic className="h-4 w-4 mr-2" />
            Start Recording
          </button>
          
          <button
            onClick={onScheduleMeeting}
            className="btn btn-outline flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Meeting
          </button>
        </div>
      </div>
    </div>
  )
}
