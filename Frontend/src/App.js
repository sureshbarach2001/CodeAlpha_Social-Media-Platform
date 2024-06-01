import logo from './logo.svg';
import './App.css';
import React, { lazy, Suspense, Component } from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { Provider } from "react-redux"

import Header from "./pages/includes/Header"
import Footer from "./pages/includes/Footer"
import store from "./constants/store"

const Home = lazy(function () {
  return import('./pages/Home')
})

const About = lazy(function () {
  return import ("./pages/About")
})

const Login = lazy(function () {
  return import ("./pages/Login")
})

const Signup = lazy(function () {
  return import ("./pages/Signup")
})

const UpdateProfile = lazy(function () {
  return import ("./pages/UpdateProfile")
})

const ChangePassword = lazy(function () {
  return import ("./pages/ChangePassword")
})

const AddStory = lazy(function () {
  return import ("./pages/AddStory")
})

const ViewStory = lazy(function () {
  return import ("./pages/ViewStory")
})

const PostDetail = lazy(function () {
  return import ("./pages/PostDetail")
})

const User = lazy(function () {
  return import ("./pages/User")
})

const CreatePage = lazy(function () {
  return import ("./pages/CreatePage")
})

const Pages = lazy(function () {
  return import ("./pages/Pages")
})

const Page = lazy(function () {
  return import ("./pages/Page")
})

const EditPage = lazy(function () {
  return import ("./pages/EditPage")
})

const CreateGroup = lazy(function () {
  return import ("./pages/CreateGroup")
})

const Groups = lazy(function () {
  return import ("./pages/Groups")
})

const Group = lazy(function () {
  return import ("./pages/Group")
})

const EditGroup = lazy(function () {
  return import ("./pages/EditGroup")
})

const Boost = lazy(function () {
  return import ("./pages/Boost")
})

const Ads = lazy(function () {
  return import ("./pages/Ads")
})

const Search = lazy(function () {
  return import ("./pages/Search")
})

const Friends = lazy(function () {
  return import ("./pages/Friends")
})

const Inbox = lazy(function () {
  return import ("./pages/Inbox")
})

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <div className="theme-layout">
          <Header />

          <Suspense fallback={<h3>Loading....</h3>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/About" element={<About />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/UpdateProfile" element={<UpdateProfile />} />
              <Route path="/ChangePassword" element={<ChangePassword />} />
              <Route path="/AddStory" element={<AddStory />} />
              <Route path="/ViewStory" element={<ViewStory />} />
              <Route path="/PostDetail/:id" element={<PostDetail />} />
              <Route path="/User/:id" element={<User />} />
              <Route path="/CreatePage" element={<CreatePage />} />
              <Route path="/Pages" element={<Pages />} />
              <Route path="/Page/:id" element={<Page />} />
              <Route path="/EditPage/:id" element={<EditPage />} />
              <Route path="/CreateGroup" element={<CreateGroup />} />
              <Route path="/Groups" element={<Groups />} />
              <Route path="/Group/:id" element={<Group />} />
              <Route path="/EditGroup/:id" element={<EditGroup />} />
              <Route path="/Boost/:id" element={<Boost />} />
              <Route path="/Ads" element={<Ads />} />
              <Route path="/Search/:query" element={<Search />} />
              <Route path="/Friends" element={<Friends />} />
              <Route path="/Inbox" element={<Inbox />} />
            </Routes>
          </Suspense>

          <Footer />
        </div>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
