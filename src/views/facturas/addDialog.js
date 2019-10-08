import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { es } from "../../constants/spanish";
import Axios from "axios";
import { baseUrl } from "../../constants/index";
import { Dropdown } from "primereact/dropdown";
import { ListBox } from "primereact/listbox";
import { Dialog } from "primereact/dialog";
import moment from "moment";

export default function AddDialog(props) {
  useEffect(() => {
    Axios.get(`${baseUrl}/clientes`)
      .then(response => {
        console.log(response.data);
        setClientes(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    Axios.get(`${baseUrl}/productos`)
      .then(response => {
        console.log(response.data);
        setProductos(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const [idCliente, setIdCliente] = useState();
  const [fecha, setFecha] = useState();
  const [detalles, setDetalles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [currentProduct, setCurrentProduct] = useState();
  const [currentCantidad, setCurrentCantidad] = useState();
  const [dialogCantidad, setDialogCantidad] = useState(0);
  const [currentDescuento, setCurrentDescuento] = useState(0);

  function submit() {
    const values = {
      id_cliente: idCliente.toString(),
      fecha: moment(fecha).format("YYYY-MM-DD"),
      detalles: detalles
    };

    console.log("VALORES SUBMIT", values);

    Axios.post(`${baseUrl}/facturas`, values)
      .then(response => {
        console.log(response.data);
        props.hideDialog();
        props.fetchBills();
      })
      .catch(error => {
        console.log(error);
      });
  }

  function productsTemplate(option) {
    return (
      <div className="p-clearfix">
        <span
          style={{ fontSize: "1em", float: "right", margin: "1em .5em 0 0" }}>
          {option.label}
        </span>
      </div>
    );
  }

  function handleAddProduct(p) {
    console.log("CURRENT CANTIDAD: ", currentCantidad);
    setCurrentProduct(p);
    setDialogCantidad(true);
  }

  useEffect(() => {
    setCurrentCantidad(currentCantidad);
  }, [currentCantidad]);

  function handleOk() {
    setDetalles([
      ...detalles,
      {
        id_producto: currentProduct && currentProduct.id,
        cantidad: currentCantidad && currentCantidad * 1,
        precio: currentProduct && currentProduct.precio,
        descuento: currentDescuento && currentDescuento * 1,
        impuesto: currentProduct && currentProduct.impuesto
      }
    ]);
    setDialogCantidad(false);
  }

  {
    /**HANDLERS */
  }

  function handleChangeCantidad(q) {
    console.log("LA PUTA CANTIDAD: ", q);
    setCurrentCantidad(q);
  }

  function handleChangeDescuento(d) {
    console.log("EL PUTO DESCUENTO ", d);
    setCurrentDescuento(d);
  }

  function handleFecha(f) {
    console.log("LA FOQUIN FECHA ", f);
    setFecha(f);
  }

  function handleIdCliente(id) {
    console.log("FUCK ID CLIENTE: ", id);
    setIdCliente(id);
  }

  return (
    <div className="content-section implementation">
      <div className="p-grid p-fluid">
        <div className="p-col-12 p-md-4" style={{ marginBottom: "1rem" }}>
          <div className="p-inputgroup">
            <Dropdown
              value={idCliente}
              filter={true}
              options={clientes.map(function(cliente, i) {
                return {
                  label: `${cliente.id} | ${cliente.nombre} ${cliente.apellido}`,
                  value: cliente.id
                };
              })}
              onChange={e => handleIdCliente(e.target.value)}
              placeholder="Selecciona un clientes"
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4">
          <div className="p-inputgroup" style={{ marginBottom: "1rem" }}>
            <Calendar
              value={fecha}
              onChange={e => handleFecha(e.value)}
              locale={es}
              dateFormat="dd/mm/yy"
              placeholder="Fecha de factura"
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4" style={{ marginBottom: "1rem" }}>
          <div className="p-inputgroup">
            <ListBox
              value={currentProduct}
              filter={true}
              options={productos.map(function(producto, i) {
                return {
                  label: `${producto.id} | ${producto.nombre} | ${producto.precio}`,
                  value: {
                    id: producto.id,
                    precio: producto.precio,
                    impuesto: producto.impuesto
                  }
                };
              })}
              onChange={e => handleAddProduct(e.value)}
              //itemTemplate={productsTemplate}
              style={{ width: "15em" }}
              listStyle={{ maxHeight: "250px" }}
            />
          </div>
        </div>

        <Dialog
          header="Cantidad"
          visible={dialogCantidad}
          //style={{ width: "80vw" }}
          modal={false}
          closable={false}
          onHide={() => setDialogCantidad(false)}>
          <div>
            <div style={{ margin: "0.5rem" }}>
              <InputText
                placeholder="cantidad"
                onChange={e => handleChangeCantidad(e.target.value)}
              />
            </div>
            <div style={{ margin: "0.5rem" }}>
              <InputText
                placeholder="descuento (%)"
                onChange={e => handleChangeDescuento(e.target.value)}
              />
            </div>
            <div style={{ margin: "0.5rem" }}>
              <Button label={"Ok"} onClick={handleOk}></Button>
            </div>
          </div>
        </Dialog>
        <hr style={{ marginTop: "1rem", marginBottom: "1rem" }}></hr>
        <div>
          <h3>Detalles: </h3>
          {detalles.map(function(detalle, i) {
            return (
              <div>
                ID producto: {detalle.id_producto} | Descuento:{" "}
                {detalle.descuento}% | Cantidad: {detalle.cantidad} uds.
              </div>
            );
          })}
        </div>
        <div className="p-col-12 p-md-4" style={{ marginBottom: "1rem" }}>
          <div className="p-inputgroup">
            <Button label="Añadir" onClick={submit} />
          </div>
        </div>
      </div>
    </div>
  );
}
