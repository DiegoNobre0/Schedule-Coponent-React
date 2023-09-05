function Modal() {
  <Dialog open={openModal} onClose={handleCloseOpenModal}>
    <DialogTitle>Novo Hospede</DialogTitle>
    <DialogContent>
      <FormControl>
        <div style={{ display: "flex" }}>
          <div>
            <span>Nome</span>
            <TextField
              variant="outlined"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div>
            <span>Nome do Hotel</span>
            <TextField
              select
              helperText="Selecione o nome do hotel"
              value={nomeHotel}
              onChange={(e) => setNomeHotel(e.target.value)}
            >
              {HotelsModel.map((option) => (
                <MenuItem key={option.IdHotel} value={option.HotelName}>
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
              paddingRight: "2rem",
            }}
          >
            <span>Nome do Quarto</span>
            <TextField
              select
              helperText="Selecione o nome do quarto"
              value={nomeQuarto}
              onChange={(e) => setNomeQuarto(e.target.value)}
            >
              {bedRooms.map((option) => (
                <MenuItem key={option.IdImovel} value={option.IdImovel}>
                  {option.NomeQuarto}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>Status</span>
            <TextField
              select
              helperText="Selecione o nome do quarto"
              value={statusReserva}
              onChange={(e) => setStatusReserva(e.target.value)}
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
          <div>
            <span>Check-In</span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  value={checkIn}
                  onChange={(newValue) => setCheckIn(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <div>
            <span>Check-Out</span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  value={checkOut}
                  onChange={(newValue) => setCheckOut(newValue)}
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
          addReservation(
            event,
            nome,
            nomeHotel,
            nomeQuarto,
            statusReserva,
            checkIn,
            checkOut
          )
        }
      >
        Adicionar
      </Button>
      <Button onClick={handleCloseOpenModal}>Cancelar</Button>
    </DialogActions>
  </Dialog>;
}
