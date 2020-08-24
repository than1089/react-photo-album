import axios from 'axios';
import { setUploadPercentage } from '../features/photos/uploadSlide';
import { Dispatch } from 'react';

const backendURL = process.env.REACT_APP_BACKEND_URL || 'https://tn-album-backend.herokuapp.com';

export interface Photo {
  id: string;
  album: string;
  name: string;
  path: string;
  raw: string;
}
export interface PhotoListResult {
  message: string;
  documents: Photo[],
  count: number;
  skip: number;
  limit: number;
}

async function healCheck() {
  const { data } = await axios.get(`${backendURL}/health`);
  return data;
}

async function getPhotos(skip = 0, limit = 5): Promise<PhotoListResult> {
  const { data } = await axios.post(`${backendURL}/photos/list`, {skip, limit});
  return data;
}

async function deletePhotos(selectedIds: string[], photosById: Record<string, Photo>): Promise<any> {
  const deletingPhotos = Object.values(photosById).filter(photo => selectedIds.indexOf(photo.id) !== -1);
  const data:Record<string, string[]> = {};
  deletingPhotos.forEach(photo => {
    if (!data[photo.album]) {
      data[photo.album] = [photo.name];
    } else {
      data[photo.album].push(photo.name);
    }
  });
  const body = Object.entries(data).map(item => ({album: item[0], documents: item[1].join(', ')}));
  const response = await fetch(`${backendURL}/photos`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return response;
}

async function uploadPhotos(photos: File[], album: string, dispatch: Dispatch<any>): Promise<any> {
  const formData = new FormData();
  photos.forEach(file => {
    formData.append('documents', file);
  });
  formData.append('album', album);
  return await axios.put(`${backendURL}/photos`, formData, {
    onUploadProgress: (progressEvent: ProgressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      dispatch(setUploadPercentage(percentCompleted));
    }
  });
}

export default {healCheck, getPhotos, uploadPhotos, deletePhotos};