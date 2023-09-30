const datiMemorizzati = localStorage.getItem("postazione");

if (datiMemorizzati) {
  const postazione = JSON.parse(datiMemorizzati);
  console.log("info postazione selezionata: ", postazione);
} else {
  console.log("I dati non sono stati trovati in localStorage");
}
