import ProductList from './components/ProductList'
import Navbar from './components/Navbar'
import {Routes, Route} from 'react-router-dom'


function App() {

return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<h1>Inicio</h1>} />
        <Route path="/productos" element={<ProductList />} />
        <Route path="/categorias" element={<h1>Categorías</h1>} />
        <Route path="/pedidos" element={<h1>Pedidos</h1>} />
      </Routes>
    </>
  )
}

export default App;