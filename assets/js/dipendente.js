document.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const nome = formData.get("name");
    const cognome = formData.get("lastname");
    const email = formData.get("email");

    

    const dipendente = {
        name: nome,
        lastname: cognome,
        email: email
      };
      const dipendenteId = await aggiungiDipendente(dipendente);
      
       
      //const dipendenteId = await getDipendenteIdByEmail(email);
      
      
      const newDipendente = await getNewDipendente(dipendenteId);
        
      const dipendenteJSON = JSON.stringify(newDipendente);
    
    localStorage.setItem(`newDipendente`, dipendenteJSON);
    console.log("dipendenteJSON: ", dipendenteJSON);
     
    window.location.href = "prenotazionePage.html";
    })

      async function aggiungiDipendente(dipendente) {
        const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwYWxtYUBob3RtYWlsLml0IiwiaWF0IjoxNjk3ODAwMjEzLCJleHAiOjE3MTM1NzkwMTN9.Ets5KyYK9JiyIEwBlAxaJqzFflB16DoECe_h06xoCuj42HTX3ZY1KrXYoUir913tFUrsxflCetuBRTVaF-qOeA";
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
            alert("Utente salvato con successo!")
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