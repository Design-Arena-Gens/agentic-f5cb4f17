'use client'

import { useState, useEffect } from 'react'

interface SurrenderRequest {
  id: string
  policyNumber: string
  formNumber: string
  status: 'Pending' | 'Processing' | 'Completed' | 'Rejected'
  typeOfRequest: string
  requirements: string
  docsReceived: string
  processingDate: string
}

export default function Home() {
  const [requests, setRequests] = useState<SurrenderRequest[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    policyNumber: '',
    formNumber: '',
    status: 'Pending' as const,
    typeOfRequest: '',
    requirements: '',
    docsReceived: '',
    processingDate: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('surrenderRequests')
    if (saved) {
      setRequests(JSON.parse(saved))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newRequest: SurrenderRequest = {
      id: Date.now().toString(),
      ...formData
    }

    const updatedRequests = [...requests, newRequest]
    setRequests(updatedRequests)
    localStorage.setItem('surrenderRequests', JSON.stringify(updatedRequests))

    setFormData({
      policyNumber: '',
      formNumber: '',
      status: 'Pending',
      typeOfRequest: '',
      requirements: '',
      docsReceived: '',
      processingDate: ''
    })

    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const getStatusClass = (status: string) => {
    return `status-badge status-${status.toLowerCase()}`
  }

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    processing: requests.filter(r => r.status === 'Processing').length,
    completed: requests.filter(r => r.status === 'Completed').length
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Policy Surrender Management</h1>
        <p>Track and manage policy surrender requests</p>
      </div>

      <div className="main-content">
        <div className="card">
          <h2>New Surrender Request</h2>
          {showSuccess && (
            <div className="success-message">
              Request submitted successfully!
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="policyNumber">Policy Number *</label>
              <input
                type="text"
                id="policyNumber"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="formNumber">Form Number *</label>
              <input
                type="text"
                id="formNumber"
                name="formNumber"
                value={formData.formNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="typeOfRequest">Type of Request *</label>
              <input
                type="text"
                id="typeOfRequest"
                name="typeOfRequest"
                value={formData.typeOfRequest}
                onChange={handleChange}
                placeholder="e.g., Full Surrender, Partial Surrender"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="requirements">Requirements</label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="List required documents and conditions"
              />
            </div>

            <div className="form-group">
              <label htmlFor="docsReceived">Documents Received</label>
              <textarea
                id="docsReceived"
                name="docsReceived"
                value={formData.docsReceived}
                onChange={handleChange}
                placeholder="List documents received"
              />
            </div>

            <div className="form-group">
              <label htmlFor="processingDate">Processing Date *</label>
              <input
                type="date"
                id="processingDate"
                name="processingDate"
                value={formData.processingDate}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn">
              Submit Request
            </button>
          </form>
        </div>

        <div className="dashboard-card">
          <h2>Dashboard Report</h2>

          <div className="stats-grid">
            <div className="stat-box">
              <h3>{stats.total}</h3>
              <p>Total Requests</p>
            </div>
            <div className="stat-box">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
            <div className="stat-box">
              <h3>{stats.processing}</h3>
              <p>Processing</p>
            </div>
            <div className="stat-box">
              <h3>{stats.completed}</h3>
              <p>Completed</p>
            </div>
          </div>

          <div className="table-container">
            {requests.length === 0 ? (
              <div className="empty-state">
                <p>No surrender requests yet. Submit your first request using the form.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Policy #</th>
                    <th>Form #</th>
                    <th>Status</th>
                    <th>Type</th>
                    <th>Processing Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.policyNumber}</td>
                      <td>{request.formNumber}</td>
                      <td>
                        <span className={getStatusClass(request.status)}>
                          {request.status}
                        </span>
                      </td>
                      <td>{request.typeOfRequest}</td>
                      <td>{request.processingDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
