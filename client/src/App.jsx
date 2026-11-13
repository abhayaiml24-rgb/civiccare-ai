import { useState, useEffect } from 'react';
import axios from 'axios';
import ReportForm from './components/ReportForm';
import Chatbot from './components/Chatbot';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CATEGORIES = ['Electricity', 'Water', 'Roads', 'Sanitation', 'Safety', 'Other'];
const STATUSES = ['Pending', 'In Progress', 'Resolved'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const priorityColor = { High: 'danger', Medium: 'warning', Low: 'success' };
const statusColor = { Pending: 'secondary', 'In Progress': 'primary', Resolved: 'success' };

export default function App() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ Total: 0, Pending: 0, 'In Progress': 0, Resolved: 0 });
  const [filters, setFilters] = useState({ category: '', status: '', priority: '' });
  const [adminKey, setAdminKey] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const loadData = async () => {
    const list = await axios.get(`${API}/complaints`, { params: filters });
    const st = await axios.get(`${API}/complaints/stats`);
    setComplaints(list.data);
    setStats(st.data);
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleFilter = e => setFilters({ ...filters, [e.target.name]: e.target.value });

  const adminHeaders = { headers: { 'x-admin-key': adminKey } };

  const handleAuthError = err => {
    if (err.response && err.response.status === 403) {
      alert('Wrong admin key');
      setIsAdmin(false);
    }
  };

  // verifies the key with the server before turning admin mode on
  const enterAdminMode = async () => {
    if (!adminKey) return;
    try {
      await axios.get(`${API}/complaints/admin-check`, adminHeaders);
      setIsAdmin(true);
    } catch (err) {
      alert('Wrong admin key');
      setAdminKey('');
    }
  };

  const exitAdminMode = () => {
    setIsAdmin(false);
    setAdminKey('');
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/complaints/${id}`, { status }, adminHeaders);
      loadData();
    } catch (err) {
      handleAuthError(err);
    }
  };

  const deleteComplaint = async id => {
    if (!window.confirm('Delete this complaint?')) return;
    try {
      await axios.delete(`${API}/complaints/${id}`, adminHeaders);
      loadData();
    } catch (err) {
      handleAuthError(err);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand mb-0 h1">🚨 CivicCare AI</span>
          {isAdmin ? (
            <button className="btn btn-outline-light btn-sm" onClick={exitAdminMode}>
              Exit Admin Mode
            </button>
          ) : (
            <div className="d-flex gap-2">
              <input
                type="password"
                className="form-control form-control-sm"
                placeholder="Admin key"
                value={adminKey}
                onChange={e => setAdminKey(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && enterAdminMode()}
              />
              <button className="btn btn-light btn-sm text-nowrap" onClick={enterAdminMode}>
                Admin Mode
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="container">
        <div className="row">
          {/* Left column */}
          <div className="col-lg-4">
            <ReportForm onCreated={loadData} />
            <Chatbot />
          </div>

          {/* Right column */}
          <div className="col-lg-8">
            <div className="row mb-3">
              {Object.entries(stats).map(([label, count]) => (
                <div className="col-6 col-md-3 mb-2" key={label}>
                  <div className="card text-center">
                    <div className="card-body py-3">
                      <h4 className="mb-0">{count}</h4>
                      <small className="text-muted">{label}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row mb-3">
              <div className="col-md-4 mb-2">
                <select className="form-select" name="category" value={filters.category} onChange={handleFilter}>
                  <option value="">All categories</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-md-4 mb-2">
                <select className="form-select" name="status" value={filters.status} onChange={handleFilter}>
                  <option value="">All statuses</option>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-4 mb-2">
                <select className="form-select" name="priority" value={filters.priority} onChange={handleFilter}>
                  <option value="">All priorities</option>
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {complaints.length === 0 && <p className="text-muted">No complaints found.</p>}

            {complaints.map(c => (
              <div className="card mb-3" key={c._id}>
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5 className="card-title">{c.title}</h5>
                    <div>
                      <span className={`badge bg-${priorityColor[c.priority]} me-1`}>{c.priority}</span>
                      <span className={`badge bg-${statusColor[c.status]}`}>{c.status}</span>
                    </div>
                  </div>
                  <p className="mb-1">{c.description}</p>
                  <small className="text-muted">
                    📍 {c.location} | 🏷️ {c.category}
                  </small>
                  {c.aiSummary && (
                    <div className="alert alert-info py-1 mt-2 mb-0">
                      <small>🤖 {c.aiSummary}</small>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="d-flex gap-2 mt-3">
                      <select
                        className="form-select form-select-sm w-auto"
                        value={c.status}
                        onChange={e => updateStatus(c._id, e.target.value)}
                      >
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => deleteComplaint(c._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}