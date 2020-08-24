import React, { useMemo, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPhotos } from './uploadSlide';
import styles from './UploadModal.module.css';
import { RootState } from '../../app/store';

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

interface Props {
  onClose: () => void
}

const albums = ['Travel', 'Personal', 'Food', 'Nature', 'Other'];

export function UploadModal(props: Props) {
  const dispatch = useDispatch();
  const [files, setFiles] = useState<File[]>([]);
  const [album, setAlbum] = useState('');
  const [uploaded, setUploaded] = useState(false);

  const upload = useSelector((state: RootState) => state.upload);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({accept: 'image/*', onDrop: onDrop});

  const style = useMemo(() => ({
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  const removeFile = (index: number) => {
    const newFiles = files.slice();
    newFiles.splice(index, 1);
    setFiles(newFiles);
  }

  useEffect(() => {
    if (!upload.isUploading && upload.percentage === 100) {
      setUploaded(true);
      setFiles([]);
    }
  }, [upload.isUploading, upload.percentage])

  return (
    <div>
      <div className={styles.modalOverlay}></div>
      <div className={styles.modalContent}>        
        <div className={styles.modalHeader}>
          <h3>Upload Photos</h3> 
          <a href="#!" onClick={props.onClose}>X</a>
        </div>
        <div {...getRootProps({style})} className={styles.dropzone}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <div>
          {!files.length && !uploaded &&
            <p className="text-center">No files selected...</p>
          }
          {!files.length && uploaded &&
            <p className="text-center">Uploaded successfully.</p>
          }
          {!!files.length &&
            <ul>
              {files.map((file, index) => 
                <li key={index}>
                  <span>{file.name}</span>
                  <a href="#!" onClick={() => removeFile(index)} className={styles.removeFile}>X</a>
                </li>
              )}
            </ul>
          }
          {upload.isUploading &&
            <div className={styles.progress}>
              <div className={styles.percentage} style={{width: `${upload.percentage}%`}}></div>
            </div>
          }
        </div>
        <div className={styles.modalFooter}>
          <select name="album" onChange={(e) => setAlbum(e.target.value)}>
            <option value="">Select Album</option>
            {albums.map(album => 
              <option value={album} key={album}>{album}</option>
            )}
          </select>
          <button onClick={() => dispatch(uploadPhotos(files, album))}
            className={styles.button} disabled={!album || !files.length}>
            <img src={process.env.PUBLIC_URL + '/upload-icon.png'} width="15" alt="Upload Icon"/> Upload
          </button>
        </div>
      </div>
    </div>
  );
}