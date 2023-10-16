document.addEventListener("DOMContentLoaded", function () {

  const datiMemorizzati = localStorage.getItem("postazione");
  let postazione = null;

  if (datiMemorizzati) {
    postazione = JSON.parse(datiMemorizzati);
    console.log("info postazione selezionata: ", postazione);
  } else {
    console.log("I dati non sono stati trovati in localStorage");
  }

  document.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const dataOdierna = new Date();
    const giorno = dataOdierna.getDate();
    const mese = dataOdierna.getMonth() + 1;
    const anno = dataOdierna.getFullYear();

    const nome = formData.get("name");
    const cognome = formData.get("lastname");
    const email = formData.get("email");
    const dataPrenotata = formatDate(formData.get("dataPrenotata"));

    const prenotazioneForm = {
      dipendente: {
        name: nome,
        lastname: cognome,
        email: email,
      },
      postazione: postazione,
      dataPrenotata: formatDate(dataPrenotata),
      dataPrenotazione: `${anno}-${mese}-${giorno}`,
    };

    console.log("dataPrenotata: ", prenotazioneForm.dataPrenotata);
    console.log("dati prenotazione: ", prenotazioneForm);
    prenotaPostazione();
  });
});


const prenotaPostazione = async () => {
  
}





function formatDate(inputDate) {
  
  const parts = inputDate.split("-");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    // Restituisce la data nel formato "aaaa-mm-gg"
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  
  return inputDate;
}
