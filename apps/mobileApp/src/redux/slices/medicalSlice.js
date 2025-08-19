import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setLoading} from './loadingSlice';
import API from '../../services/API';
import {navigationContainerRef} from '../../../App';
import {showToast} from '../../components/Toast';

export const add_medical_records = createAsyncThunk(
  'medical/saveMedicalRecord',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));

      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `saveMedicalRecord`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));

      if (response.status !== 200) {
        return rejectWithValue(response?.data);
      }

      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
