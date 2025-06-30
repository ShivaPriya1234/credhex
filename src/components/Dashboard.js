import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Aurora from './Aurora';
import { Document, Page, pdfjs } from 'react-pdf';
import './Dashboard.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function Dashboard({ session, onLogout }) {
  const [certificates, setCertificates] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pdfInfo, setPdfInfo] = useState({});

  const fetchCertificates = async () => {
    const { data, error } = await supabase.storage
      .from('certificates')
      .list(`${session.user.id}/`, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'desc' },
      });

    if (!error) setCertificates(data || []);
  };

  const getFileMeta = async (url, name) => {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      const size = res.headers.get('content-length');
      setPdfInfo((prev) => ({
        ...prev,
        [name]: {
          ...(prev[name] || {}),
          size: size ? (Number(size) / 1024).toFixed(1) + ' kB' : 'Unknown size',
        },
      }));
    } catch (err) {
      console.warn('Size fetch error for', name);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleUpload = async () => {
    if (!file || !session?.user?.id) return;
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;

    const { error } = await supabase.storage
      .from('certificates')
      .upload(filePath, file);

    if (!error) {
      setTimeout(fetchCertificates, 1000); // wait for file to become available
    }

    setFile(null);
    setUploading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="dashboard-page">
      <Aurora />
      <div className="dashboard-container">
        <h1>Welcome to CredHex Vault 🔒</h1>

        <div className="upload-container">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Certificate'}
          </button>
        </div>

        <h3>Your Uploaded Certificates</h3>
        <div className="cert-list">
          {certificates.length === 0 ? (
            <p className="empty-list">No certificates uploaded yet.</p>
          ) : (
            certificates.map((cert) => {
              const publicUrl = supabase.storage
                .from('certificates')
                .getPublicUrl(`${session.user.id}/${cert.name}`).data.publicUrl;

              if (!pdfInfo[cert.name]) getFileMeta(publicUrl, cert.name);

              return (
                <div className="cert-preview-box" key={cert.name}>
                  <div className="pdf-thumb">
                    <Document
                      file={publicUrl}
                      renderMode="svg"
                      onLoadSuccess={({ numPages }) =>
                        setPdfInfo((prev) => ({
                          ...prev,
                          [cert.name]: {
                            ...(prev[cert.name] || {}),
                            pages: numPages,
                          },
                        }))
                      }
                      onLoadError={(error) =>
                        console.warn('PDF load error:', error.message)
                      }
                    >
                      <Page pageNumber={1} width={100} />
                    </Document>
                  </div>

                  <div className="cert-details">
                    <p className="file-name">{cert.name}</p>
                    <p className="meta-info">
                      📄 {pdfInfo[cert.name]?.pages || '...'} page
                      &nbsp;&nbsp;•&nbsp;&nbsp;
                      {pdfInfo[cert.name]?.size || '...'}
                    </p>
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-link"
                    >
                      View Full Certificate
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
