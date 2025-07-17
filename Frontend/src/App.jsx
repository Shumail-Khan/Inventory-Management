import { Routes, Route} from 'react-router'
import Root from './utils/Root.jsx'
import Login from './pages/Login.jsx'
import ProtectedRoutes from './utils/ProtectedRoutes.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Categories from './components/Categories.jsx'
import Suppliers from './components/Suppliers.jsx'
import Products from './components/Products.jsx'
import Logout from './components/Logout.jsx'
import Users from './components/Users.jsx'
import CustomerProducts from './components/CustomerProducts.jsx'
import Orders from './components/Orders.jsx'
import Profile from './components/Profile.jsx'

function App() {

  return (
    <div className=''>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/admin-dashboard" element=
          {
          <ProtectedRoutes requireRole={["admin"]}>
            <Dashboard />
          </ProtectedRoutes>
          } >
          <Route index element={<h1>Admin Dashboard</h1>}/>
          <Route path='categories' element={<Categories />}/>
          <Route path='products' element={<Products/>}/>
          <Route path='suppliers' element={<Suppliers/>}/>
          <Route path='orders' element={<h1>Also orders Dashboard</h1>}/>
          <Route path='users' element={<Users/>}/>
          <Route path='profile' element={<h1>Also profile Dashboard</h1>}/>
          <Route path='logout' element={<Logout/>}/>
          
        </Route>  

        <Route path="/customer-dashboard" element={<Dashboard/>} >
          <Route index element={<CustomerProducts/>}/>
          <Route path='orders' element={<Orders/>}/>
          <Route path='profile' element={<Profile/>}/>
          <Route path='logout' element={<Logout/>}/>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path='/unauthorized' element={<h1 className='font-bold text-3xl mt-20 ml-20'>Unauthorized</h1>}></Route>
      </Routes>
    </div>
  )
}

export default App
