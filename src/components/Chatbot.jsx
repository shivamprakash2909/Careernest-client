// src/Components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false); // Start closed
  const [isVisible, setIsVisible] = useState(false); // Check if user is logged in as student
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hi! What are you looking for?",
      options: ["Post Internship", "Browse Internships", "Build Resume"],
    },
  ]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState("select-option");

  const [resumeData, setResumeData] = useState({
    name: "",
    contact: "",
    otp: "",
    email: "",
    skills: "",
    education: "",
    experience: "",
  });
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Check if user is logged in as student
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const jwt = localStorage.getItem("jwt");
    setIsVisible(jwt && user.role === "student");
  }, []);

  const resumeQuestions = [
    { key: "email", question: "What's your email address?" },
    { key: "skills", question: "List your skills (comma separated):" },
    { key: "education", question: "Tell me about your education background." },
    { key: "experience", question: "Add your work/internship experience." },
  ];

  const validateInput = (key, value) => {
    switch (key) {
      case "name":
        return /^[A-Za-z\s]{3,50}$/.test(value.trim()) || "Enter a valid full name (only letters, min 3 characters).";
      case "contact":
        return /^[0-9]{10}$/.test(value.trim()) || "Enter valid 10-digit contact number.";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || "Enter valid email.";
      case "skills":
        return value.trim().length > 0 || "Add at least one skill.";
      case "education":
        return value.trim().length >= 10 || "Add more education detail.";
      case "experience":
        return value.trim().length >= 10 || "Add more experience detail.";
      default:
        return true;
    }
  };

  const handleOptionSelect = (option) => {
    if (option === "Build Resume") {
      setStage("name");
      setMessages((prev) => [...prev, { from: "user", text: option }, { from: "bot", text: "Enter your full name:" }]);
    } else if (option === "Browse Internships") {
      setMessages((prev) => [...prev, { from: "user", text: option }]);
      setTimeout(() => navigate("/p/internships"), 500);
    } else if (option === "Post Internship") {
      setMessages((prev) => [...prev, { from: "user", text: option }]);
      setTimeout(() => navigate("/p/recruiterauth"), 500);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    if (stage === "name") {
      const valid = validateInput("name", input);
      if (valid !== true) return botMsg(valid);
      setResumeData((prev) => ({ ...prev, name: input }));
      setStage("contact");
      return botMsg("Enter your 10-digit contact number:");
    }

    if (stage === "contact") {
      const valid = validateInput("contact", input);
      if (valid !== true) return botMsg(valid);
      setResumeData((prev) => ({ ...prev, contact: input }));
      setStage("otp");
      return botMsg("Enter OTP sent to your number (simulate: 1234):");
    }

    if (stage === "otp") {
      if (input !== "1234") return botMsg("❌ Invalid OTP. Try again (hint: 1234)");
      setStage("resume-form");
      setCurrentStep(0);
      return botMsg(resumeQuestions[0].question);
    }

    if (stage === "resume-form") {
      const stepKey = resumeQuestions[currentStep].key;
      const valid = validateInput(stepKey, input);
      if (valid !== true) return botMsg(valid);

      setResumeData((prev) => ({ ...prev, [stepKey]: input }));
      const next = currentStep + 1;

      if (next < resumeQuestions.length) {
        setCurrentStep(next);
        return botMsg(resumeQuestions[next].question);
      } else {
        setStage("complete");
        return botMsg("✅ Resume complete! Click below to download.");
      }
    }

    setInput("");
  };

  const botMsg = (text) => {
    setMessages((prev) => [...prev, { from: "bot", text }]);
    setInput("");
  };

  const downloadResume = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Resume", 20, 20);
    Object.entries(resumeData).forEach(([key, value], i) => {
      if (key !== "otp") doc.text(`${key.toUpperCase()}: ${value}`, 20, 30 + i * 10);
    });
    doc.save("CareerNest_Resume.pdf");
  };

  // Don't render if user is not logged in as student
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chatbot Icon Button with Tooltip */}
      {!isOpen && (
        <div className="relative group">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 transform hover:scale-110"
            aria-label="Open chatbot"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Click me for help!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white border rounded-lg shadow-xl flex flex-col w-80 sm:w-96 max-h-96">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 font-bold text-sm rounded-t-lg flex justify-between items-center">
            <span>CareerNest Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chatbot"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-3 h-64 overflow-y-auto text-sm space-y-2 flex-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md max-w-[90%] ${
                  msg.from === "user" ? "bg-blue-100 text-right ml-auto" : "bg-gray-100 text-left"
                }`}
              >
                {msg.text}
                {msg.options && (
                  <div className="mt-2 space-y-1">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left text-blue-600 border border-blue-500 px-2 py-1 rounded text-xs hover:bg-blue-50 transition-colors"
                        onClick={() => handleOptionSelect(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {stage === "complete" && (
              <button
                onClick={downloadResume}
                className="mt-3 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
              >
                📄 Download Resume as PDF
              </button>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          {stage !== "select-option" && stage !== "complete" && (
            <div className="flex border-t">
              <input
                type="text"
                className="flex-grow px-3 py-2 text-sm border-r focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="bg-blue-600 text-white px-4 text-sm hover:bg-blue-700 transition-colors"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
