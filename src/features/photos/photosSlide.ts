import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../app/store';
import photoAPI, { Photo, PhotoListResult } from '../../api/photoAPI';

interface PhotosState {
  photosById: Record<string, Photo>;
  total: number;
  size: number;
  selectedIds: string[];
  isLastPage: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: PhotosState = {
  photosById: {},
  total: 0,
  size: 10,
  selectedIds: [],
  isLastPage: true,
  isLoading: false,
  error: null,
}

function startLoading(state: PhotosState) {
  state.isLoading = true;
}

function loadingFailed(state: PhotosState, action: PayloadAction<string>) {
  state.isLoading = false;
  state.error = action.payload;
}

export const photosSlide = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    getPhottosStart: startLoading,
    uploadPhotosStart: startLoading,
    deletePhotosStart: startLoading,
    getPhotosSuccess: (state: PhotosState, { payload }: PayloadAction<PhotoListResult>) => {
      const { documents, count, limit } = payload;
      state.isLoading = false;
      state.error = null;
      documents.forEach(photo => {
        state.photosById[photo.id] = photo;
      });
      state.total = Object.keys(state.photosById).length;
      state.isLastPage = count < limit;
    },
    resetPhotos: (state: PhotosState) => {
      state.photosById = {};
    },
    deletePhotosSuccess: (state: PhotosState, { payload }: PayloadAction<string[]>) => {
      payload.forEach(id => delete state.photosById[id]);
      state.selectedIds = [];
      state.isLoading = false;
    },
    getPhottosFailure: loadingFailed,
    uploadPhotosFailure: loadingFailed,
    deletePhotosFailure: loadingFailed,
    setPageSize: (state: PhotosState, { payload }: PayloadAction<number>) => {
      state.size = payload;
    },
    selectPhoto: (state: PhotosState, { payload }: PayloadAction<string>) => {
      const index = state.selectedIds.indexOf(payload);
      if (index === -1) {
        state.selectedIds.push(payload);
      } else {
        state.selectedIds.splice(index, 1);
      }
    },
  },
});

export const {
  getPhottosStart,
  uploadPhotosStart,
  deletePhotosStart,
  getPhotosSuccess,
  deletePhotosSuccess,
  getPhottosFailure,
  uploadPhotosFailure,
  deletePhotosFailure,
  setPageSize,
  resetPhotos,
  selectPhoto,
} = photosSlide.actions;

export const fetchPhotos = (offset: number, limit: number, reset = false): AppThunk => async dispatch => {
  try {
    dispatch(getPhottosStart());
    const photosResult = await photoAPI.getPhotos(offset, limit);
    if (reset) {
      dispatch(resetPhotos());
    }
    dispatch(getPhotosSuccess(photosResult));
  } catch (err) {
    dispatch(getPhottosFailure(err.toString()));
  }
}

export const deletePhotos = (
    selectedIds: string[],
    photosById: Record<string, Photo>
  ): AppThunk => async dispatch => {
  try {
    dispatch(deletePhotosStart());
    await photoAPI.deletePhotos(selectedIds, photosById);
    dispatch(deletePhotosSuccess(selectedIds));
  } catch (err) {
    dispatch(deletePhotosFailure(err.toString()));
  }
}

export default photosSlide.reducer;
