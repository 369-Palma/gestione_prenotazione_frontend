document.addEventListener("DOMContentLoaded", function () {

  getPostazioni();

  document
    .getElementById("cercaForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(event.target);
      const citta = formData.get("name");
      const tipo = formData.get("tipo");
      console.log("Il tipo selezionato è: ", tipo);

      if (!tipo || tipo === "tipo") {
        alert("Seleziona un tipo di postazione valido");
        return;
      }

      getPostazioniDisponibili(citta, tipo);
    });
});

document.addEventListener("click", function (event) {
  console.log("evento attivato al click");
  if (event.target.classList.contains(`prenotaButtonJs`)) {
    const postazione = {
      id: event.target.dataset.postazioneId,
  codice: event.target.dataset.postazioneCodice,
  descrizione: event.target.dataset.postazioneDescrizione,
  maxOccupanti: event.target.dataset.postazioneMaxoccupanti,
  tipo: event.target.dataset.postazioneTipo,
  building: {
    id: event.target.dataset.postazioneBuilding,
    name: event.target.dataset.postazioneName,
    address: event.target.dataset.postazioneAddress,
    citta: {
      id: event.target.dataset.postazioneCittaId,
      name: event.target.dataset.postazioneCitta,
    },
  },
    };
    console.log("La postazione selezionata è: ", postazione);
    //converto l'oggetto postazione in formato JSON e poi salvo le info nel localStorage
    const postazioneJSON = JSON.stringify(postazione);
    localStorage.setItem(`postazione`, postazioneJSON);

    console.log("postazioneJSON: ", postazioneJSON);
  }
});
const tableElement = document.getElementById("risultatiLista");
const ulElement = document.getElementById("lista");

