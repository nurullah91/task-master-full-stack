import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import auth from '../../../utils/firebase.config';

const initialState = {
  name: '',
  email: '',
  isLoading: true,
  isError: false,
  error: ""
};

// Create async thunk
export const createUser = createAsyncThunk(
  'userSlice/createUser',
  async ({ email, password, name }) => {
    const data = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(auth.currentUser, {
      displayName: name
    })
    console.log(data);
    return {
      email: data.user.email,
      name: data.user.displayName
    };
  }
)

// Login user



const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.name = payload.name;
      state.email = payload.email;

    },
    toggleLoading: (state, {payload}) => {
      state.isLoading = payload
    },
    logout: (state) => {
      state.email = '';
      state.name = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createUser.pending, (state) => {
      state.name = "";
      state.email = "";
      state.isLoading = true;
      state.isError = false;
      state.error = "";
    })
      .addCase(createUser.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.name = payload.name;
        state.email = payload.email;
        state.isLoading = false;
        state.isError = false;
        state.error = "";
      })
      .addCase(createUser.rejected, (state, action) => {
        state.name = "";
        state.email = "";
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })


  }
});

export const {setUser, toggleLoading, logout} = userSlice.actions

export default userSlice.reducer;
