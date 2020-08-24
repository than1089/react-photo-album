import React, { useState, useEffect } from 'react';
import './App.css';
import { UploadModal } from './features/photos/UploadModal';
import { Photos } from './features/photos/Photos';
import { setPageSize, deletePhotos } from './features/photos/photosSlide';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './app/store';
import { healCheck } from './features/healthcheck/healcheckSlide';

function App() {
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(healCheck());
  }, [dispatch]);

  const photos = useSelector((state: RootState) => state.photos);
  const health = useSelector((state: RootState) => state.health);

  const changePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPageSize(Number(e.target.value)));
  }

  const handleDeletePhotos = () => {
    const ok = window.confirm('Are you sure you want to delete the selected photos?');
    if (ok) {
      dispatch(deletePhotos(photos.selectedIds, photos.photosById));
    }
  }

  return (
    <div className="app">
      {health.ok &&
        <>
        <header className="app-header">
          <h1>Photos</h1>
          <div className="actions">
            {!!photos.selectedIds.length &&
              <>
                <a href="#!" onClick={handleDeletePhotos}>
                  <button>Delete {photos.selectedIds.length} photos</button>
                </a>
                <span>|</span>
              </>
            }
            <a href="#!" onClick={() => setShowModal(true)}>
              <img src={process.env.PUBLIC_URL + '/upload-icon.png'} width="20" alt="Upload"/>
            </a>
            <span>|</span>
            <select onChange={changePageSize} value={photos.size} title="Page Size">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </header>
        {showModal &&
          <UploadModal onClose={() => setShowModal(false)}/>
        }
        <Photos/>
        </>
      }
      {!health.ok &&
        <h2 className="text-center">Something went wrong! Please try again later!</h2>
      }
    </div>
  );
}

export default App;
