import React, { useState, useEffect } from "react";
import Axios from "axios";
import { baseUrl } from "../../constants/index";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import logo from "../../assets/logo.jpg";
import Pdf from "react-to-pdf";
const ref = React.createRef();
const container = React.createRef();

export default function BillPdf(props) {
  const [detalles, setDetalles] = useState([]);
  const { data, factura } = props;
  const [totalPrice, setTotalPrice] = useState(0);
  var value = 0;

  useEffect(() => {
    fetchDetails();
    console.log("detaisFetched lolololo");
    console.log(
      "TAMAÑOS: ",
      ref.current && ref.current.offsetWidth,
      ref.current && ref.current.offsetHeight,
      ref
    );
  }, [factura.id]);

  function fetchDetails() {
    Axios.get(`${baseUrl}/detalles/${factura.id}`)
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

  const options = {
    orientation: "landscape",
    unit: "in",
    format: [
      container.current && container.current.offsetWidth - 200,
      container.current && container.current.offsetHeight
    ]
  };

  return (
    <div ref={container}>
      <div ref={ref} className="content-section implementation BillPdf">
        <div className="p-grid">
          <div className="p-col">
            <img
              src={logo}
              style={{
                width: 200,
                height: 200
              }}></img>
          </div>
          <div className="p-col">
            <h3>Factura Nº {factura.id} </h3>
          </div>
        </div>
        <hr></hr>
        <br></br>
        <br></br>

        <h3>Cliente: {factura.id_cliente}</h3>
        <h3>Fecha: {factura.fecha}</h3>
        <h2 style={{ margin: 10 }}>DETALLES</h2>
        <DataTable
          value={detalles}
          responsive={true}
          resizableColumns={true}
          columnResizeMode="fit">
          <Column field="id" header="ID" style={{ overflowX: "auto" }} />
          <Column
            field="id_factura"
            header="ID Factura"
            style={{ overflowX: "auto" }}
          />
          <Column
            field="id_producto"
            header="Producto"
            style={{ overflowX: "auto" }}
          />
          <Column
            field="cantidad"
            header="Cantidad"
            style={{ overflowX: "auto" }}
          />
          <Column
            field="precio"
            header="Precio"
            style={{ overflowX: "auto" }}
          />
          <Column
            field="descuento"
            header="Descuento"
            style={{ overflowX: "auto" }}
          />
          <Column field="impuesto" header="IVA" style={{ overflowX: "auto" }} />
          <Column
            field="subtotal"
            header="Subtotal"
            style={{ overflowX: "auto" }}
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
                  (detalle.precio -
                    detalle.precio * (detalle.descuento / 100)) *
                    (detalle.impuesto / 100)) *
                  detalle.cantidad;
            })}
          <h3>Precio Total: {value} €</h3>
          <p style={{ marginTop: 100 }}>
            &copy; LorenPeda S.A All Rights Reserved
          </p>
        </div>
      </div>
      <Pdf
        targetRef={ref}
        filename={`factura${factura.id}.pdf`}
        options={options}
        x={0.5}
        y={0.5}>
        {({ toPdf }) => <button onClick={toPdf}>Descargar Pdf</button>}
      </Pdf>
    </div>
  );
}
