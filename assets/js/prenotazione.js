document.addEventListener("DOMContentLoaded", function () {

  const datiPostazione = localStorage.getItem("postazione");
  let postazione = null;

  if (datiPostazione) {
    postazione = JSON.parse(datiPostazione);
    console.log("Info postazione selezionata:", postazione);
  } else {
    console.log("I dati non sono stati trovati in localStorage");
  }

  const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwYW1AYWlvby5pdCIsImlhdCI6MTY5ODc2MjUxNSwiZXhwIjoxNzE0NTQxMzE1fQ.f3YAq0Z-lFtnLF9bOvIfc-_FeNZJpMpO66GOS-PU54nWjy0mGOe3eP6bvrG0MOOdUsU1lhyPDaoXzIbCjue6MQ";

  document.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const dataOdierna = new Date();
    const giorno = dataOdierna.getDate().toString().padStart(2, '0');
const mese = (dataOdierna.getMonth() + 1).toString().padStart(2, '0');
const anno = dataOdierna.getFullYear();

const dataPrenotata = formData.get("dataPrenotata");
    const nome = formData.get("name");
    const cognome = formData.get("lastname");
    const email = formData.get("email");
    

    // Creo l'oggetto dipendente con i dati del form come valori delle proprietà
    const dipendente = {
      name: nome,
      lastname: cognome,
      email: email
    };

    // creo nuovo dipendente nel db e salvo il suo id
    const dipendenteId = await aggiungiDipendente(dipendente);

    //leggo l'oggetto dipendente cercandolo per il suo id
    const newDipendente = await getNewDipendente(dipendenteId);
    
    //Aggiorno dati del corpo della chiamata per prenotazione
    const prenotazioneForm = {
      postazione: postazione,
      dipendente: newDipendente,
      dataPrenotata: dataPrenotata,
      dataPrenotazione: `${anno}-${mese}-${giorno}`,
    };

    console.log("Dati di prenotazione:", prenotazioneForm);

    // Creazione della prenotazione
    const newPrenotazione = await prenotaPostazione(prenotazioneForm);
  })


/* FUNZIONI PER FORMATO DATI E CHIAMTE AL SERVER */

  function formatDate(inputDate) {
    const parts = inputDate.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      // Restituisce la data nel formato "aaaa-mm-gg"
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return inputDate;
  }

  function formatDateToDDMMYYYY(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  async function aggiungiDipendente(dipendente) {
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
  }

  const getNewDipendente = async (dipendenteId) => {
    try {
        const res = await fetch(`http://localhost:8081/api/dipendente/id/${dipendenteId}`);
        if (res.ok) {
            const newDipendente = await res.json();
            console.log("ricerca dipendente tramite id. Dipendente trovato: ", newDipendente);
            return newDipendente; 
        } else {
            console.error("Errore durante la ricerca del Dipendente tramite id.");
            return null;
        }
    } catch (error) {
        console.error("C'è stato un errore durante la richiesta del Dipendente tramite id:", error);
        return null;
    }
}

  async function prenotaPostazione(prenotazioneForm) {
    const recapPrenotazione = document.getElementById("recap")
const main = document.getElementById("main")
const formPrenotazione= document.getElementById("prenotaForm")
    try {
      let res = await fetch("http://localhost:8081/api/prenotazione/prenota", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(prenotazioneForm),
      });
      if (res.ok) {
        console.log("Dati prenotazione:", prenotazioneForm);
        alert("Prenotazione avvenuta con successo!");
        const dataPrenotataFormatted = formatDateToDDMMYYYY(prenotazioneForm.dataPrenotata);
        formPrenotazione.style.display = "none";
        recapPrenotazione.style.display = "block";
        recapPrenotazione.innerHTML = `
        <h2> La tua prenotazione </h2>
        <p> Gentile ${prenotazioneForm.dipendente.lastname} ${prenotazioneForm.dipendente.name} </br>
        ti aspettiamo a   ${prenotazioneForm.postazione.building.name} </br>
        presso ${prenotazioneForm.postazione.building.address} a ${prenotazioneForm.postazione.building.citta.name} </br>
        il ${dataPrenotataFormatted}.
        </p>
        `
        main.appendChild(recapPrenotazione);

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