import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, Shield, Sparkles, Lock, Share2 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-purple-400" />
          <h1 className="text-xl font-bold text-white">MysteryMSG</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/sign-in">
            <Button variant="outline" className="bg-gray-900 border-purple-950 text-white hover:bg-purple-800">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Share Your Link, Get <span className="text-purple-400">Anonymous</span> Messages
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            MysteryMSG lets you receive honest feedback and messages without revealing the sender's identity.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white">
                Get Started
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="bg-gray-900 border-purple-400 text-white hover:bg-purple-800">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Message Preview */}
      <section className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto bg-slate-800/50 border border-purple-500/30 backdrop-blur-sm rounded-xl overflow-hidden">
          <div className="p-4 border-b border-purple-500/20">
            <h3 className="text-lg font-semibold text-white">Anonymous Messages</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-300">
                Your presentation today was amazing! You have such a talent for explaining complex topics.
              </p>
              <p className="text-sm text-purple-400 mt-2">10 minutes ago</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-300">
                I've always admired your creativity and positive attitude. You inspire me to be better!
              </p>
              <p className="text-sm text-purple-400 mt-2">2 hours ago</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="container mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-12">How MysteryMSG Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-slate-800/50 border border-purple-500/30 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-purple-900 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Create Your Profile</h3>
            <p className="text-slate-300">Sign up for a MysteryMSG account and get your unique link in seconds.</p>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-purple-900 flex items-center justify-center mb-4">
              <Share2 className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Share Your Link</h3>
            <p className="text-slate-300">Share your unique MysteryMSG link on social media or with friends.</p>
          </div>

          <div className="bg-slate-800/50 border border-purple-500/30 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-purple-900 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Receive Messages</h3>
            <p className="text-slate-300">Get anonymous messages and honest feedback from anyone.</p>
          </div>
        </div>
      </section>

      {/* AI Feature Section */}
      <section className="container mx-auto py-16 px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-white">AI Message Suggestions</h2>
              </div>
              <p className="text-lg text-slate-300">
                Not sure what to ask? Our AI generates personalized message suggestions to help break the ice.
              </p>
              <div className="flex items-center gap-3 bg-purple-900/50 p-4 rounded-lg">
                <Lock className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <p className="text-slate-300">All messages are encrypted and your privacy is always protected.</p>
              </div>
            </div>
            <div className="md:w-1/2 bg-slate-800/50 border border-purple-500/30 backdrop-blur-sm rounded-xl p-4">
              <div className="space-y-3">
                <div className="bg-slate-900 rounded-lg p-3 text-slate-300">What's your favorite movie?</div>
                <div className="bg-slate-900 rounded-lg p-3 text-slate-300">
                  If you could travel anywhere, where would you go?
                </div>
                <div className="bg-slate-900 rounded-lg p-3 text-slate-300">
                  What's something you're proud of that you accomplished recently?
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">MysteryMSG</h2>
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link href="/privacy" className="text-slate-300 hover:text-purple-400">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-300 hover:text-purple-400">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-slate-300 hover:text-purple-400">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-slate-400">
            <p>© {new Date().getFullYear()} MysteryMSG [Koshik Mehta]. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
