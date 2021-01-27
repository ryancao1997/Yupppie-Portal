import React from "react";
import Application from "./Components/Application";
import { AuthProvider } from "./Context";
function App() {
  return (
    <AuthProvider>
      <Application />
    </AuthProvider>
  );
}
export default App;