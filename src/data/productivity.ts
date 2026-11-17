export interface ProductivityTool {
  id: string
  name: string
  description: string
  /** Full path served by nginx (NOT a React Router route). Keep the trailing slash. */
  href: string
  tags: string[]
  status: 'LIVE' | 'SOON'
}

// Add a new productivity service = add an entry here, then give it its own
// `location /productivity/<id>/` block in nginx (see deploy/nginx-productivity.sh).
export const productivityTools: ProductivityTool[] = [
  {
    id: 'transcriptor',
    name: 'Free Transcriptor',
    description:
      'Self-hosted, free transcription of any audio or video file into Hinglish (Hindi in Roman letters, English words kept as English). Any format, any length, with noise reduction. Sign up to keep your transcript history; audio is never stored.',
    href: '/productivity/transcriptor/',
    tags: ['faster-whisper', 'FastAPI', 'MongoDB', 'Docker'],
    status: 'LIVE',
  },
]
