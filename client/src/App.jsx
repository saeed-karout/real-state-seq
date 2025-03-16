import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./routes/homePage/homePage";
import ListPage from "./routes/listPage/listPage";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import UpdatePostPage from "./routes/updatePostPage/updatePostPage";
import { Layout, RequireAuth } from "./routes/layout/layout";
import { listPageLoader, profilePageLoader, singlePageLoader } from "./lib/loaders";
import NotAuthorized from "./routes/NotAuthorized.jsx";
import About from "./pages/web/about/About.jsx";
import Contact from "./pages/web/contact/Contact.jsx";
import ContactDash from "./pages/dashboard/contact/Contact.jsx";
import Realtor from "./pages/web/realtor/Realtor.jsx";
import NotFoundPage from "./routes/NotFoundPage.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFoundPage />, // معالجة الأخطاء داخل Layout
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/list", element: <ListPage />, loader: listPageLoader },
        { path: "/:id", element: <SinglePage />, loader: singlePageLoader },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/not-authorized", element: <NotAuthorized /> },
        { path: "/about", element: <About /> },
        { path: "/contact", element: <Contact /> },
        { path: "/realtor", element: <Realtor /> },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        { path: "/profile", element: <ProfilePage />, loader: profilePageLoader },
        { path: "/profile/update", element: <ProfileUpdatePage /> },
        { path: "/edit/:id", element: <UpdatePostPage /> },
        { path: "/add", element: <NewPostPage /> },
        { path: "/dash-contact", element: <ContactDash /> },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;