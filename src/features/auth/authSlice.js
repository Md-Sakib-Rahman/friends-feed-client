import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // রিফ্রেশ করার পর এখান থেকেই ডাটা লোড হয়
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      
      let modifiedUser = { ...user };
      const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`;

      if (!user.profilePicture || user.profilePicture.trim() === "") {
        modifiedUser.profilePicture = defaultAvatar;
      } else {
        modifiedUser.profilePicture = user.profilePicture;
      }

      state.user = modifiedUser;
      state.token = accessToken;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(modifiedUser));  
      localStorage.setItem("token", accessToken);  
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;

