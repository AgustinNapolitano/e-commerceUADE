import ProductList from './components/ProductList'
import NavBar from './components/NavBar'
import ProductDetail from './components/ProductDetail'
import {Routes, Route} from 'react-router-dom'


function App() {

return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<h1>Inicio</h1>} />
        <Route path="/productos" element={<ProductList />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/categorias" element={<h1>Categorías</h1>} />
        <Route path="/pedidos" element={<h1>Pedidos</h1>} />
      </Routes>
    </>
  )
}

export default App;