import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { es } from "../../constants/spanish";
import Axios from "axios";
import { baseUrl } from "../../constants/index";
import moment from "moment";

export default function EditDialog(props) {
  const { data } = props;

  useEffect(() => {
    //COMO EL SET STATE DEL COMPONENTE PADRE ES UNA FUNCIÓN ASÍNCRONA, TENGO QUE HACER UN USE EFFECT
    // QUE DETECTE CUANDO CAMBIA LA PROP DATA Y ASÍ COLOCAR POR DEFECTO LOS DATOS A EDITAR EN EL FORMULARIO
    data && console.log("data pro props: ", data.id);
    data && setId(data.id);
    data && setName(data.nombre);
    data && setSurname(data.apellido);
    data && setDni(data.dni);
    data && setBirthDate(data.fecha_nacimiento);
    data && setAddress(data.direccion);
    data && setTlf(data.telefono);
    data && setEmail(data.email);
  }, [data]);

  const [id, setId] = useState();
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [dni, setDni] = useState();
  const [birthDate, setBirthDate] = useState();
  const [address, setAddress] = useState();
  const [tlf, setTlf] = useState();
  const [email, setEmail] = useState();

  function submit() {
    const values = {
      dni: dni,
      nombre: name,
      apellido: surname,
      direccion: address,
      fecha_nacimiento: moment(birthDate).format("DD-MM-YYYY"),
      telefono: tlf,
      email: email
    };

    console.log("VALORES SUBMIT", values);

    Axios.put(`${baseUrl}/clientes/${id}`, values)
      .then(response => {
        console.log(response.data);
        props.hideDialog();
        setId();
        setName("");
        setSurname("");
        setDni("");
        setAddress("");
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
              onChange={e => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4">
          <div className="p-inputgroup" style={{ marginBottom: "1rem" }}>
            <InputText
              placeholder="Apellido"
              value={surname}
              onChange={e => setSurname(e.target.value)}
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4" style={{ marginBottom: "1rem" }}>
          <div className="p-inputgroup">
            <InputText
              placeholder="DNI"
              value={dni}
              onChange={e => setDni(e.target.value)}
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4" style={{ marginBottom: "1rem" }}>
          <div className="p-inputgroup">
            <InputText
              placeholder="Dirección"
              value={address}
              onChange={e => setAddress(e.target.value)}
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
              onChange={e => setTlf(e.target.value)}
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4" style={{ marginBottom: "1rem" }}>
          <div className="p-inputgroup">
            <InputText
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="p-col-12 p-md-4" style={{ marginBottom: "1rem" }}>
          <div className="p-inputgroup">
            <Button label="Confirmar" onClick={submit} />
          </div>
        </div>
      </div>
    </div>
  );
}
