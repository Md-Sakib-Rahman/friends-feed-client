import { createBrowserRouter, Navigate } from "react-router";
import PublicLayout from "../layouts/PublicLayout";
import SocialLayout from "../layouts/SocialLayout";
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Features from "../pages/public/Features";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Feed from "../features/posts/Feed";
import NotFound from "../pages/NotFound/NotFound";
import Profile from "../pages/social/Profile/Profile";
import UserProfile from "../pages/social/Profile/UserProfile";
import SearchModal from "../pages/social/Search/SearchModal";
import FriendsPage from "../pages/social/Friends/FriendsPage";
import NotificationPage from "../pages/social/NotificationPage/NotificationPage";
import SelectedPostPage from "../pages/social/SelectedPostPage/SelectedPostPage";
import MessagePage from "../pages/social/MessagePage/MessagePage";
import InboxPage from "../pages/social/InboxPage/InboxPage";

const isAuthenticated = true;

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "/features",
        element: <Features />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/social",
    element: <SocialLayout isAuthenticated={isAuthenticated} />,
    children: [
      {
        index: true,
        element: <Feed />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <div>Settings Page</div>,
      },
      {
        path: "user/:userId",
        element: <UserProfile />,
      },
      {
        path: "search",
        element: <SearchModal />,
      },
      {
        path: "friends",
        element: <FriendsPage />,
      },
      {
        path: "notifications",
        element: <NotificationPage />,
      },
      {
        path: "post/:id",
        element: <SelectedPostPage />,
      },
      {
        path: "messages",
        element: <MessagePage/>,
      },
      {
        path: "messages/:chatId",
        element: <InboxPage/>,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
