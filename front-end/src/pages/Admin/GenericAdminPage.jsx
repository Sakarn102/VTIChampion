import React from 'react';
import '../../styles/Admin.css';

const GenericAdminPage = ({ title }) => {
  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">{title}</h1>
      </div>
      <div className="admin-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
          <h2 style={{ fontSize: '20px', color: '#64748b', margin: 0 }}>Tính năng {title} đang được phát triển</h2>
          <p style={{ marginTop: '8px' }}>Giao diện này dùng chung phong cách. Bạn có thể xây dựng dựa theo module Users.</p>
        </div>
      </div>
    </>
  );
};

export default GenericAdminPage;
