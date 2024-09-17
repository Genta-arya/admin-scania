import React from "react";

import SideBar from "./components/SideBar";
import MainPage from "./layaouts/TypeCodePage/MainPage";
import ContentView from "./components/ContentView";

const App = () => {
  return (
    <main className="overflow-hidden">
      <ContentView />
    </main>
  );
};

export default App;
