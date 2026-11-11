import { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! Ask me how to report a problem.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const question = input;
    setMessages(prev => [...prev, { from: 'user', text: question }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/chat`, { message: question });
      setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, something went wrong.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="card-header">AI Assistant</div>
      <div className="card-body" style={{ height: '250px', overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.from === 'user' ? 'text-end' : ''}`}>
            <span className={`badge ${m.from === 'user' ? 'bg-primary' : 'bg-secondary'} text-wrap text-start`}>
              {m.text}
            </span>
          </div>
        ))}
        {loading && <div className="text-muted">Typing...</div>}
      </div>
      <div className="card-footer d-flex gap-2">
        <input
          className="form-control"
          placeholder="e.g. How do I report a water leak?"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button className="btn btn-dark" onClick={send}>Send</button>
      </div>
    </div>
  );
}