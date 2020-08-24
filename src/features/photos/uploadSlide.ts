import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../app/store';
import photoAPI from '../../api/photoAPI';

interface UploadState {
  percentage: number;
  isUploading: boolean;
  error: string | null;
}

const initialState: UploadState = {
  percentage: 0,
  isUploading: false,
  error: null,
}

export const uploadSlide = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    uploadPhotosStart: (state: UploadState) => {
      state.isUploading = true;
    },
    uploadPhotosSuccess: (state: UploadState) => {
      state.isUploading = false;
    },
    uploadPhotosFailure: (state, { payload }: PayloadAction<string>) => {
      state.isUploading = false;
      state.error = payload;
    },
    setUploadPercentage: (state, { payload }: PayloadAction<number>) => {
      state.percentage = payload;
    },
  },
});

export const {
  uploadPhotosStart,
  uploadPhotosSuccess,
  uploadPhotosFailure,
  setUploadPercentage,
} = uploadSlide.actions;

export const uploadPhotos = (photos: File[], album: string): AppThunk => async dispatch => {
  try {
    dispatch(uploadPhotosStart());
    await photoAPI.uploadPhotos(photos, album, dispatch);
    dispatch(uploadPhotosSuccess());
  } catch (err) {
    dispatch(uploadPhotosFailure(err.toString()));
  }
}

export default uploadSlide.reducer;
