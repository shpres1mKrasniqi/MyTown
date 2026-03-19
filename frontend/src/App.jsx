import { Suspense, lazy } from "react"; 
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import "./App.css";




function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
       
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>

      <ToastContainer 
        position="top-center" 
        autoClose={2000} 
        hideProgressBar 
        limit={1} 
        theme="colored"
      />
    </Suspense>
  );
}

export default App;