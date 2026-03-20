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
      
      // ১. মডিফাইড ইউজার অবজেক্ট তৈরি করা (ডিফল্ট ছবি সহ)
      let modifiedUser = { ...user };
      const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`;

      if (!user.profilePicture || user.profilePicture.trim() === "") {
        modifiedUser.profilePicture = defaultAvatar;
      } else {
        modifiedUser.profilePicture = user.profilePicture;
      }

      // ২. স্টেট আপডেট করা (সবসময় মডিফাইড ভার্সন ব্যবহার করো)
      state.user = modifiedUser;
      state.token = accessToken;
      state.isAuthenticated = true;

      // ৩. LocalStorage এ সেভ করা (অবশ্যই modifiedUser সেভ করতে হবে)
      localStorage.setItem("user", JSON.stringify(modifiedUser)); // ✅ আগে এখানে শুধু 'user' ছিল
      localStorage.setItem("token", accessToken); // ✅ নামকরণ 'token' এ কনসিস্টেন্ট রাখা হয়েছে
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

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: JSON.parse(localStorage.getItem("user")) || null,
//   accessToken: localStorage.getItem("accessToken") || null,
//   isAuthenticated: !!localStorage.getItem("token"),
//   isLoading: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     // লগইন সাকসেস হলে ডাটা সেট করা
//     setCredentials: (state, action) => {
//       const { user, accessToken } = action.payload;
//       let modifiedUser = { ...user };

//       const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`;

//       if (!user.profilePicture || user.profilePicture.trim() === "") {
//         modifiedUser.profilePicture = defaultAvatar;
//       } else {
//         modifiedUser.profilePicture = user.profilePicture;
//       }
//       state.user = modifiedUser;
//       state.token = accessToken;
//       state.isAuthenticated = true;

//       // LocalStorage এ সেভ করা
//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem("token", accessToken);
//     },
//     // লগআউট লজিক
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;

//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//     },
//     setLoading: (state, action) => {
//       state.isLoading = action.payload;
//     },
//   },
// });

// export const { setCredentials, logout, setLoading } = authSlice.actions;
// export default authSlice.reducer;
