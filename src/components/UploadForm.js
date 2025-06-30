import React, { useState } from 'react';
import { supabase } from '../supabase';
import './UploadForm.css';

function UploadForm({ user, onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('certificates').getPublicUrl(filePath);

    await supabase.from('certificates').insert([
      {
        user_id: user.id,
        name: file.name,
        url: data.publicUrl,
      },
    ]);

    setFile(null);
    setUploading(false);
    onUpload();
  };

  return (
    <div className="upload-container">
      <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Certificate'}
      </button>
    </div>
  );
}

export default UploadForm;
