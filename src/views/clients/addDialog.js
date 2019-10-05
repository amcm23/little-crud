import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { es } from "./spanish";
import Axios from "axios";
import { baseUrl } from "../../constants/index";

export default function AddDialog(props) {
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [dni, setDni] = useState();
  const [birthDate, setBirthDate] = useState();
  const [tlf, setTlf] = useState();
  const [email, setEmail] = useState();

  function submit() {
    const values = {
      nombre: name,
      apellido: surname,
      dni: dni,
      fecha_nacimiento: birthDate,
      telefono: tlf,
      email: email
    };

    Axios.post(`${baseUrl}/clientes`, values)
      .then(response => {
        console.log(response.data);
        props.hideDialog();
        setName("");
        setSurname("");
        setDni("");
        setBirthDate("");
        setTlf("");
        setEmail("");
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div className="content-section implementation">
      <div className="p-grid p-fluid">
        <div className="p-col-12 p-md-4">
          <div className="p-inputgroup" style={{ marginBottom: "1rem" }}>
            <InputText
              placeholder="Nombre"
              value={name}
              onChange={e => setName(e.value)}
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4">
          <div className="p-inputgroup" style={{ marginBottom: "1rem" }}>
            <InputText
              placeholder="Apellido"
              value={surname}
              onChange={e => setSurname(e.value)}
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4" style={{ marginBottom: "1rem" }}>
          <div className="p-inputgroup">
            <InputText
              placeholder="DNI"
              value={dni}
              onChange={e => setDni(e.value)}
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4">
          <div className="p-inputgroup" style={{ marginBottom: "1rem" }}>
            <Calendar
              value={birthDate}
              onChange={e => setBirthDate(e.value)}
              locale={es}
              dateFormat="dd/mm/yy"
              placeholder="Fecha de nacimiento"
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4" style={{ marginBottom: "1rem" }}>
          <div className="p-inputgroup">
            <InputText
              placeholder="Telefono"
              value={tlf}
              onChange={e => setDni(e.value)}
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4" style={{ marginBottom: "1rem" }}>
          <div className="p-inputgroup">
            <InputText
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.value)}
            />
          </div>
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
