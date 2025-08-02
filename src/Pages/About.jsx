import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Heart, MapPin, Mail, Phone } from "lucide-react";

export default function About() {
  const stats = [
    { number: "1M+", label: "Job Seekers", icon: Users },
    { number: "50K+", label: "Active Jobs", icon: Target },
    { number: "10K+", label: "Companies", icon: Award },
    { number: "95%", label: "Success Rate", icon: Heart },
  ];

  const team = [
    {
      name: "Priya Sharma",
      role: "CEO & Founder",
      location: "Mumbai",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Former HR Director at TCS with 15+ years in talent acquisition",
    },
    {
      name: "Rahul Gupta",
      role: "CTO",
      location: "Bangalore",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Ex-Infosys engineer, passionate about connecting talent with opportunities",
    },
    {
      name: "Anita Patel",
      role: "Head of Operations",
      location: "Pune",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Operations expert ensuring smooth platform experience for all users",
    },
  ];

  const values = [
    {
      title: "Transparency",
      description: "Clear job descriptions, honest salary ranges, and transparent hiring processes for all.",
      icon: "/transparency.png",
    },
    {
      title: "Diversity",
      description: "Equal opportunities for all candidates regardless of background, promoting inclusive hiring.",
      icon: "/diversity.png",
    },
    {
      title: "Excellence",
      description: "Connecting top talent with leading companies to drive mutual success and growth.",
      icon: "/excellence.png",
    },
    {
      title: "Innovation",
      description: "Using cutting-edge technology to revolutionize job search and recruitment in India.",
      icon: "/innovation.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About CareerNest</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            CareerNest is a global go-to platform for internships and volunteer opportunities, connecting students and
            professionals with startups, NGOs, and companies. Backed by Suvidha Foundation since 2020, we offer remote
            and on-site roles to ensure equal access to skill-building experiences across the country.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To democratize access to career opportunities across world-wide by creating a transparent, efficient,
                and user-friendly platform that benefits both job seekers and employers.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We believe every talented individual deserves the chance to find meaningful work, and every company
                should have access to the best talent, regardless of their location or background.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Founded</h4>
                  <p className="text-blue-700">2020</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">Headquarters</h4>
                  <p className="text-green-700">Mumbai, India</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <img src={value.icon} alt={`${value.title} icon`} className="w-16 h-16 object-contain" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The passionate professionals behind CareerNest</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                  <div className="flex items-center justify-center mb-3">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-gray-500 text-sm">{member.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-blue-100">Have questions? We'd love to hear from you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16  bg-blue-100  rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-blue-100">support@careernest.in</p>
              <p className="text-blue-100">careers@careernest.in</p>
            </div>

            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-blue-100">+91 9876543210</p>
              <p className="text-blue-100 text-sm">Mon-Fri, 9AM-6PM IST</p>
            </div>

            <div>
              <div className="w-16 h-16  bg-blue-100  rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-blue-100">123 Business District</p>
              <p className="text-blue-100">Mumbai, Maharashtra 400001</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
