import React, { useState, useEffect } from "react";
import Axios from "axios";
import { baseUrl } from "../../constants/index";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function DetailsDialog(props) {
  const [detalles, setDetalles] = useState([]);
  const { data, idFactura } = props;

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
        {/*<Column field="options" header="Opciones" body={optionsFormatter} />*/}
      </DataTable>
    </div>
  );
}
