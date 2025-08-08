import React from "react";
import Layout, { AdminLayout } from "./layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/common/ToastContext";
import ScrollToTop from "./components/common/ScrollToTop";
import Home from "./Pages/Home";
import About from "./Pages/About";
import FAQ from "./Pages/FAQ";
import Jobs from "./Pages/Jobs";
import Internships from "./Pages/Internships";
import JobDetails from "./Pages/JobDetails";
import StudentAuth from "./Pages/StudentAuth";
import RecruiterAuth from "./Pages/RecruiterAuth";
import RecruiterDashboard from "./Pages/RecruiterDashboard";
import StudentDashboard from "./Pages/StudentDashboard";
import StudentLayout from "./StudentLayout";
import RecruiterLayout from "./RecruiterLayout";
import ResumeBuilder from "./Pages/ResumeBuilder";
import UpdateProfile from "./Pages/UpdateProfile";
import UploadResume from "./Pages/UploadResume";
import MyApplications from "./Pages/MyApplications";
import PostJobs from "./Pages/PostJobs";
import PostInternship from "./Pages/PostInternship";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SettingsPage from "./Pages/SettingsPage";
import RecruiterSettings from "./Pages/RecruiterSettings";
import AdminPage from "./Pages/Admin";
import AdminSettings from "./Pages/AdminSettings";
import ProfileView from "./Pages/ProfileView";
import ManageJobs from "./Pages/ManageJobs";
import EditJob from "./Pages/EditJob";
import Analytics from "./Pages/Analytics";
import AdminAuth from "./Pages/AdminAuth";
import Applications from "./Pages/Applications";
import Preparation from "./Pages/Preparation";
import Hackathons from "./Pages/Hackathons";
import ManageInternships from "./Pages/ManageInternships";
import EditInternship from "./Pages/EditInternship";
import InternshipDetails from "./Pages/InternshipDetails";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

import RecruiterHome from "./Pages/RecruiterHome";

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <Layout currentPageName="Home">
                <Home />
              </Layout>
            }
          />
          <Route
            path="/p/home"
            element={
              <Layout currentPageName="Home">
                <Home />
              </Layout>
            }
          />
          <Route
            path="/p/jobs"
            element={
              <Layout currentPageName="Jobs">
                <Jobs />
              </Layout>
            }
          />
          <Route
            path="/p/internships"
            element={
              <Layout currentPageName="Internships">
                <Internships />
              </Layout>
            }
          />
          {/* Student-specific routes with mobile sidebar */}
          <Route
            path="/p/profile"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout>
                  <UpdateProfile />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/profileview"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout>
                  <ProfileView />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/contact"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout>
                  <div className="text-center py-20">
                    <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
                    <p className="text-gray-600">Get in touch with our support team.</p>
                  </div>
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/job-details/:jobId"
            element={
              <Layout currentPageName="JobDetails">
                <JobDetails />
              </Layout>
            }
          />
          <Route
            path="/p/internship-details/:internshipId"
            element={
              <Layout currentPageName="InternshipDetails">
                <InternshipDetails />
              </Layout>
            }
          />
          <Route
            path="/p/about"
            element={
              <Layout currentPageName="About">
                <About />
              </Layout>
            }
          />
          <Route
            path="/p/faq"
            element={
              <Layout currentPageName="FAQ">
                <FAQ />
              </Layout>
            }
          />
          {/* xww */}
          {/* Recruiterpage */}
          {/* <Route
            path="/p/recruiterhome"
            element={
              <Layout currentPageName="RecruiterHome">
                <RecruiterHome />
              </Layout>
            }
          /> */}
          <Route
            path="/p/studentauth"
            element={
              <Layout currentPageName="StudentAuth">
                <StudentAuth />
              </Layout>
            }
          />
          <Route
            path="/p/forgot-password"
            element={
              <Layout currentPageName="ForgotPassword">
                <ForgotPassword />
              </Layout>
            }
          />
          <Route
            path="/p/reset-password/:token"
            element={
              <Layout currentPageName="ResetPassword">
                <ResetPassword />
              </Layout>
            }
          />
          <Route
            path="/p/studentdashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout currentPageName="StudentDashboard">
                  <StudentDashboard />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/settings"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout>
                  <SettingsPage />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/editresume"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout currentPageName="StudentDashboard">
                  <ResumeBuilder />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/editprofile"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout>
                  <UpdateProfile />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/updateProfile"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterLayout>
                  <UpdateProfile />
                </RecruiterLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/help"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout currentPageName="FAQ">
                  <FAQ />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/uploadresume"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout>
                  <UploadResume />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/internship"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout>
                  <Internships />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/FAQs"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout>
                  <FAQ />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/applications"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout>
                  <MyApplications />
                </StudentLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/p/preparation"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout>
                  <Preparation />
                </StudentLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/p/hackathons"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout>
                  <Hackathons />
                </StudentLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/p/recruiterauth"
            element={
              <Layout currentPageName="RecruiterAuth">
                <RecruiterAuth />
              </Layout>
            }
          />
          <Route
            path="/p/recruiterdashboard"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterLayout currentPageName="RecruiterDashboard">
                  <RecruiterDashboard />
                </RecruiterLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/recruiterprofileview"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterLayout>
                  <ProfileView />
                </RecruiterLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/recruitersettings"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterLayout>
                  <RecruiterSettings />
                </RecruiterLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/post-jobs"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterLayout>
                  <PostJobs />
                </RecruiterLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/post-internships"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterLayout>
                  <PostInternship />
                </RecruiterLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/manage-jobs"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterLayout>
                  <ManageJobs />
                </RecruiterLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/manage-internships"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterLayout>
                  <ManageInternships />
                </RecruiterLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/edit-job/:jobId"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterLayout>
                  <EditJob />
                </RecruiterLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/edit-internship/:internshipId"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterLayout>
                  <EditInternship />
                </RecruiterLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/analytics"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterLayout>
                  <Analytics />
                </RecruiterLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/job-applications"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterLayout>
                  <Applications />
                </RecruiterLayout>
              </ProtectedRoute>
            }
          />
          {/* Admin */}
          <Route path="/p/adminauth" element={<AdminAuth />} />
          <Route
            path="/p/adminpage"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/p/adminsettings"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Optional: 404 page fallback */}
          <Route
            path="*"
            element={
              <Layout currentPageName="404">
                <div className="text-center py-20">404 - Page Not Found</div>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ToastProvider>
  );
}
