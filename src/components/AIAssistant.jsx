import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Loader } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    "Where is the ISS?",
    "Explain today's space weather.",
    "Are any asteroids dangerous?",
    "What is today's NASA image?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const askQuestion = async (question) => {
    const userMsg = { id: Date.now(), role: 'user', text: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE || '';
      const res = await fetch(`${baseUrl}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      
      if (!res.ok) throw new Error('Ask API failed');
      const data = await res.json();
      
      const botMsg = { id: Date.now() + 1, role: 'assistant', text: data.answer };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const errorMsg = { id: Date.now() + 1, role: 'assistant', text: 'I apologize, I could not process your question at this time.' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      askQuestion(input.trim());
    }
  };

  return (
    <div>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
          border: 'none',
          color: '#000',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(34, 211, 238, 0.4)',
          zIndex: 100,
          fontSize: 24
        }}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 99
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{
                position: 'fixed',
                bottom: 100,
                right: 32,
                width: 380,
                maxWidth: '90vw',
                height: 500,
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'column',
                zIndex: 100,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Header */}
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(34, 211, 238, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ color: '#f8fafc', margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 600 }}>
                    🚀 Space Assistant
                  </h3>
                  <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.75rem' }}>Powered by Gemini</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div style={{
                flex: 1,
                overflow: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                {messages.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem' }}>🌌</div>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Ask me anything about space!</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', marginTop: 8 }}>
                      {quickQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => askQuestion(q)}
                          style={{
                            padding: '8px 12px',
                            background: 'rgba(34, 211, 238, 0.1)',
                            border: '1px solid rgba(34, 211, 238, 0.2)',
                            borderRadius: 6,
                            color: '#22d3ee',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(34, 211, 238, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(34, 211, 238, 0.1)';
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '80%',
                          padding: '10px 12px',
                          borderRadius: 10,
                          background: msg.role === 'user'
                            ? 'rgba(34, 211, 238, 0.15)'
                            : 'rgba(148, 163, 184, 0.05)',
                          color: '#f8fafc',
                          fontSize: '0.9rem',
                          lineHeight: 1.4,
                          border: `1px solid ${msg.role === 'user' ? 'rgba(34, 211, 238, 0.3)' : 'rgba(148, 163, 184, 0.2)'}`
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: 'rgba(148, 163, 184, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: '#94a3b8'
                    }}>
                      <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid rgba(34, 211, 238, 0.1)',
                display: 'flex',
                gap: 8
              }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !loading) handleSend();
                  }}
                  placeholder="Ask about space..."
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(34, 211, 238, 0.2)',
                    borderRadius: 6,
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(34, 211, 238, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(34, 211, 238, 0.2)';
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(34, 211, 238, 0.2)',
                    border: '1px solid rgba(34, 211, 238, 0.3)',
                    borderRadius: 6,
                    color: '#22d3ee',
                    cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    opacity: loading || !input.trim() ? 0.5 : 1
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;
