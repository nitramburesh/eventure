import React from "react";
import ReactDOM from "react-dom";

import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AllEventsPage from "./pages/AllEventsPage";
import NotFoundPage from "./pages/NotFoundPage";
import CreateEvent from "./pages/CreateEvent";

import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { userState } from "./atoms";
import FullEventView from "./pages/FullEventView";
import UserPage from "./pages/UserPage";

const ProtectedRoute = ({ children }) => {
  const user = useRecoilValue(userState);
  if (!user) {
    return <Navigate to="/login" replace />;
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
            <Route path="/allEvents" element={<AllEventsPage />} />
            <Route path="/userDetails" element={<UserPage />} />
            <Route
              path="/createEvent"
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event/:id"
              element={
                <ProtectedRoute>
                  <FullEventView />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </Box>
      </BrowserRouter>
    </RecoilRoot>
  </ChakraProvider>,
  document.getElementById("root"),
);
reportWebVitals();
