import React, { useState, useEffect } from "react";
import Axios from "axios";
import { baseUrl } from "../../constants/index";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function DetailsDialog(props) {
  const [detalles, setDetalles] = useState([]);
  const { data, idFactura } = props;
  const [totalPrice, setTotalPrice] = useState(0);
  var value = 0;

  useEffect(() => {
    fetchDetails();
    console.log("detaisFetched lolololo");
  }, [idFactura]);

  function fetchDetails() {
    Axios.get(`${baseUrl}/detalles/${idFactura}`)
      .then(response => {
        console.log(response.data);
        setDetalles(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  function optionsFormatter(rowData, column) {
    //este formateador lo que hace es pintar botones en vez de datos
    //en la tupla de cada billo y trae en rowData el objeto billo
    return (
      <div>
        {(rowData.precio -
          rowData.precio * (rowData.descuento / 100) +
          (rowData.precio - rowData.precio * (rowData.descuento / 100)) *
            (rowData.impuesto / 100)) *
          rowData.cantidad}
        €
      </div>
    );
  }

  function handleTotalPrice(price) {
    let myPrice = totalPrice + price;
    setTotalPrice(myPrice);
  }

  return (
    <div>
      <DataTable
        value={detalles}
        responsive={true}
        resizableColumns={true}
        columnResizeMode="fit">
        <Column
          field="id"
          header="ID"
          filter={true}
          style={{ overflowX: "auto" }}
          sortable={true}
        />
        <Column
          field="id_factura"
          header="ID Factura"
          filter={true}
          style={{ overflowX: "auto" }}
          sortable={true}
        />
        <Column
          field="id_producto"
          header="Producto"
          filter={true}
          style={{ overflowX: "auto" }}
          sortable={true}
        />
        <Column
          field="cantidad"
          header="Cantidad"
          filter={true}
          style={{ overflowX: "auto" }}
          sortable={true}
        />
        <Column
          field="precio"
          header="Precio"
          filter={true}
          style={{ overflowX: "auto" }}
          sortable={true}
        />
        <Column
          field="descuento"
          header="Descuento"
          filter={true}
          style={{ overflowX: "auto" }}
          sortable={true}
        />
        <Column
          field="impuesto"
          header="IVA"
          filter={true}
          style={{ overflowX: "auto" }}
          sortable={true}
        />
        <Column
          field="subtotal"
          header="Subtotal"
          filter={true}
          style={{ overflowX: "auto" }}
          sortable={true}
          body={optionsFormatter}
        />
        {/*<Column field="options" header="Opciones" body={optionsFormatter} />*/}
      </DataTable>
      <div>
        {detalles &&
          detalles.map(function(detalle, i) {
            value =
              value +
              (detalle.precio -
                detalle.precio * (detalle.descuento / 100) +
                (detalle.precio - detalle.precio * (detalle.descuento / 100)) *
                  (detalle.impuesto / 100)) *
                detalle.cantidad;
          })}
        <h3>Precio Total: {value} €</h3>
      </div>
    </div>
  );
}
