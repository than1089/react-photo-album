import React, { useEffect } from 'react';
import { RootState } from '../../app/store';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPhotos, selectPhoto } from './photosSlide';
import styles from './Photos.module.css';


export function Photos() {
  const dispatch = useDispatch();
  const photos = useSelector((state:RootState) => state.photos);

  useEffect(() => {
    dispatch(fetchPhotos(0, photos.size, true));
  }, [dispatch, photos.size]);

  const loadMore = () => {
    dispatch(fetchPhotos(photos.total, photos.size, false));
  };

  const getSelectedClass = (photoId: string) => {
    if (photos.selectedIds.indexOf(photoId) !== -1) {
      return ` ${styles.selectedPhoto}`;
    }
    return '';
  }

  return (
    <div className="container">
      <div className={styles.photos}>
        {Object.values(photos.photosById).map(photo => 
          <div key={photo.id}
            className={styles.photo + getSelectedClass(photo.id)}
            onClick={() => dispatch(selectPhoto(photo.id))}>
            <div className={styles.photoHolder}>
              <img src={photo.raw} alt={photo.name} />
            </div>
            <div className={styles.photoName}><span>{photo.name}</span></div>
            <small>{photo.album}</small>
          </div>  
        )}
      </div>
      {!photos.isLastPage && !photos.isLoading &&
        <div className="load-more text-center">
          <button className="load-more-btn" onClick={loadMore}>Load More</button>
        </div>
      }
      {photos.isLoading &&
        <div className="text-center">
          <img src={process.env.PUBLIC_URL + '/loading.gif'} width="50" alt="loading" />
        </div>
      }
    </div>
  );
}