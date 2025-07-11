import { Routes, Route} from 'react-router'
import Root from './utils/Root.jsx'
import Login from './pages/Login.jsx'
import ProtectedRoutes from './utils/ProtectedRoutes.jsx'
function App() {

  return (
    <div className=''>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/admin/dashboard" element=
        {
          <ProtectedRoutes requireRole={["admin"]}>
            <h1>Admin Dashboard</h1>
          </ProtectedRoutes>
          } />
        <Route path="/contact" element={<h1>Employee Dashboard</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path='/unauthorized' element={<h1 className='font-bold text-3xl mt-20 ml-20'>Unauthorized</h1>}></Route>
      </Routes>
    </div>
  )
}

export default App
