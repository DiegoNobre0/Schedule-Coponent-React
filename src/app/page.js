"use client";

import HotelsModel from "./datas/hotels";
import CustomersModel from "./datas/customers";
import ReservationsModel from "./datas/reservations";
import StatusModel from "./datas/status";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircleIcon from "@mui/icons-material/Circle";
import SquareIcon from "@mui/icons-material/Square";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Container } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";

// Lida com o array de datas que será renderizado
const dataInicio = new Date("2023-07-26T12:00:00");
const dataFim = new Date("2023-08-30T12:00:00");

const mesesAbreviados = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
const diasAbreviados = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const intervalo = Math.floor((dataFim - dataInicio) / (1000 * 60 * 60 * 24));

const datasIntervalo = [];

for (let i = 0; i <= intervalo; i++) {
  const data = new Date(dataInicio);
  data.setDate(dataInicio.getDate() + i);
  datasIntervalo.push(data);
}

const dayWidth = 60;

export default function Schedule(datas) {
  const [accordionOpen, setAccordionOpen] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [hotelList, setHotelList] = useState([]);
  const [reservationList, setReservationList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [ApartamentList, setApartamentList] = useState([]);

  const [filteredApartaments, setFilteredApartaments] = useState([]);

  //Form
  const [currentNameForm, setCurrentNameForm] = useState("");
  const [currentIdHotelForm, setCurrentIdHotelForm] = useState("");
  const [currentIdApartamentForm, setCurrentIdApartamentForm] = useState("");
  const [statusReservaForm, setStatusReservaForm] = useState("");
  const [checkInForm, setCheckInForm] = useState("");
  const [checkOutForm, setCheckOutForm] = useState("");

  const [showButton, setShowButton] = useState(true);

  const nodeRef = useRef(null);

  const div2 = useRef([]);
  const div1 = useRef(null);

  const onScroll = () => {
    div2.current.forEach(current => {
      current.scrollLeft = div1.current?.scrollLeft || 0
    })
  }

  const handleClickOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseOpenModal = () => {
    setOpenModal(false);
  };

  const addNewReservation = (
    event,
    currentName,
    currentIdHotel,
    currentIdApartament,
    statusReserva,
    checkIn,
    checkOut
  ) => {
    debugger;
    event.preventDefault();

    const newCheckIn = `${formatDatePick(checkIn)}`;
    const newCheckOut = `${formatDatePick(checkOut)}`;

    const lastReservation = reservationList[reservationList.length - 1];
    const lastId = lastReservation ? lastReservation.IdReservation : 0;

    const newId = lastId + 1;

    const isDateAvaible = checkDate(newCheckIn, newCheckOut, currentIdHotel, currentIdApartament);

    if (!isDateAvaible) {
      alert("Esta data não está disponivel para reserva");
      return;
    }

    //Gerar ID do cliente dinamicamente
    const newReservation = {
      IdReservation: newId,
      IdCustomer: newId,
      CheckIn: newCheckIn,
      CheckOut: newCheckOut,
      IdHotel: currentIdHotel,
      Status: statusReserva,
      IdApartament: currentIdApartament,
    };

    const newCustomer = {
      IdCustomer: newId,
      NameCustomer: `Teste ${newId}`,
    }

    const newReservations = [...reservationList];
    const newCustomers = [...customerList];

    newReservations.push(newReservation);
    newCustomers.push(newCustomer);

    setReservationList(newReservations);
    setCustomerList(newCustomers)

    setOpenModal(false);
  };

  const formatDatePick = (date) => {
    const dataEntrada = date;
    // Crie um objeto Date com a data de entrada
    const data = new Date(dataEntrada);

    // Formate a data no formato desejado (YYYY-MM-DDTHH:mm:ss)
    const dataFormatada = `${data.getFullYear()}-${(data.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${data
        .getDate()
        .toString()
        .padStart(2, "0")}T12:00:00`;

    return dataFormatada;
  };

  const checkDate = (checkIn, checkOut, NewHotelId, idApartamentNew) => {
    debugger;
    const newCheckIn = checkIn;
    const newCheckOut = checkOut;

    for (const reservation of reservationList) {
      const currentReservationCheckIn = reservation.CheckIn;
      const currentReservationCheckOut = reservation.CheckOut;
      //To-Do: Verificar se IdHotel que queremos criar a reserva é igual, se sim entra para verificar a disponibilidade da data

      if (
        reservation.IdApartament === idApartamentNew &&
        reservation.IdHotel === NewHotelId
      ) {
        // O novo CheckIn pertence ao período desta reserva?
        if (
          reservation.CheckIn >= currentReservationCheckIn &&
          reservation.CheckIn <= currentReservationCheckOut
        )
          return false;

        if (
          reservation.CheckOut >= currentReservationCheckIn &&
          reservation.CheckOut <= currentReservationCheckOut
        )
          return false;
      }
    }
    return true;
  };

  const handleHotelChange = (e) => {
    debugger;
    const selectedHotelId = e.target.value;
    setCurrentIdHotelForm(selectedHotelId);

    const filteredApartaments = hotelList.filter(
      (hotel) => hotel.IdHotel === selectedHotelId
    );
    setFilteredApartaments(filteredApartaments[0].apartaments);

    // Também podemos limpar a seleção do quarto ao mudar de hotel
    setCurrentIdApartamentForm("");
  };

  const toggleAccordion = (index) => {
    setAccordionOpen((prev) => {
      return prev.map((accordionOpen, currentIndex) => {
        if (currentIndex === index) {
          return {
            isOpen: !accordionOpen.isOpen
          }
        }
        return accordionOpen;
      })
    });
  };

  const CheckApartament = (
    idApartament,
    idHotel,
    idHotelReservation,
    idApartamentReservation
  ) => {
    if (
      idApartament == idApartamentReservation &&
      idHotel == idHotelReservation
    ) {
      return true;
    }

    return false;
  };

  const getStatusColorAndName = (status) => {
    switch (status) {
      case "Bloqueado":
        return "solid 4px green";
      case "Confirmada":
        return "solid 4px blue";
      case "Manutenção":
        return "solid 4px #616161";
      case "Pendente":
        return "solid 4px yellow";
      case "Financeiro Aberto":
        return "solid 4px red";
      default:
        return { color: "", name: "" };
    }
  };

  const getNameByCustomerId = (idCustomer) => {
    const customerName = customerList.filter((customer) => {
      if (customer.IdCustomer === idCustomer) {
        return customer.NameCustomer;
      }
    });

    if (customerName[0]) return customerName[0].NameCustomer;

    return " ";
  };

  const convertCheckIn = (dateIn) => {
    let CheckIn = new Date(dateIn);
    let convertCheckIn = datasIntervalo.findIndex(
      (date) => date.getTime() === CheckIn.getTime()
    );

    return convertCheckIn;
  };

  useEffect(() => {
    setHotelList(HotelsModel);
    setAccordionOpen(HotelsModel.map(() => {
      return {
        isOpen: false
      }
    }));
    setReservationList(ReservationsModel);
    setCustomerList(CustomersModel);
  }, []);

  return (
    <main className={styles.main} style={{ backgroundColor: "white" }}>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: "10rem",
              backgroundColor: "#fff",
              borderRight: "solid 3px #ccc",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Dialog open={openModal} onClose={handleCloseOpenModal}>
              <DialogTitle style={{ textAlign: 'center' }}>Novo Hospede</DialogTitle>
              <DialogContent>
                <FormControl>
                  <div style={{ display: "flex" }}>
                    <div >
                      <span>Nome</span>
                      <TextField
                        style={{ width: "16rem", paddingRight: "1rem" }}
                        variant="outlined"
                        value={currentNameForm}
                        onChange={(e) => setCurrentNameForm(e.target.value)}
                      />
                    </div>
                    <div>
                      <span>Nome do Hotel</span>
                      <TextField
                        select
                        style={{ width: "16rem" }}
                        helperText="Selecione o nome do hotel"
                        value={currentIdHotelForm}
                        onChange={handleHotelChange}
                      >
                        {hotelList.map((option) => (
                          <MenuItem key={option.IdHotel} value={option.IdHotel}>
                            {option.HotelName}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingRight: "1rem",
                        width: '16rem'
                      }}
                    >
                      <span>Número do Quarto</span>
                      <TextField
                        select
                        helperText="Selecione o nome do quarto"
                        value={currentIdApartamentForm}
                        onChange={(e) =>
                          setCurrentIdApartamentForm(e.target.value)
                        }
                      >
                        {filteredApartaments.map((option) => (
                          <MenuItem
                            key={option.IdApartament}
                            value={option.IdApartament}
                          >
                            {option.NumberApartament}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", width: '16rem' }}>
                      <span>Status</span>
                      <TextField
                        select
                        helperText="Selecione o nome do quarto"
                        value={statusReservaForm}
                        onChange={(e) => setStatusReservaForm(e.target.value)}
                      >
                        {StatusModel.map((option) => (
                          <MenuItem key={option.value} value={option.status}>
                            {option.status}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ paddingRight: "1rem" }}>
                      <span>Check-In</span>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            value={checkInForm}
                            onChange={(newValue) => setCheckInForm(newValue)}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                    <div>
                      <span>Check-Out</span>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            value={checkOutForm}
                            onChange={(newValue) => setCheckOutForm(newValue)}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                  </div>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={(event) =>
                    addNewReservation(
                      event,
                      currentNameForm,
                      currentIdHotelForm,
                      currentIdApartamentForm,
                      statusReservaForm,
                      checkInForm,
                      checkOutForm
                    )
                  }
                >
                  Adicionar
                </Button>
                <Button onClick={handleCloseOpenModal}>Cancelar</Button>
              </DialogActions>
            </Dialog>
          </div>
          <div
            style={{
              display: "flex",
              width: "70rem",
              overflow: "auto",
              cursor: "pointer",
            }}
            onScroll={onScroll}
            ref={div1}
          // onMouseDown={handleMouseDownDiv}
          // onMouseMove={handleMouseMove}
          // onMouseUp={handleMouseUp}
          // onMouseLeave={handleMouseLeave}
          >
            <div className={styles.calendar}>
              <div className={styles.daysContainer}>
                {datasIntervalo.map((date, index) => (
                  <div
                    key={index}
                    className={`${styles.day} ${styles.draggingOver}`}
                    style={{
                      backgroundColor:
                        diasAbreviados[date.getDay()] === "Dom" ||
                          diasAbreviados[date.getDay()] === "Sáb"
                          ? "#F0F8FF"
                          : "white",
                    }}
                  >
                    <span style={{ userSelect: "none" }}>
                      {mesesAbreviados[date.getMonth()]}
                    </span>
                    <span style={{ textAlign: "center", userSelect: "none" }}>
                      {date.getDate()}
                    </span>
                    <span style={{ userSelect: "none" }}>
                      {diasAbreviados[date.getDay()]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {hotelList &&
        hotelList.map((hotel, index) => {
          return (
            <>
              <div
                onClick={() => toggleAccordion(index)}
                className={styles.toggleAccordion}
              >
                <ArrowDropDownIcon
                  style={{
                    transformOrigin: 'center',
                    transform: accordionOpen[index].isOpen ? 'rotate(0)' : 'rotate(-90deg)',
                    transition: 'transform 400ms ease-in-out'
                  }}
                >
                </ArrowDropDownIcon>
                {hotel.HotelName}
              </div>
              <Container>
                <CSSTransition
                  in={accordionOpen[index].isOpen}
                  nodeRef={nodeRef}
                  timeout={1000}
                  classNames="alert"
                  unmountOnExit
                  onEnter={() => setShowButton(false)}
                  onExited={() => setShowButton(true)}
                >
                  <div ref={nodeRef} style={{ display: "flex", flexDirection: "column" }}>
                    {hotel.apartaments.map((apartament, index) => {
                      return (
                        <div
                          key={index}
                          style={{ display: "flex" }}
                        >
                          <div className={styles.apartamentNumber}>
                            <Button id="basic-button" onClick={handleClickOpenModal}>
                              <AddIcon></AddIcon>
                            </Button>
                            <span>Quarto {apartament.NumberApartament}</span>
                          </div>

                          <div style={{ display: "flex", overflow: "hidden" }}
                            key={index}
                            ref={(element) => {
                              div2.current[index] = element
                            }}
                            onScroll={onScroll}
                          >
                            <div className={styles.calendar}>
                              <div className={styles.daysContainer}>
                                {datasIntervalo.map((date, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className={`${styles.day}`}

                                      style={{
                                        backgroundColor:
                                          diasAbreviados[date.getDay()] ===
                                            "Dom" ||
                                            diasAbreviados[date.getDay()] === "Sáb"
                                            ? "#F0F8FF"
                                            : "white",
                                      }}
                                    >
                                      <span className={styles.clipPath}>
                                        {mesesAbreviados[date.getMonth()]}
                                      </span>

                                      <span
                                        className={styles.clipPath}
                                        style={{ textAlign: "center" }}
                                      >
                                        {date.getDate()}
                                      </span>

                                      <span className={styles.clipPath}>
                                        {diasAbreviados[date.getDay()]}
                                      </span>
                                    </div>
                                  );
                                })}

                                {reservationList.map((reservation, indexador) => {
                                  const isThisAp = CheckApartament(
                                    apartament.IdApartament,
                                    hotel.IdHotel,
                                    reservation.IdHotel,
                                    reservation.IdApartament
                                  );
                                  return (
                                    isThisAp && (
                                      <div
                                        key={reservation.idHotelReservation}
                                        className={`${styles.guest} ${styles.draggingGuest}`}
                                        style={{
                                          left: `${convertCheckIn(reservation.CheckIn) * 60 + 25}px`,
                                          width: `${((convertCheckIn(reservation.CheckOut) + 1) - convertCheckIn(reservation.CheckIn)) * 60 - 30}px`,
                                          height: `${dayWidth / 2}px`,
                                          borderBottom: `${getStatusColorAndName(
                                            reservation.Status
                                          )}`,
                                          cursor: "move",
                                          display: "flex",
                                          position: "absolute",
                                          justifyContent: "space-between",
                                        }}

                                      >
                                        <div
                                          className={styles.checkInOut}
                                          style={{
                                            left: `0`,
                                            cursor: "col-resize",
                                            background: "#94bce7",
                                            height: "100%",
                                            width: "3px",
                                          }}
                                          onMouseDown={(e) =>
                                            handleMouseDown(e, true, reservation)
                                          }
                                        ></div>
                                        <span>
                                          {getNameByCustomerId(
                                            reservation.IdCustomer
                                          )}
                                        </span>
                                        <span style={{ fontSize: "10px" }}>
                                          {reservation.Cliente}
                                        </span>
                                        <div
                                          className={styles.checkInOut}
                                          style={{
                                            left: `0`,
                                            cursor: "col-resize",
                                            background: "#94bce7",
                                            height: "100%",
                                            width: "3px",
                                          }}
                                          onMouseDown={(e) => {
                                            handleMouseDownDiv(e);
                                            handleMouseDown(
                                              e,
                                              false,
                                              reservation
                                            );
                                          }}
                                        ></div>
                                      </div>
                                    )
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CSSTransition>
              </Container>
            </>
          );
        })}
      <div
        style={{
          display: "flex",
          background: "white",
          padding: "4rem",
          justifyContent: "space-evenly",
          border: "1px solid #ccc",
          margin: "2rem",
        }}
      >
        <div>
          <SquareIcon style={{ fontSize: "15px", color: "green" }}></SquareIcon>
          <span style={{ fontSize: "13px" }}>Bloqueada</span>
        </div>
        <div>
          <SquareIcon style={{ fontSize: "15px", color: "blue" }}></SquareIcon>
          <span style={{ fontSize: "13px" }}>Confirmada</span>
        </div>
        <div>
          <SquareIcon
            style={{ fontSize: "15px", color: "#616161" }}
          ></SquareIcon>
          <span style={{ fontSize: "13px" }}>Manutenção</span>
        </div>
        <div>
          <SquareIcon
            style={{ fontSize: "15px", color: "yellow" }}
          ></SquareIcon>
          <span style={{ fontSize: "13px" }}>Pendente</span>
        </div>
        <div>
          <CircleIcon style={{ fontSize: "15px", color: "red" }}></CircleIcon>
          <span style={{ fontSize: "13px" }}>Financeiro Aberto</span>
        </div>
      </div>
    </main>
  );
}
