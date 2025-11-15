import { mockTeams } from "@/lib/mock-data"
import { TeamCard } from "@/components/team-card"
import { AppHeader } from "@/components/app-header"

export default function HomePage() {
  const totalStories = mockTeams.reduce((acc, team) => acc + team.stories.length, 0)
  const runningStories = mockTeams.reduce(
    (acc, team) => acc + team.stories.filter((s) => s.status === "running").length,
    0,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Video Background */}
      <div className="video-background-container">
        <video className="homepage-video-background" autoPlay loop playsInline muted>
          <source src="https://res.cloudinary.com/dssum8oc4/video/upload/v1761675074/homepage_kwp4ct.webm" type="video/webm" />
          <source src="https://res.cloudinary.com/dssum8oc4/video/upload/v1761675074/homepage_kwp4ct.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="relative z-10">
        <AppHeader />

        <div className="container mx-auto px-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-[var(--radius-3xl)] border border-[#e7e7e7] bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-all duration-[0.3s] ease-[var(--default-transition-timing-function)] cursor-pointer hover:shadow-lg overflow-hidden relative min-w-[280px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Teams</p>
                <h3 className="text-3xl font-bold text-black">{mockTeams.length}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-blue-500" />
              </div>
            </div>
          </div>

          <div className="rounded-[var(--radius-3xl)] border border-[#e7e7e7] bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-all duration-[0.3s] ease-[var(--default-transition-timing-function)] cursor-pointer hover:shadow-lg overflow-hidden relative min-w-[280px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Test Runs</p>
                <h3 className="text-3xl font-bold text-black">{totalStories}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-purple-500" />
              </div>
            </div>
          </div>

          <div className="rounded-[var(--radius-3xl)] border border-[#e7e7e7] bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-all duration-[0.3s] ease-[var(--default-transition-timing-function)] cursor-pointer hover:shadow-lg overflow-hidden relative min-w-[280px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Running Now</p>
                <h3 className="text-3xl font-bold text-green-600">{runningStories}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Teams Section */}
        <div className="mb-6">
          <h2>Teams</h2>
          <p>Select a team to view test pipelines and execution details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}
