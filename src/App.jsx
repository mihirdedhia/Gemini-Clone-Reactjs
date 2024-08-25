import Main from "./components/Main/Main"
import Sidebar from "./components/Sidebar/Sidebar"

function App() {
  // console.log(import.meta.env.VITE_GEMINI_API_KEY);

  return (
    <>
      <Sidebar />
      <Main />
    </>
  )
}

export default App
