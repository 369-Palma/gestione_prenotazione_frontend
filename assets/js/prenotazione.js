document.addEventListener("DOMContentLoaded", function () {
  const datiMemorizzati = localStorage.getItem("postazione");
  let postazione = null;

  if (datiMemorizzati) {
    postazione = JSON.parse(datiMemorizzati);
    console.log("info postazione selezionata: ", postazione);
  } else {
    console.log("I dati non sono stati trovati in localStorage");
  }

  const token = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJwYW1AYWlvby5pdCIsImlhdCI6MTY5NzQ3NzcyMiwiZXhwIjoxNzEzMjU2NTIyfQ.HbaPzWePezaMQ7bivaqmIZ4yWnaE7EIN1DKGvVoMN9kf2CobFsQcD2TzklTQO7Ei";

  document.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const dataOdierna = new Date();
    const giorno = dataOdierna.getDate();
    const mese = dataOdierna.getMonth() + 1;
    const anno = dataOdierna.getFullYear();

    const nome = formData.get("name");
    const cognome = formData.get("lastname");
    const email = formData.get("email");
    const dataPrenotata = formData.get("dataPrenotata");

    const dipendente = {
      name: nome,
      lastname: cognome,
      email: email
    };
    const newDipendente = await aggiungiDipendente(dipendente);
    const dipendenteId = await getDipendenteIdByEmail(email);

    if (newDipendente) {
      const prenotazioneForm = {
        dipendente: {
        dipendenteId: dipendenteId,
        name: nome,
        lastname: cognome,
        email: email
      },
      postazione: postazione,
       // postazioneId: postazione.id,
       dataPrenotata: formatDate(dataPrenotata),
      dataPrenotazione: `${anno}-${mese}-${giorno}`,
      };

      console.log("dati di prenotazione: ", prenotazioneForm);

      prenotaPostazione(prenotazioneForm);
    }
  });

  async function getDipendenteIdByEmail(email) {
    try {
      const response = await fetch(`http://localhost:8081/api/dipendente/dipendenteid/email/${email}`);
      if (response.ok) {
        const id = await response.json();
        console.log("id dipendente trovato per email:", id);
        return id;
      }
    } catch (error) {
      console.error("Errore durante il recupero dell'ID del dipendente:", error);
    }
    return null;
  }

  async function prenotaPostazione(prenotazioneForm) {
    try {
      let res = await fetch(`http://localhost:8081/api/prenotazione`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(prenotazioneForm),
      });
      if (res.ok) {
        console.log("dati prenotazione:", prenotazioneForm);
        alert("Registrazione avvenuta con successo!");
      }
    } catch (error) {
      console.log("C'è stato un errore nel contattare il server:", error);
    }
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

  async function aggiungiDipendente(dipendente) {
    try {
      let res = await fetch(`http://localhost:8081/api/dipendente`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dipendente),
      });
      if (res.ok) {
        console.log("dipendente aggiunto:", dipendente);
      }
    } catch (error) {
      console.log("cambia lavoro!");
    }
  }
});