async function getPostazioni() {
  try {
    let res = await fetch(`http://localhost:8081/api/postazione/pageable`);
    if (!res.ok) {
      throw new Error("Errore nella richiesta API");
    } else {
      let data = await res.json();
      console.log("data: ", data.content);

      let tableElement = document.getElementById("risultatiLista");

      while (tableElement.firstChild) {
        tableElement.removeChild(tableElement.firstChild);
      }

      if (data.content.length === 0) {
        tableElement.style.display = "none";
      } else {
        tableElement.style.display = "table";

        const theadElement = document.createElement("thead");

        theadElement.innerHTML = `
      <tr>
         <th class="intestazione"> <strong>Codice</strong> </th>
         <th class="intestazione"> <strong>Descrizione</strong> </th>
         <th class="intestazione"> <strong>N° Max</strong> </th>
         <th class="intestazione"> <strong>Disponibile</strong> </th>
         <th class="intestazione"> <strong>Tipo</strong> </th>
         <th class="intestazione"> <strong>Edificio</strong> </th>
         <th class="intestazione"> <strong>Indirizzo</strong> </th>
         <th class="intestazione"> <strong>Città</strong> </th>
      </tr>
      `;

        tableElement.appendChild(theadElement);

        data.content.forEach((item) => {
          const trElement = document.createElement("tr");
          trElement.innerHTML = `
            <td>${item.codice}</td>
            <td>${item.descrizione}</td>
            <td>${item.maxOccupanti}</td>
            <td>${item.available ? "Sì" : "No"}</td>
            <td>${item.tipo}</td>
            <td>${item.building.name}</td>
            <td>${item.building.address}</td>
            <td>${item.building.citta.name}</td>
            <td> <a href="prenotazionePage.html"> <button class="bottoneSubmit prenotaButtonJs" data-postazione-id="${
              item.id
            }" data-postazione-codice="${item.codice}"
            data-postazione-descrizione="${item.descrizione}"
            data-postazione-maxoccupanti="${item.maxOccupanti}"
            data-postazione-tipo="${item.tipo}"
            data-postazione-building="${item.building.id}"
            data-postazione-name="${item.building.name}"
            data-postazione-address="${item.building.address}"
            data-postazione-citta-id="${item.building.citta.id}"
            data-postazione-citta="${
              item.building.citta.name
            }"> Prenota </button> </a></td>
          `;

          tableElement.appendChild(trElement);
        });
      }

      const ulElement = document.getElementById("lista");

      // Itera attraverso i dati e crea gli elementi <li> con le informazioni richieste
      data.content.forEach((item) => {
        const liElement = document.createElement("li");

        // Creazione della riga con le informazioni
        const row = document.createElement("div");
        row.innerHTML = `
          <div class="listaRis">
          <div>
          <strong>ID:</strong> ${item.id}<br>
          <strong>Codice:</strong> ${item.codice}<br>
          <strong>Descrizione:</strong> ${item.descrizione}<br>
          <strong>Numero Max Occupanti:</strong> ${item.maxOccupanti}<br>
          <strong>Disponibile:</strong> ${item.available ? "Sì" : "No"}<br>
          <strong>Tipo:</strong> ${item.tipo}<br>
          <strong>Edificio:</strong> ${item.building.name}<br>
          <strong>Indirizzo:</strong> ${item.building.address}<br>
          <strong>Città:</strong> ${item.building.citta.name}<br>
          </div>
          <a href="prenotazionePage.html"> <button class="bottoneSubmit prenotaButtonJs" data-postazione-id="${
            item.id
          }" data-postazione-codice="${item.codice}"
          data-postazione-descrizione="${item.descrizione}"
          data-postazione-maxoccupanti="${item.maxOccupanti}"
          data-postazione-tipo="${item.tipo}"
          data-postazione-building="${item.building.id}"
          data-postazione-name="${item.building.name}"
          data-postazione-address="${item.building.address}"
          data-postazione-citta-id="${item.building.citta.id}"
          data-postazione-citta="${
            item.building.citta.name
          }"> Prenota </button> </a>
          </div>
        `;

        // Aggiungi la riga al <li>
        liElement.appendChild(row);

        ulElement.appendChild(liElement);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

/* GET POSTAZIONI CON I CRITERI INDICATI DALL'UTENTE */

async function getPostazioniDisponibili(citta, tipo) {
  const tableElement = document.getElementById("risultatiLista");
  const ulElement = document.getElementById("lista");

  try {
    tableElement.innerHTML = "";
    ulElement.innerHTML = "";
    let res = await fetch(
      `http://localhost:8081/api/postazione/citta/${citta}/tipo/${tipo}`
    );
    console.log("Response status:", res.status);
    if (res.ok) {
      let data = await res.json();
      console.log("data con parametri: citta e tipo", data);

      /* NUOVO ELEMENTO TABELLA */

      if (data.content.length === 0) {
        //tableElement.style.display = "none";
        tableElement.innerHTML = `
        <p> Non ci sono elementi nel database con i criteri selezionati. 
        Effettua una ricerca in un altra città o seleziona un'altro tipo di postazione </p>
        `;
      } else {
        tableElement.style.display = "table";

        const theadElement = document.createElement("thead");

        theadElement.innerHTML = `
          <tr>
             <th> <strong>Codice</strong> </th>
             <th> <strong>Descrizione</strong> </th>
             <th> <strong>N° Max</strong> </th>
             <th> <strong>Disponibile</strong> </th>
             <th> <strong>Tipo</strong> </th>
             <th> <strong>Edificio</strong> </th>
             <th> <strong>Indirizzo</strong> </th>
             <th> <strong>Città</strong> </th>
          </tr>
          `;

        tableElement.appendChild(theadElement);

        data.content.forEach((item) => {
          const trElement = document.createElement("tr");
          trElement.innerHTML = `
              <td>${item.codice}</td>
              <td>${item.descrizione}</td>
              <td>${item.maxOccupanti}</td>
              <td>${item.available ? "Sì" : "No"}</td>
              <td>${item.tipo}</td>
              <td>${item.building.name}</td>
              <td>${item.building.address}</td>
              <td>${item.building.citta.name}</td>
              <td><a href="prenotazionePage.html"> <button class="bottoneSubmit prenotaButtonJs" data-postazione-id="${
                item.id
              }" data-postazione-codice="${item.codice}"
              data-postazione-descrizione="${item.descrizione}"
              data-postazione-maxoccupanti="${item.maxOccupanti}"
              data-postazione-tipo="${item.tipo}"
              data-postazione-building="${item.building.id}"
              data-postazione-name="${item.building.name}"
              data-postazione-address="${item.building.address}"
              data-postazione-citta-id="${item.building.citta.id}"
              data-postazione-citta="${item.building.citta.name}"
              > Prenota </button> </a></td>
            `;

          tableElement.appendChild(trElement);
        });
      }

      /*  NUOVO ELEMENTO LISTA  */
      const ulElement = document.getElementById("lista");

      data.content.forEach((item) => {
        const liElement = document.createElement("li");

        const row = document.createElement("div");
        row.innerHTML = `
          <div class="listaRis">
          <div>
          <strong>ID:</strong> ${item.id}<br>
          <strong>Codice:</strong> ${item.codice}<br>
          <strong>Descrizione:</strong> ${item.descrizione}<br>
          <strong>Numero Max Occupanti:</strong> ${item.maxOccupanti}<br>
          <strong>Disponibile:</strong> ${item.available ? "Sì" : "No"}<br>
          <strong>Tipo:</strong> ${item.tipo}<br>
          <strong>Edificio:</strong> ${item.building.name}<br>
          <strong>Indirizzo:</strong> ${item.building.address}<br>
          <strong>Città:</strong> ${item.building.citta.name}<br>
          </div>
          <a href="prenotazionePage.html"> <button class="bottoneSubmit prenotaButtonJs" data-postazione-id="${
            item.id
          }" data-postazione-codice="${item.codice}"
          data-postazione-descrizione="${item.descrizione}"
          data-postazione-maxoccupanti="${item.maxOccupanti}"
          data-postazione-tipo="${item.tipo}"
          data-postazione-building="${item.building.id}"
          data-postazione-name="${item.building.name}"
          data-postazione-address="${item.building.address}"
          data-postazione-citta-id="${item.building.citta.id}"
          data-postazione-citta="${
            item.building.citta.name
          }"> Prenota </button> </a>
          </div>
        `;

        liElement.appendChild(row);

        ulElement.appendChild(liElement);
      });
    }
  } catch (error) {
    console.error(error);
  }
}
