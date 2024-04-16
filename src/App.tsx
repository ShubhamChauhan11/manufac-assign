import "./App.css";
import data from "./data/Wine-Data.json";
import { Tables } from "./components/Table";
import { MantineProvider } from "@mantine/core";

function App() {
  return (
    <MantineProvider>
      <div className="App" style={{ padding: "10px" }}>
        <Tables data={data} />
      </div>
    </MantineProvider>
  );
}

export default App;
