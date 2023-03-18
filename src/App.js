import React, { useState } from "react";

function App() {
  const [folder, setFolder] = useState(null);

  const handleFolderSelect = async (event) => {
    const files = event.target.files;
    if (!files || !files.length) return;
  
    const folder = files[0];
    const dirHandle = await window.showDirectoryPicker({ startIn: 'desktop', });
    const dirReader = dirHandle.createReader();
    const entries = [];
  
    const readEntries = async () => {
      const batch = await dirReader.readEntries();
      if (!batch.length) {
        const filenames = entries.map((entry) => entry.name);
        const csvData = "data:text/csv;charset=utf-8," + filenames.join("\n");
        const encodedURI = encodeURI(csvData);
        const link = document.createElement("a");
        link.setAttribute("href", encodedURI);
        link.setAttribute("download", "filelist.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      entries.push(...batch);
      await readEntries();
    };
  
    await readEntries();
  };
  
  

  const handleGenerateCSV = () => {
    if (!folder) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dirEntry = reader.result;
      const dirReader = dirEntry.createReader();
      dirReader.readEntries((entries) => {
        const filenames = entries.map((entry) => entry.name);
        const csvData = "data:text/csv;charset=utf-8," + filenames.join("\n");
        const encodedURI = encodeURI(csvData);
        const link = document.createElement("a");
        link.setAttribute("href", encodedURI);
        link.setAttribute("download", "filelist.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    };
    reader.readAsFileSystemHandle(folder);
  };

  return (
    <div>
      <h1>Select a folder to generate a file list</h1>
      <input type="file" webkitdirectory="true" onChange={handleFolderSelect} />
      <button onClick={handleGenerateCSV}>Generate CSV</button>
    </div>
  );
}

export default App;
