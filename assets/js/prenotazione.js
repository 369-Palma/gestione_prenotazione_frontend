document.addEventListener("DOMContentLoaded", function () {
  const datiPostazione = localStorage.getItem("postazione");
  let postazione = null;

const datiDipendente = localStorage.getItem("newDipendente");
let dipendente = null;


  if (datiPostazione && datiDipendente) {
    postazione = JSON.parse(datiPostazione);
    dipendente = JSON.parse(datiDipendente);
    console.log("Info postazione selezionata:", postazione);
    console.log("Info dipendente:", dipendente);
  } else {
    console.log("I dati non sono stati trovati in localStorage");
  }

  const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwYWxtYUBob3RtYWlsLml0IiwiaWF0IjoxNjk3ODAwMjEzLCJleHAiOjE3MTM1NzkwMTN9.Ets5KyYK9JiyIEwBlAxaJqzFflB16DoECe_h06xoCuj42HTX3ZY1KrXYoUir913tFUrsxflCetuBRTVaF-qOeA";

  document.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const dataOdierna = new Date();
    const giorno = dataOdierna.getDate();
    const mese = dataOdierna.getMonth() + 1;
    const anno = dataOdierna.getFullYear();

const dataPrenotata = formData.get("dataPrenotata");
   /*  const nome = formData.get("name");
    const cognome = formData.get("lastname");
    const email = formData.get("email");
    

    // Step 1: Creazione del dipendente
    const dipendente = {
      name: nome,
      lastname: cognome,
      email: email
    };
    const newDipendenteId = await aggiungiDipendente(dipendente);
    if (newDipendenteId) {
    // Step 2: Ricerca dell'ID del dipendente tramite email
    const dipendenteId = await getDipendenteIdByEmail(email); */

    // Step 3: Aggiornamento dei dati nel body della prenotazione (prenotazioneForm)
    
    const prenotazioneForm = {
      postazione: postazione,
      dipendente: dipendente,
      dataPrenotata: dataPrenotata,
      dataPrenotazione: `${anno}-${mese}-${giorno}`,
    };

    console.log("Dati di prenotazione:", prenotazioneForm);

    // Step 4: Esecuzione della fetch per creare la prenotazione
    const newPrenotazione = await prenotaPostazione(prenotazioneForm);
  })

  function formatDate(inputDate) {
    const parts = inputDate.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      // Restituisce la data nel formato "aaaa-mm-gg"
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return inputDate;
  }

  /* async function aggiungiDipendente(dipendente) {
    try {
      let res = await fetch("http://localhost:8081/api/dipendente", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dipendente),
      });
      if (res.ok) {
        console.log("Dipendente aggiunto:", dipendente);
        const responseJson = await res.json();
        return responseJson.id; 
      } else {
        console.log("Errore durante l'aggiunta del Dipendente.");
        return null;
      }
    } catch (error) {
      console.error("C'è stato un errore durante la richiesta di creazione del Dipendente:", error);
      return null;
    }
  } */

/*   async function getDipendenteIdByEmail(email) {
    try {
      const response = await fetch(`http://localhost:8081/api/dipendente/dipendenteid/email/${email}`);
      if (response.ok) {
        const id = await response.json();
        console.log("ID del dipendente trovato per email:", id);
        return id;
      }
    } catch (error) {
      console.error("Errore durante il recupero dell'ID del dipendente:", error);
    }
    return null;
  } */

  async function prenotaPostazione(prenotazioneForm) {
    try {
      let res = await fetch("http://localhost:8081/api/prenotazione", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(prenotazioneForm),
      });
      if (res.ok) {
        console.log("Dati prenotazione:", prenotazioneForm);
        alert("Registrazione avvenuta con successo!");
      } else if (res.status === 400) {
        const errorMessage = await res.text();
        alert(errorMessage);
      } else {
        alert("Errore sconosciuto");
      }
    } catch (error) {
      console.log("C'è stato un errore nel contattare il server:", error);
    }
  }
})