import React from 'react';
import { useNavigate } from 'react-router-dom';

function BlockedUser() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-danger">
            <div className="card-header bg-danger text-white">
              <h3 className="text-center mb-0">Account Blocked</h3>
            </div>
            <div className="card-body text-center">
              <div className="mb-4">
                <i className="fas fa-ban text-danger" style={{ fontSize: '4rem' }}></i>
              </div>
              <h4 className="card-title mb-4">Access Denied</h4>
              <p className="card-text mb-4">
                Your account has been blocked by the administrator. Please contact the admin for further assistance.
              </p>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/')}
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlockedUser; 