import React from "react";
import { Calendar, Users, Trophy, Clock, MapPin } from "lucide-react";

export default function Hackathons() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hackathons</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover exciting hackathons and coding competitions to showcase your skills and win amazing prizes.
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
            <p className="text-lg text-gray-600 mb-8">
              We're working hard to bring you an amazing hackathon experience. Stay tuned for exciting competitions,
              real-world challenges, and opportunities to connect with top tech companies.
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Events</h3>
              <p className="text-gray-600 text-sm">
                Browse through upcoming hackathons and register for the ones that interest you.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Formation</h3>
              <p className="text-gray-600 text-sm">
                Find teammates or join existing teams to collaborate on innovative projects.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prizes & Recognition</h3>
              <p className="text-gray-600 text-sm">
                Win cash prizes, internships, and recognition from top companies and organizations.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600 text-sm">
                Get live updates on hackathon progress, deadlines, and important announcements.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Virtual & In-Person</h3>
              <p className="text-gray-600 text-sm">
                Participate in both virtual and in-person hackathons from anywhere in the world.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Skill Development</h3>
              <p className="text-gray-600 text-sm">
                Enhance your technical skills, problem-solving abilities, and teamwork experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
