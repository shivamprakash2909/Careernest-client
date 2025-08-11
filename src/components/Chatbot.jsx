import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState({ query: '', contact: '', email: '' });
  const [conversationStep, setConversationStep] = useState();
  const [showOptions, setShowOptions] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([{ sender: 'bot', text: 'Hi! Welcome to CareerNest. Please choose an option below:' }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOptionClick = (option) => {
    let redirectUrl = '/';
    switch (option) {
      case 'internship':
        redirectUrl = '/p/internships';
        break;
      case 'job':
        redirectUrl = '/p/jobs';
        break;
      case 'careernest':
        redirectUrl = '/p/about';
        break;
      case 'faq':
        redirectUrl = '/p/faq';
        break;
      case 'contact':
        redirectUrl = '/p/contact';
        break;
      default:
        redirectUrl = '/';
    }
    window.location.href = redirectUrl;
  };

  const handleSend = async (userText) => {
    if (!userText.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    let botMessage = '';

    if (conversationStep === 1) {
      const lowerText = userText.toLowerCase();

      if (lowerText.includes('internship') || lowerText.includes('browse')) {
        botMessage = 'Sure! You can explore internships here: <a href="/internships" class="chat-link">Go to Internships</a>';
        setConversationStep(1);
      } else if (lowerText.includes('help') || lowerText.includes('support')) {
        botMessage = 'Our support team is here for you. Please share your contact number.';
        setConversationStep(2);
      } else {
        setUserInfo((prev) => ({ ...prev, query: userText }));
        botMessage = 'Thanks! Can you please provide your contact number?';
        setConversationStep(2);
      }
    } else if (conversationStep === 2) {
      setUserInfo((prev) => ({ ...prev, contact: userText }));
      botMessage = 'Great! Now please provide your email address.';
      setConversationStep(3);
    } else if (conversationStep === 3) {
      setUserInfo((prev) => ({ ...prev, email: userText }));
      botMessage = 'Thank you! Our team will reach out to you shortly.';
      setConversationStep(4);

      // Send to backend
      await fetch('', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userInfo, email: userText }),
      });
    } else {
      botMessage = 'Thanks for reaching out! Can you please tell me how I can help you today?';
      setConversationStep(1);
    }

    setMessages((prev) => [...prev, { sender: 'bot', text: botMessage }]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">CareerNest Assistant</div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {showOptions && (
        <div className="chatbot-options">
          <button onClick={() => handleOptionClick('internship')}>1️⃣ Looking for Internship</button>
          <button onClick={() => handleOptionClick('job')}>2️⃣ Looking for Job</button>
          <button onClick={() => handleOptionClick('careernest')}>3️⃣ What is CareerNest</button>
          <button onClick={() => handleOptionClick('faq')}>4️⃣ Find Answer to Queries</button>
          <button onClick={() => handleOptionClick('contact')}>4️⃣ Contact Us</button>
        </div>
      )}
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default Chatbot;
