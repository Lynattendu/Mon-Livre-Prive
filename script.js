
/* =========================================================
   MA BIBLIOTHÈQUE PRIVÉE
   SCRIPT PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     RÉGLAGES
  ======================================================= */

  const CODE_ACCES = "Maperledamour";

  const STORAGE_LIBRARY = "maBibliothequePrivee_livres";
  const STORAGE_LEGACY = "monLivrePrive_chapitres";

  const SESSION_UNLOCKED = "maBibliothequePrivee_deverrouille";

  let livreEnCoursId = null;
  let chapitreEnCoursId = null;

  let livreEditeId = null;

  let fichierImporte = null;


  /* =======================================================
     ÉLÉMENTS PRINCIPAUX
  ======================================================= */

  const screens =
    document.querySelectorAll(".screen");

  const lockScreen =
    document.getElementById("lockScreen");

  const libraryScreen =
    document.getElementById("libraryScreen");

  const bookEditorScreen =
    document.getElementById("bookEditorScreen");

  const homeScreen =
    document.getElementById("homeScreen");

  const editorScreen =
    document.getElementById("editorScreen");

  const chaptersScreen =
    document.getElementById("chaptersScreen");

  const readerScreen =
    document.getElementById("readerScreen");

  const backupScreen =
    document.getElementById("backupScreen");


  /* =======================================================
     CONNEXION
  ======================================================= */

  const accessCode =
    document.getElementById("accessCode");

  const unlockBtn =
    document.getElementById("unlockBtn");

  const codeError =
    document.getElementById("codeError");

  const libraryLockBtn =
    document.getElementById("libraryLockBtn");

  const lockBtn =
    document.getElementById("lockBtn");


  /* =======================================================
     BIBLIOTHÈQUE
  ======================================================= */

  const newBookBtn =
    document.getElementById("newBookBtn");

  const booksList =
    document.getElementById("booksList");

  const backLibraryBtn =
    document.getElementById("backLibraryBtn");

  const bookEditorHeading =
    document.getElementById("bookEditorHeading");

  const bookTitle =
    document.getElementById("bookTitle");

  const saveBookBtn =
    document.getElementById("saveBookBtn");

  const deleteBookBtn =
    document.getElementById("deleteBookBtn");

  const bookSaveMessage =
    document.getElementById("bookSaveMessage");

  const backToLibraryBtn =
    document.getElementById("backToLibraryBtn");

  const renameBookBtn =
    document.getElementById("renameBookBtn");

  const currentBookTitle =
    document.getElementById("currentBookTitle");


  /* =======================================================
     MENU LIVRE
  ======================================================= */

  const newChapterBtn =
    document.getElementById("newChapterBtn");

  const chaptersBtn =
    document.getElementById("chaptersBtn");

  const backupBtn =
    document.getElementById("backupBtn");

  const backHomeBtns =
    document.querySelectorAll(".back-home-btn");


  /* =======================================================
     ÉDITEUR CHAPITRE
  ======================================================= */

  const editorHeading =
    document.getElementById("editorHeading");

  const chapterNumber =
    document.getElementById("chapterNumber");

  const chapterTitle =
    document.getElementById("chapterTitle");

  const chapterText =
    document.getElementById("chapterText");

  const saveChapterBtn =
    document.getElementById("saveChapterBtn");

  const deleteChapterBtn =
    document.getElementById("deleteChapterBtn");

  const saveMessage =
    document.getElementById("saveMessage");


  /* =======================================================
     LISTE CHAPITRES
  ======================================================= */

  const searchChapterNumber =
    document.getElementById("searchChapterNumber");

  const searchChapterBtn =
    document.getElementById("searchChapterBtn");

  const chaptersList =
    document.getElementById("chaptersList");


  /* =======================================================
     LECTURE / MODIFICATION
  ======================================================= */

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


  /* =======================================================
     SAUVEGARDES
  ======================================================= */

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


  /* =======================================================
     SUPPRESSION CHAPITRE
  ======================================================= */

  const deleteModal =
    document.getElementById("deleteModal");

  const confirmDeleteBtn =
    document.getElementById("confirmDeleteBtn");

  const cancelDeleteBtn =
    document.getElementById("cancelDeleteBtn");


  /* =======================================================
     SUPPRESSION LIVRE
  ======================================================= */

  const deleteBookModal =
    document.getElementById("deleteBookModal");

  const confirmDeleteBookBtn =
    document.getElementById("confirmDeleteBookBtn");

  const cancelDeleteBookBtn =
    document.getElementById("cancelDeleteBookBtn");


  /* =======================================================
     ÉCRANS
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
     IDENTIFIANTS UNIQUES
  ======================================================= */

  function creerId(prefixe = "id") {

    return (
      prefixe +
      "-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2, 9)
    );
  }


  /* =======================================================
     STOCKAGE BIBLIOTHÈQUE
  ======================================================= */

  function getBibliotheque() {

    const data =
      localStorage.getItem(STORAGE_LIBRARY);

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
        "Erreur lecture bibliothèque :",
        error
      );

      return [];
    }
  }


  function saveBibliotheque(livres) {

    localStorage.setItem(
      STORAGE_LIBRARY,
      JSON.stringify(livres)
    );
  }


  /* =======================================================
     MIGRATION DE L'ANCIENNE VERSION
  ======================================================= */

  function migrerAncienneVersion() {

    const nouvelleBibliotheque =
      getBibliotheque();

    if (nouvelleBibliotheque.length > 0) {
      return;
    }

    const ancienStockage =
      localStorage.getItem(STORAGE_LEGACY);

    if (!ancienStockage) {
      return;
    }

    try {

      const anciensChapitres =
        JSON.parse(ancienStockage);

      if (
        !Array.isArray(anciensChapitres) ||
        anciensChapitres.length === 0
      ) {
        return;
      }

      const livre = {

        id: creerId("livre"),

        titre: "Mon premier livre",

        creeLe:
          new Date().toISOString(),

        modifieLe:
          new Date().toISOString(),

        chapitres:
          anciensChapitres.map(chapitre => ({
            ...chapitre,
            id:
              chapitre.id ||
              creerId("chap")
          }))
      };

      saveBibliotheque([livre]);

    } catch (error) {

      console.error(
        "Migration impossible :",
        error
      );
    }
  }


  /* =======================================================
     LIVRE ACTUEL
  ======================================================= */

  function getLivreActuel() {

    if (!livreEnCoursId) {
      return null;
    }

    return getBibliotheque().find(
      livre =>
        livre.id === livreEnCoursId
    ) || null;
  }


  function updateLivreDansBibliotheque(
    livreModifie
  ) {

    const livres =
      getBibliotheque();

    const index =
      livres.findIndex(
        livre =>
          livre.id === livreModifie.id
      );

    if (index === -1) {
      return false;
    }

    livreModifie.modifieLe =
      new Date().toISOString();

    livres[index] =
      livreModifie;

    saveBibliotheque(livres);

    return true;
  }


  /* =======================================================
     TRI DES CHAPITRES
  ======================================================= */

  function trierChapitres(chapitres) {

    return [...chapitres].sort(
      (a, b) =>
        Number(a.numero) -
        Number(b.numero)
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
        SESSION_UNLOCKED,
        "true"
      );

      afficherBibliotheque();

      showScreen(libraryScreen);

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
      SESSION_UNLOCKED
    );

    livreEnCoursId = null;
    chapitreEnCoursId = null;
    livreEditeId = null;

    showScreen(lockScreen);

    setTimeout(() => {
      accessCode.focus();
    }, 100);
  }


  libraryLockBtn.addEventListener(
    "click",
    verrouiller
  );


  lockBtn.addEventListener(
    "click",
    verrouiller
  );


  /* =======================================================
     AFFICHER BIBLIOTHÈQUE
  ======================================================= */

  function afficherBibliotheque() {

    booksList.innerHTML = "";

    const livres =
      getBibliotheque();

    if (livres.length === 0) {

      const empty =
        document.createElement("div");

      empty.className =
        "empty-list";

      empty.innerHTML =
        "Aucun livre pour le moment.<br><br>Créez votre premier livre.";

      booksList.appendChild(empty);

      return;
    }

    livres.forEach(livre => {

      const card =
        document.createElement("button");

      card.className =
        "chapter-item book-item";

      const info =
        document.createElement("div");

      info.className =
        "chapter-item-info";

      const label =
        document.createElement("div");

      label.className =
        "chapter-item-number";

      const nombreChapitres =
        Array.isArray(livre.chapitres)
          ? livre.chapitres.length
          : 0;

      label.textContent =
        nombreChapitres +
        (nombreChapitres > 1
          ? " chapitres"
          : " chapitre");

      const title =
        document.createElement("div");

      title.className =
        "chapter-item-title";

      title.textContent =
        livre.titre;

      const arrow =
        document.createElement("div");

      arrow.className =
        "chapter-arrow";

      arrow.textContent = "→";

      info.appendChild(label);
      info.appendChild(title);

      card.appendChild(info);
      card.appendChild(arrow);

      card.addEventListener(
        "click",
        () => {

          ouvrirLivre(livre.id);
        }
      );

      booksList.appendChild(card);
    });
  }


  /* =======================================================
     NOUVEAU LIVRE
  ======================================================= */

  newBookBtn.addEventListener(
    "click",
    () => {

      livreEditeId = null;

      bookEditorHeading.textContent =
        "Nouveau livre";

      bookTitle.value = "";

      bookSaveMessage.textContent = "";

      deleteBookBtn.classList.add(
        "hidden"
      );

      showScreen(bookEditorScreen);

      setTimeout(() => {
        bookTitle.focus();
      }, 100);
    }
  );


  /* =======================================================
     ENREGISTRER LIVRE
  ======================================================= */

  saveBookBtn.addEventListener(
    "click",
    () => {

      const titre =
        bookTitle.value.trim();

      if (!titre) {

        bookSaveMessage.textContent =
          "Indiquez un titre pour le livre.";

        return;
      }

      const livres =
        getBibliotheque();

      if (!livreEditeId) {

        const nouveauLivre = {

          id: creerId("livre"),

          titre,

          creeLe:
            new Date().toISOString(),

          modifieLe:
            new Date().toISOString(),

          chapitres: []
        };

        livres.push(
          nouveauLivre
        );

        saveBibliotheque(livres);

        livreEditeId =
          nouveauLivre.id;

        livreEnCoursId =
          nouveauLivre.id;

        bookEditorHeading.textContent =
          "Renommer le livre";

        deleteBookBtn.classList.remove(
          "hidden"
        );

        bookSaveMessage.textContent =
          "Livre créé.";

        return;
      }


      const index =
        livres.findIndex(
          livre =>
            livre.id === livreEditeId
        );

      if (index === -1) {
        return;
      }

      livres[index].titre =
        titre;

      livres[index].modifieLe =
        new Date().toISOString();

      saveBibliotheque(livres);

      if (
        livreEnCoursId ===
        livreEditeId
      ) {

        currentBookTitle.textContent =
          titre;
      }

      bookSaveMessage.textContent =
        "Titre enregistré.";
    }
  );


  /* =======================================================
     RETOUR BIBLIOTHÈQUE
  ======================================================= */

  backLibraryBtn.addEventListener(
    "click",
    () => {

      livreEditeId = null;

      afficherBibliotheque();

      showScreen(libraryScreen);
    }
  );


  backToLibraryBtn.addEventListener(
    "click",
    () => {

      livreEnCoursId = null;
      chapitreEnCoursId = null;

      afficherBibliotheque();

      showScreen(libraryScreen);
    }
  );


  /* =======================================================
     OUVRIR UN LIVRE
  ======================================================= */

  function ouvrirLivre(id) {

    const livre =
      getBibliotheque().find(
        item => item.id === id
      );

    if (!livre) {
      return;
    }

    livreEnCoursId = id;
    chapitreEnCoursId = null;

    currentBookTitle.textContent =
      livre.titre;

    showScreen(homeScreen);
  }


  /* =======================================================
     RENOMMER LIVRE
  ======================================================= */

  renameBookBtn.addEventListener(
    "click",
    () => {

      const livre =
        getLivreActuel();

      if (!livre) {
        return;
      }

      livreEditeId =
        livre.id;

      bookEditorHeading.textContent =
        "Renommer le livre";

      bookTitle.value =
        livre.titre;

      bookSaveMessage.textContent = "";

      deleteBookBtn.classList.remove(
        "hidden"
      );

      showScreen(bookEditorScreen);
    }
  );


  /* =======================================================
     SUPPRIMER LIVRE
  ======================================================= */

  deleteBookBtn.addEventListener(
    "click",
    () => {

      if (!livreEditeId) {
        return;
      }

      deleteBookModal.classList.remove(
        "hidden"
      );
    }
  );


  cancelDeleteBookBtn.addEventListener(
    "click",
    () => {

      deleteBookModal.classList.add(
        "hidden"
      );
    }
  );


  confirmDeleteBookBtn.addEventListener(
    "click",
    () => {

      if (!livreEditeId) {
        return;
      }

      let livres =
        getBibliotheque();

      livres =
        livres.filter(
          livre =>
            livre.id !== livreEditeId
        );

      saveBibliotheque(livres);

      if (
        livreEnCoursId ===
        livreEditeId
      ) {
        livreEnCoursId = null;
      }

      livreEditeId = null;
      chapitreEnCoursId = null;

      deleteBookModal.classList.add(
        "hidden"
      );

      afficherBibliotheque();

      showScreen(libraryScreen);
    }
  );


  /* =======================================================
     MENU DU LIVRE
  ======================================================= */

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
     RETOUR ACCUEIL LIVRE
  ======================================================= */

  backHomeBtns.forEach(button => {

    if (
      button.id === "backLibraryBtn" ||
      button.id === "readerHomeBtn"
    ) {
      return;
    }

    button.addEventListener(
      "click",
      () => {

        chapitreEnCoursId = null;

        const livre =
          getLivreActuel();

        if (!livre) {

          afficherBibliotheque();

          showScreen(libraryScreen);

          return;
        }

        currentBookTitle.textContent =
          livre.titre;

        showScreen(homeScreen);
      }
    );
  });


  /* =======================================================
     NOUVEAU CHAPITRE
  ======================================================= */

  function ouvrirNouveauChapitre() {

    if (!getLivreActuel()) {
      return;
    }

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
     ENREGISTRER CHAPITRE
  ======================================================= */

  saveChapterBtn.addEventListener(
    "click",
    () => {

      const livre =
        getLivreActuel();

      if (!livre) {
        return;
      }

      if (!Array.isArray(livre.chapitres)) {
        livre.chapitres = [];
      }

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


      /* NOUVEAU CHAPITRE */

      if (!chapitreEnCoursId) {

        const existe =
          livre.chapitres.some(
            chapitre =>
              Number(chapitre.numero)
              === numero
          );

        if (existe) {

          saveMessage.textContent =
            "Un chapitre avec ce numéro existe déjà.";

          return;
        }

        const nouveauChapitre = {

          id: creerId("chap"),

          numero,

          titre,

          texte,

          creeLe:
            new Date().toISOString(),

          modifieLe:
            new Date().toISOString()
        };

        livre.chapitres.push(
          nouveauChapitre
        );

        updateLivreDansBibliotheque(
          livre
        );

        chapitreEnCoursId =
          nouveauChapitre.id;

        editorHeading.textContent =
          "Modifier le chapitre";

        deleteChapterBtn.classList.remove(
          "hidden"
        );

        saveMessage.textContent =
          "Chapitre enregistré.";

        return;
      }


      /* MODIFIER CHAPITRE */

      const index =
        livre.chapitres.findIndex(
          chapitre =>
            chapitre.id ===
            chapitreEnCoursId
        );

      if (index === -1) {
        return;
      }

      const numeroUtilise =
        livre.chapitres.some(
          chapitre =>
            chapitre.id !==
              chapitreEnCoursId &&
            Number(chapitre.numero)
              === numero
        );

      if (numeroUtilise) {

        saveMessage.textContent =
          "Ce numéro est déjà utilisé.";

        return;
      }

      livre.chapitres[index].numero =
        numero;

      livre.chapitres[index].titre =
        titre;

      livre.chapitres[index].texte =
        texte;

      livre.chapitres[index].modifieLe =
        new Date().toISOString();

      updateLivreDansBibliotheque(
        livre
      );

      saveMessage.textContent =
        "Modifications enregistrées.";
    }
  );


  /* =======================================================
     LISTE CHAPITRES
  ======================================================= */

  function afficherListeChapitres() {

    chaptersList.innerHTML = "";

    const livre =
      getLivreActuel();

    if (!livre) {
      return;
    }

    const chapitres =
      trierChapitres(
        Array.isArray(livre.chapitres)
          ? livre.chapitres
          : []
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

        arrow.textContent = "→";

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
     RECHERCHER CHAPITRE
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

    const livre =
      getLivreActuel();

    if (!livre) {
      return;
    }

    const numero =
      Number(
        searchChapterNumber.value
      );

    if (!numero) {
      return;
    }

    const chapitre =
      livre.chapitres.find(
        item =>
          Number(item.numero)
          === numero
      );

    if (!chapitre) {

      alert(
        "Ce chapitre n'existe pas dans ce livre."
      );

      return;
    }

    ouvrirChapitre(
      chapitre.id
    );
  }


  /* =======================================================
     OUVRIR CHAPITRE
  ======================================================= */

  function ouvrirChapitre(id) {

    const livre =
      getLivreActuel();

    if (!livre) {
      return;
    }

    const chapitre =
      livre.chapitres.find(
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
      chapitre.texte || "";

    readerSaveMessage.textContent =
      "";

    mettreAJourNavigation();

    showScreen(readerScreen);
  }


  /* =======================================================
     ENREGISTRER DEPUIS LECTURE
  ======================================================= */

  saveReaderBtn.addEventListener(
    "click",
    () => {

      const livre =
        getLivreActuel();

      if (
        !livre ||
        !chapitreEnCoursId
      ) {
        return;
      }

      const index =
        livre.chapitres.findIndex(
          chapitre =>
            chapitre.id ===
            chapitreEnCoursId
        );

      if (index === -1) {
        return;
      }

      const nouveauTitre =
        readerChapterTitle.value.trim();

      if (!nouveauTitre) {

        readerSaveMessage.textContent =
          "Le titre ne peut pas être vide.";

        return;
      }

      livre.chapitres[index].titre =
        nouveauTitre;

      livre.chapitres[index].texte =
        readerChapterText.value;

      livre.chapitres[index].modifieLe =
        new Date().toISOString();

      updateLivreDansBibliotheque(
        livre
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

    const livre =
      getLivreActuel();

    if (!livre) {
      return;
    }

    const chapitres =
      trierChapitres(
        livre.chapitres
      );

    const index =
      chapitres.findIndex(
        chapitre =>
          chapitre.id ===
          chapitreEnCoursId
      );

    previousChapterBtn.disabled =
      index <= 0;

    nextChapterBtn.disabled =
      index === -1 ||
      index >=
        chapitres.length - 1;
  }


  previousChapterBtn.addEventListener(
    "click",
    () => {

      const livre =
        getLivreActuel();

      if (!livre) {
        return;
      }

      const chapitres =
        trierChapitres(
          livre.chapitres
        );

      const index =
        chapitres.findIndex(
          chapitre =>
            chapitre.id ===
            chapitreEnCoursId
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

      const livre =
        getLivreActuel();

      if (!livre) {
        return;
      }

      const chapitres =
        trierChapitres(
          livre.chapitres
        );

      const index =
        chapitres.findIndex(
          chapitre =>
            chapitre.id ===
            chapitreEnCoursId
        );

      if (
        index !== -1 &&
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
     RETOUR DEPUIS LECTURE
  ======================================================= */

  readerHomeBtn.addEventListener(
    "click",
    () => {

      chapitreEnCoursId = null;

      const livre =
        getLivreActuel();

      if (!livre) {

        afficherBibliotheque();

        showScreen(libraryScreen);

        return;
      }

      currentBookTitle.textContent =
        livre.titre;

      showScreen(homeScreen);
    }
  );


  readerListBtn.addEventListener(
    "click",
    () => {

      afficherListeChapitres();

      showScreen(chaptersScreen);
    }
  );


  /* =======================================================
     SUPPRIMER CHAPITRE
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

      const livre =
        getLivreActuel();

      if (
        !livre ||
        !chapitreEnCoursId
      ) {
        return;
      }

      livre.chapitres =
        livre.chapitres.filter(
          chapitre =>
            chapitre.id !==
            chapitreEnCoursId
        );

      updateLivreDansBibliotheque(
        livre
      );

      chapitreEnCoursId = null;

      deleteModal.classList.add(
        "hidden"
      );

      afficherListeChapitres();

      showScreen(chaptersScreen);
    }
  );


  /* =======================================================
     EXPORTER TOUTE LA BIBLIOTHÈQUE
  ======================================================= */

  exportBtn.addEventListener(
    "click",
    () => {

      const livres =
        getBibliotheque();

      const sauvegarde = {

        application:
          "Ma Bibliothèque Privée",

        version: 2,

        exporteLe:
          new Date().toISOString(),

        livres
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
        document.createElement("a");

      const date =
        new Date()
          .toISOString()
          .slice(0, 10);

      lien.href = url;

      lien.download =
        "bibliotheque-sauvegarde-" +
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
     IMPORTER SAUVEGARDE
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

          /* Nouvelle sauvegarde multi-livres */

          if (
            data &&
            Array.isArray(data.livres)
          ) {

            fichierImporte =
              normaliserLivres(
                data.livres
              );

            importModal.classList.remove(
              "hidden"
            );

            return;
          }


          /* Ancienne sauvegarde mono-livre */

          if (
            data &&
            Array.isArray(data.chapitres)
          ) {

            fichierImporte = [

              {
                id:
                  creerId("livre"),

                titre:
                  "Livre importé",

                creeLe:
                  new Date().toISOString(),

                modifieLe:
                  new Date().toISOString(),

                chapitres:
                  normaliserChapitres(
                    data.chapitres
                  )
              }

            ];

            importModal.classList.remove(
              "hidden"
            );

            return;
          }


          /* Très ancienne sauvegarde tableau direct */

          if (Array.isArray(data)) {

            fichierImporte = [

              {
                id:
                  creerId("livre"),

                titre:
                  "Livre importé",

                creeLe:
                  new Date().toISOString(),

                modifieLe:
                  new Date().toISOString(),

                chapitres:
                  normaliserChapitres(
                    data
                  )
              }

            ];

            importModal.classList.remove(
              "hidden"
            );

            return;
          }


          throw new Error(
            "Format invalide"
          );

        } catch (error) {

          console.error(error);

          alert(
            "Ce fichier n'est pas une sauvegarde valide."
          );

          importFile.value = "";
        }
      };

      reader.readAsText(file);
    }
  );


  /* =======================================================
     NORMALISATION IMPORT
  ======================================================= */

  function normaliserChapitres(
    chapitres
  ) {

    if (!Array.isArray(chapitres)) {
      return [];
    }

    return chapitres.map(
      chapitre => ({

        id:
          chapitre.id ||
          creerId("chap"),

        numero:
          Number(chapitre.numero) ||
          1,

        titre:
          chapitre.titre ||
          "Sans titre",

        texte:
          chapitre.texte ||
          "",

        creeLe:
          chapitre.creeLe ||
          new Date().toISOString(),

        modifieLe:
          chapitre.modifieLe ||
          new Date().toISOString()
      })
    );
  }


  function normaliserLivres(
    livres
  ) {

    return livres.map(
      livre => ({

        id:
          livre.id ||
          creerId("livre"),

        titre:
          livre.titre ||
          "Livre sans titre",

        creeLe:
          livre.creeLe ||
          new Date().toISOString(),

        modifieLe:
          livre.modifieLe ||
          new Date().toISOString(),

        chapitres:
          normaliserChapitres(
            livre.chapitres
          )
      })
    );
  }


  /* =======================================================
     FUSIONNER SAUVEGARDE
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
        getBibliotheque();

      const resultat =
        [...actuels];

      fichierImporte.forEach(
        livreImporte => {

          const indexLivre =
            resultat.findIndex(
              livre =>
                livre.id ===
                livreImporte.id
            );

          /* Livre totalement nouveau */

          if (indexLivre === -1) {

            resultat.push(
              livreImporte
            );

            return;
          }


          /* Livre déjà existant :
             fusionner ses chapitres */

          const livreActuel =
            resultat[indexLivre];

          if (
            !Array.isArray(
              livreActuel.chapitres
            )
          ) {
            livreActuel.chapitres = [];
          }

          livreImporte.chapitres.forEach(
            chapitreImporte => {

              const indexChapitre =
                livreActuel
                  .chapitres
                  .findIndex(
                    chapitre =>
                      chapitre.id ===
                      chapitreImporte.id
                  );

              if (
                indexChapitre === -1
              ) {

                livreActuel
                  .chapitres
                  .push(
                    chapitreImporte
                  );

              } else {

                /*
                  Même identifiant :
                  on conserve la version
                  la plus récemment modifiée.
                */

                const dateActuelle =
                  new Date(
                    livreActuel
                      .chapitres[
                        indexChapitre
                      ]
                      .modifieLe || 0
                  ).getTime();

                const dateImportee =
                  new Date(
                    chapitreImporte
                      .modifieLe || 0
                  ).getTime();

                if (
                  dateImportee >
                  dateActuelle
                ) {

                  livreActuel.chapitres[
                    indexChapitre
                  ] =
                    chapitreImporte;
                }
              }
            }
          );

          const dateLivreActuel =
            new Date(
              livreActuel.modifieLe || 0
            ).getTime();

          const dateLivreImporte =
            new Date(
              livreImporte.modifieLe || 0
            ).getTime();

          if (
            dateLivreImporte >
            dateLivreActuel
          ) {

            livreActuel.titre =
              livreImporte.titre;

            livreActuel.modifieLe =
              livreImporte.modifieLe;
          }

          resultat[indexLivre] =
            livreActuel;
        }
      );

      saveBibliotheque(
        resultat
      );

      fermerImport();

      afficherBibliotheque();

      alert(
        "La sauvegarde a été fusionnée avec votre bibliothèque."
      );
    }
  );


  /* =======================================================
     REMPLACER BIBLIOTHÈQUE
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
          "La bibliothèque actuelle sera remplacée. Continuer ?"
        );

      if (!confirmation) {
        return;
      }

      saveBibliotheque(
        normaliserLivres(
          fichierImporte
        )
      );

      livreEnCoursId = null;
      chapitreEnCoursId = null;
      livreEditeId = null;

      fermerImport();

      afficherBibliotheque();

      showScreen(libraryScreen);

      alert(
        "Votre bibliothèque a été remplacée par la sauvegarde."
      );
    }
  );


  /* =======================================================
     FERMER IMPORT
  ======================================================= */

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
        event.target ===
        importModal
      ) {

        fermerImport();
      }
    }
  );


  deleteModal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        deleteModal
      ) {

        deleteModal.classList.add(
          "hidden"
        );
      }
    }
  );


  deleteBookModal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        deleteBookModal
      ) {

        deleteBookModal.classList.add(
          "hidden"
        );
      }
    }
  );


  /* =======================================================
     LANCEMENT
  ======================================================= */

  migrerAncienneVersion();

  const deverrouille =
    sessionStorage.getItem(
      SESSION_UNLOCKED
    );

  if (
    deverrouille === "true"
  ) {

    afficherBibliotheque();

    showScreen(libraryScreen);

  } else {

    showScreen(lockScreen);

    setTimeout(() => {
      accessCode.focus();
    }, 100);
  }

});
