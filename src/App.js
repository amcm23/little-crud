import React from 'react';
import './App.css';
import {TabView,TabPanel} from 'primereact/tabview';
import Clients from './views/clients'
import Products from './views/products'
import Facturas from './views/facturas'

function App() {
  return (
    <div className="App">
      <h1>Software de Gestión: </h1>
      <TabView>
      <TabPanel responsive header="Clientes">
          <Clients />
        </TabPanel>
        <TabPanel responsive={true} header="Facturas">
        <Facturas/>
        </TabPanel>
        <TabPanel header="Productos">
        <Products />
        </TabPanel>
      </TabView>
    </div>
  );
}

export default App;
