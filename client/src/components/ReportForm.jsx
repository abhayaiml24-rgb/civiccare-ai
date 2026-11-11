import { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ReportForm({ onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', location: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${API}/complaints`, form);
      setResult(data);
      setForm({ title: '', description: '', location: '' });
      onCreated();
    } catch (err) {
      setError('Could not submit. Please fill all fields.');
    }
    setLoading(false);
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Report a Problem</h5>
        <form onSubmit={submit}>
          <input
            className="form-control mb-2"
            name="title"
            placeholder="Title (e.g. Broken streetlight)"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            className="form-control mb-2"
            name="description"
            placeholder="Describe the problem"
            rows="3"
            value={form.description}
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-2"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'AI is analysing...' : 'Submit Report'}
          </button>
        </form>

        {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}

        {result && (
          <div className="alert alert-success mt-3 mb-0">
            <b>AI Result</b>
            <div>Category: {result.category}</div>
            <div>Priority: {result.priority}</div>
            <div>Summary: {result.aiSummary}</div>
          </div>
        )}
      </div>
    </div>
  );
}