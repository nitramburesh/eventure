import React from "react";
import ReactDOM from "react-dom";

import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import PostsPage from "./pages/PostsPage";
import NotFoundPage from "./pages/NotFoundPage";
import CreateEvent from "./pages/CreateEventPage/CreateEvent";

import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import { userState } from "./atoms";
import { useRecoilValue } from "recoil";
import FullEventView from "./pages/FullEventView";

const ProtectedRoute = ({ children }) => {
  const user = useRecoilValue(userState)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};
ReactDOM.render(
  <ChakraProvider>
    <RecoilRoot>
      <BrowserRouter>
        <Box position="relative" minHeight="100vh" minWidth="100vw" pb="200px">
          <Navbar />
          <Routes>

            <Route path="/" element={<Homepage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/createEvent" element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            } />
            <Route path="/event/:id" element={<FullEventView />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </Box>
      </BrowserRouter>
    </RecoilRoot>
  </ChakraProvider>,
  document.getElementById("root")
);
reportWebVitals();
