
/* =========================================================
   MON LIVRE PRIVÉ
   SCRIPT PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     RÉGLAGES
  ======================================================= */

  const CODE_ACCES = "Maperledamour";

  const STORAGE_KEY = "monLivrePrive_chapitres";

  let chapitreEnCoursId = null;
  let fichierImporte = null;


  /* =======================================================
     ÉLÉMENTS
  ======================================================= */

  const screens = document.querySelectorAll(".screen");

  const lockScreen = document.getElementById("lockScreen");
  const homeScreen = document.getElementById("homeScreen");
  const editorScreen = document.getElementById("editorScreen");
  const chaptersScreen = document.getElementById("chaptersScreen");
  const readerScreen = document.getElementById("readerScreen");
  const backupScreen = document.getElementById("backupScreen");

  const accessCode = document.getElementById("accessCode");
  const unlockBtn = document.getElementById("unlockBtn");
  const codeError = document.getElementById("codeError");

  const lockBtn = document.getElementById("lockBtn");

  const newChapterBtn = document.getElementById("newChapterBtn");
  const chaptersBtn = document.getElementById("chaptersBtn");
  const backupBtn = document.getElementById("backupBtn");

  const backHomeBtns = document.querySelectorAll(".back-home-btn");

  const chapterNumber = document.getElementById("chapterNumber");
  const chapterTitle = document.getElementById("chapterTitle");
  const chapterText = document.getElementById("chapterText");

  const saveChapterBtn = document.getElementById("saveChapterBtn");
  const deleteChapterBtn = document.getElementById("deleteChapterBtn");
  const editorHeading = document.getElementById("editorHeading");
  const saveMessage = document.getElementById("saveMessage");

  const searchChapterNumber =
    document.getElementById("searchChapterNumber");

  const searchChapterBtn =
    document.getElementById("searchChapterBtn");

  const chaptersList =
    document.getElementById("chaptersList");

  const readerHomeBtn =
    document.getElementById("readerHomeBtn");

  const readerListBtn =
    document.getElementById("readerListBtn");

  const previousChapterBtn =
    document.getElementById("previousChapterBtn");

  const nextChapterBtn =
    document.getElementById("nextChapterBtn");

  const readerChapterNumber =
    document.getElementById("readerChapterNumber");

  const readerChapterTitle =
    document.getElementById("readerChapterTitle");

  const readerChapterText =
    document.getElementById("readerChapterText");

  const saveReaderBtn =
    document.getElementById("saveReaderBtn");

  const readerSaveMessage =
    document.getElementById("readerSaveMessage");

  const exportBtn =
    document.getElementById("exportBtn");

  const importFile =
    document.getElementById("importFile");

  const importModal =
    document.getElementById("importModal");

  const mergeImportBtn =
    document.getElementById("mergeImportBtn");

  const replaceImportBtn =
    document.getElementById("replaceImportBtn");

  const cancelImportBtn =
    document.getElementById("cancelImportBtn");

  const deleteModal =
    document.getElementById("deleteModal");

  const confirmDeleteBtn =
    document.getElementById("confirmDeleteBtn");

  const cancelDeleteBtn =
    document.getElementById("cancelDeleteBtn");


  /* =======================================================
     GESTION DES ÉCRANS
  ======================================================= */

  function showScreen(screen) {

    screens.forEach(item => {
      item.classList.remove("active");
    });

    screen.classList.add("active");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  /* =======================================================
     STOCKAGE
  ======================================================= */

  function getChapitres() {

    const data =
      localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    try {

      const parsed =
        JSON.parse(data);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed;

    } catch (error) {

      console.error(
        "Erreur lecture stockage :",
        error
      );

      return [];
    }
  }


  function saveChapitres(chapitres) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(chapitres)
    );
  }


  function trierChapitres(chapitres) {

    return [...chapitres].sort((a, b) => {

      const numA =
        Number(a.numero) || 0;

      const numB =
        Number(b.numero) || 0;

      return numA - numB;
    });
  }


  /* =======================================================
     IDENTIFIANTS
  ======================================================= */

  function creerId() {

    return (
      "chap-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2, 9)
    );
  }


  /* =======================================================
     CONNEXION
  ======================================================= */

  function verifierCode() {

    const code =
      accessCode.value.trim();

    if (code === CODE_ACCES) {

      codeError.textContent = "";

      accessCode.value = "";

      sessionStorage.setItem(
        "monLivrePrive_deverrouille",
        "true"
      );

      showScreen(homeScreen);

      return;
    }

    codeError.textContent =
      "Code incorrect.";

    accessCode.select();
  }


  unlockBtn.addEventListener(
    "click",
    verifierCode
  );


  accessCode.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        verifierCode();
      }
    }
  );


  /* =======================================================
     VERROUILLAGE
  ======================================================= */

  function verrouiller() {

    sessionStorage.removeItem(
      "monLivrePrive_deverrouille"
    );

    chapitreEnCoursId = null;

    showScreen(lockScreen);

    setTimeout(() => {
      accessCode.focus();
    }, 100);
  }


  lockBtn.addEventListener(
    "click",
    verrouiller
  );


  /* =======================================================
     ACCUEIL
  ======================================================= */

  backHomeBtns.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        chapitreEnCoursId = null;

        showScreen(homeScreen);
      }
    );
  });


  newChapterBtn.addEventListener(
    "click",
    ouvrirNouveauChapitre
  );


  chaptersBtn.addEventListener(
    "click",
    () => {

      afficherListeChapitres();

      showScreen(chaptersScreen);
    }
  );


  backupBtn.addEventListener(
    "click",
    () => {

      showScreen(backupScreen);
    }
  );


  /* =======================================================
     NOUVEAU CHAPITRE
  ======================================================= */

  function ouvrirNouveauChapitre() {

    chapitreEnCoursId = null;

    editorHeading.textContent =
      "Nouveau chapitre";

    chapterNumber.value = "";

    chapterTitle.value = "";

    chapterText.value = "";

    saveMessage.textContent = "";

    deleteChapterBtn.classList.add(
      "hidden"
    );

    showScreen(editorScreen);

    setTimeout(() => {
      chapterNumber.focus();
    }, 100);
  }


  /* =======================================================
     ENREGISTRER NOUVEAU CHAPITRE
  ======================================================= */

  saveChapterBtn.addEventListener(
    "click",
    () => {

      const numero =
        Number(chapterNumber.value);

      const titre =
        chapterTitle.value.trim();

      const texte =
        chapterText.value;

      if (!numero || numero < 1) {

        saveMessage.textContent =
          "Indiquez un numéro de chapitre.";

        return;
      }

      if (!titre) {

        saveMessage.textContent =
          "Indiquez un titre.";

        return;
      }

      let chapitres =
        getChapitres();

      if (!chapitreEnCoursId) {

        const existeDeja =
          chapitres.some(
            chapitre =>
              Number(chapitre.numero)
              === numero
          );

        if (existeDeja) {

          saveMessage.textContent =
            "Un chapitre avec ce numéro existe déjà.";

          return;
        }

        const nouveauChapitre = {

          id: creerId(),

          numero,

          titre,

          texte,

          creeLe:
            new Date().toISOString(),

          modifieLe:
            new Date().toISOString()
        };

        chapitres.push(
          nouveauChapitre
        );

        saveChapitres(
          chapitres
        );

        chapitreEnCoursId =
          nouveauChapitre.id;

        saveMessage.textContent =
          "Chapitre enregistré.";

        deleteChapterBtn
          .classList
          .remove("hidden");

        editorHeading.textContent =
          "Modifier le chapitre";

        return;
      }


      const index =
        chapitres.findIndex(
          chapitre =>
            chapitre.id
            === chapitreEnCoursId
        );

      if (index === -1) {
        return;
      }

      const numeroUtilise =
        chapitres.some(
          chapitre =>
            chapitre.id
            !== chapitreEnCoursId
            &&
            Number(chapitre.numero)
            === numero
        );

      if (numeroUtilise) {

        saveMessage.textContent =
          "Ce numéro est déjà utilisé.";

        return;
      }

      chapitres[index].numero =
        numero;

      chapitres[index].titre =
        titre;

      chapitres[index].texte =
        texte;

      chapitres[index].modifieLe =
        new Date().toISOString();

      saveChapitres(
        chapitres
      );

      saveMessage.textContent =
        "Modifications enregistrées.";
    }
  );


  /* =======================================================
     LISTE DES CHAPITRES
  ======================================================= */

  function afficherListeChapitres() {

    chaptersList.innerHTML = "";

    const chapitres =
      trierChapitres(
        getChapitres()
      );

    if (chapitres.length === 0) {

      const empty =
        document.createElement("div");

      empty.className =
        "empty-list";

      empty.textContent =
        "Aucun chapitre pour le moment.";

      chaptersList.appendChild(
        empty
      );

      return;
    }

    chapitres.forEach(
      chapitre => {

        const button =
          document.createElement(
            "button"
          );

        button.className =
          "chapter-item";

        const info =
          document.createElement(
            "div"
          );

        info.className =
          "chapter-item-info";

        const number =
          document.createElement(
            "div"
          );

        number.className =
          "chapter-item-number";

        number.textContent =
          "Chapitre " +
          chapitre.numero;

        const title =
          document.createElement(
            "div"
          );

        title.className =
          "chapter-item-title";

        title.textContent =
          chapitre.titre;

        const arrow =
          document.createElement(
            "div"
          );

        arrow.className =
          "chapter-arrow";

        arrow.textContent =
          "→";

        info.appendChild(number);
        info.appendChild(title);

        button.appendChild(info);
        button.appendChild(arrow);

        button.addEventListener(
          "click",
          () => {

            ouvrirChapitre(
              chapitre.id
            );
          }
        );

        chaptersList.appendChild(
          button
        );
      }
    );
  }


  /* =======================================================
     RECHERCHE PAR NUMÉRO
  ======================================================= */

  searchChapterBtn.addEventListener(
    "click",
    rechercherChapitre
  );


  searchChapterNumber.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        rechercherChapitre();
      }
    }
  );


  function rechercherChapitre() {

    const numero =
      Number(
        searchChapterNumber.value
      );

    if (!numero) {
      return;
    }

    const chapitre =
      getChapitres().find(
        item =>
          Number(item.numero)
          === numero
      );

    if (!chapitre) {

      alert(
        "Ce chapitre n'existe pas."
      );

      return;
    }

    ouvrirChapitre(
      chapitre.id
    );
  }


  /* =======================================================
     OUVRIR UN CHAPITRE
  ======================================================= */

  function ouvrirChapitre(id) {

    const chapitre =
      getChapitres().find(
        item => item.id === id
      );

    if (!chapitre) {
      return;
    }

    chapitreEnCoursId = id;

    readerChapterNumber.textContent =
      "Chapitre " +
      chapitre.numero;

    readerChapterTitle.value =
      chapitre.titre;

    readerChapterText.value =
      chapitre.texte;

    readerSaveMessage.textContent =
      "";

    mettreAJourNavigation();

    showScreen(readerScreen);
  }


  /* =======================================================
     ENREGISTRER DEPUIS LA LECTURE
  ======================================================= */

  saveReaderBtn.addEventListener(
    "click",
    () => {

      if (!chapitreEnCoursId) {
        return;
      }

      let chapitres =
        getChapitres();

      const index =
        chapitres.findIndex(
          chapitre =>
            chapitre.id
            === chapitreEnCoursId
        );

      if (index === -1) {
        return;
      }

      const nouveauTitre =
        readerChapterTitle
          .value
          .trim();

      if (!nouveauTitre) {

        readerSaveMessage.textContent =
          "Le titre ne peut pas être vide.";

        return;
      }

      chapitres[index].titre =
        nouveauTitre;

      chapitres[index].texte =
        readerChapterText.value;

      chapitres[index].modifieLe =
        new Date().toISOString();

      saveChapitres(
        chapitres
      );

      readerSaveMessage.textContent =
        "Modifications enregistrées.";

      setTimeout(() => {

        readerSaveMessage.textContent =
          "";

      }, 2500);
    }
  );


  /* =======================================================
     NAVIGATION PRÉCÉDENT / SUIVANT
  ======================================================= */

  function mettreAJourNavigation() {

    const chapitres =
      trierChapitres(
        getChapitres()
      );

    const index =
      chapitres.findIndex(
        chapitre =>
          chapitre.id
          === chapitreEnCoursId
      );

    previousChapterBtn.disabled =
      index <= 0;

    nextChapterBtn.disabled =
      index === -1
      ||
      index >=
        chapitres.length - 1;
  }


  previousChapterBtn.addEventListener(
    "click",
    () => {

      const chapitres =
        trierChapitres(
          getChapitres()
        );

      const index =
        chapitres.findIndex(
          chapitre =>
            chapitre.id
            === chapitreEnCoursId
        );

      if (index > 0) {

        ouvrirChapitre(
          chapitres[index - 1].id
        );
      }
    }
  );


  nextChapterBtn.addEventListener(
    "click",
    () => {

      const chapitres =
        trierChapitres(
          getChapitres()
        );

      const index =
        chapitres.findIndex(
          chapitre =>
            chapitre.id
            === chapitreEnCoursId
        );

      if (
        index !== -1
        &&
        index <
          chapitres.length - 1
      ) {

        ouvrirChapitre(
          chapitres[index + 1].id
        );
      }
    }
  );


  /* =======================================================
     RETOUR LISTE
  ======================================================= */

  readerListBtn.addEventListener(
    "click",
    () => {

      afficherListeChapitres();

      showScreen(
        chaptersScreen
      );
    }
  );


  readerHomeBtn.addEventListener(
    "click",
    () => {

      chapitreEnCoursId = null;

      showScreen(homeScreen);
    }
  );


  /* =======================================================
     SUPPRESSION
  ======================================================= */

  deleteChapterBtn.addEventListener(
    "click",
    () => {

      if (!chapitreEnCoursId) {
        return;
      }

      deleteModal.classList.remove(
        "hidden"
      );
    }
  );


  cancelDeleteBtn.addEventListener(
    "click",
    () => {

      deleteModal.classList.add(
        "hidden"
      );
    }
  );


  confirmDeleteBtn.addEventListener(
    "click",
    () => {

      if (!chapitreEnCoursId) {
        return;
      }

      let chapitres =
        getChapitres();

      chapitres =
        chapitres.filter(
          chapitre =>
            chapitre.id
            !== chapitreEnCoursId
        );

      saveChapitres(
        chapitres
      );

      chapitreEnCoursId = null;

      deleteModal.classList.add(
        "hidden"
      );

      afficherListeChapitres();

      showScreen(
        chaptersScreen
      );
    }
  );


  /* =======================================================
     EXPORTER UNE SAUVEGARDE
  ======================================================= */

  exportBtn.addEventListener(
    "click",
    () => {

      const chapitres =
        getChapitres();

      const sauvegarde = {

        application:
          "Mon Livre Privé",

        version: 1,

        exporteLe:
          new Date().toISOString(),

        chapitres
      };

      const contenu =
        JSON.stringify(
          sauvegarde,
          null,
          2
        );

      const blob =
        new Blob(
          [contenu],
          {
            type:
              "application/json"
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const lien =
        document.createElement(
          "a"
        );

      const maintenant =
        new Date();

      const date =
        maintenant
          .toISOString()
          .slice(0, 10);

      lien.href = url;

      lien.download =
        "mon-livre-sauvegarde-" +
        date +
        ".json";

      document.body.appendChild(
        lien
      );

      lien.click();

      lien.remove();

      URL.revokeObjectURL(
        url
      );
    }
  );


  /* =======================================================
     IMPORTER UNE SAUVEGARDE
  ======================================================= */

  importFile.addEventListener(
    "change",
    event => {

      const file =
        event.target.files[0];

      if (!file) {
        return;
      }

      const reader =
        new FileReader();

      reader.onload = e => {

        try {

          const data =
            JSON.parse(
              e.target.result
            );

          let chapitresImportes;

          if (
            Array.isArray(data)
          ) {

            chapitresImportes =
              data;

          } else if (
            data
            &&
            Array.isArray(
              data.chapitres
            )
          ) {

            chapitresImportes =
              data.chapitres;

          } else {

            throw new Error(
              "Format invalide"
            );
          }

          fichierImporte =
            chapitresImportes;

          importModal.classList.remove(
            "hidden"
          );

        } catch (error) {

          console.error(error);

          alert(
            "Ce fichier n'est pas une sauvegarde valide."
          );

          importFile.value = "";
        }
      };

      reader.readAsText(
        file
      );
    }
  );


  /* =======================================================
     FUSIONNER
  ======================================================= */

  mergeImportBtn.addEventListener(
    "click",
    () => {

      if (
        !Array.isArray(
          fichierImporte
        )
      ) {
        return;
      }

      const actuels =
        getChapitres();

      const map =
        new Map();

      actuels.forEach(
        chapitre => {

          map.set(
            chapitre.id,
            chapitre
          );
        }
      );

      fichierImporte.forEach(
        chapitre => {

          if (!chapitre.id) {

            chapitre.id =
              creerId();
          }

          if (
            !map.has(
              chapitre.id
            )
          ) {

            map.set(
              chapitre.id,
              chapitre
            );
          }
        }
      );

      const fusion =
        Array.from(
          map.values()
        );

      saveChapitres(
        fusion
      );

      fermerImport();

      alert(
        "La sauvegarde a été fusionnée avec votre livre."
      );
    }
  );


  /* =======================================================
     REMPLACER
  ======================================================= */

  replaceImportBtn.addEventListener(
    "click",
    () => {

      if (
        !Array.isArray(
          fichierImporte
        )
      ) {
        return;
      }

      const confirmation =
        confirm(
          "Le livre actuel sera remplacé. Continuer ?"
        );

      if (!confirmation) {
        return;
      }

      const nouvelleListe =
        fichierImporte.map(
          chapitre => {

            return {
              ...chapitre,

              id:
                chapitre.id
                ||
                creerId()
            };
          }
        );

      saveChapitres(
        nouvelleListe
      );

      fermerImport();

      alert(
        "Votre livre a été remplacé par la sauvegarde."
      );
    }
  );


  cancelImportBtn.addEventListener(
    "click",
    fermerImport
  );


  function fermerImport() {

    importModal.classList.add(
      "hidden"
    );

    fichierImporte = null;

    importFile.value = "";
  }


  /* =======================================================
     FERMER MODALES EN CLIQUANT AUTOUR
  ======================================================= */

  importModal.addEventListener(
    "click",
    event => {

      if (
        event.target
        === importModal
      ) {

        fermerImport();
      }
    }
  );


  deleteModal.addEventListener(
    "click",
    event => {

      if (
        event.target
        === deleteModal
      ) {

        deleteModal.classList.add(
          "hidden"
        );
      }
    }
  );


  /* =======================================================
     LANCEMENT
  ======================================================= */

  const deverrouille =
    sessionStorage.getItem(
      "monLivrePrive_deverrouille"
    );

  if (
    deverrouille
    === "true"
  ) {

    showScreen(homeScreen);

  } else {

    showScreen(lockScreen);

    setTimeout(() => {
      accessCode.focus();
    }, 100);
  }

});
