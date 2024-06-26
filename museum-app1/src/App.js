import './App.css';
import React from "react";
import Login from './pages/login/Login';
import "react-datepicker/dist/react-datepicker.css";
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <div className="App">
      <br></br>
      <Login />
    </div>
  );
}

export default App;