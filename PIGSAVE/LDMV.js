//#region Variables et constantes
var motBase = document.getElementById("enter").value;
var motmaj = document.getElementById("reponse");
var repArray = [];
var gamearray = [];
var oeil = true;
var life = 0;
var coeur = "";
const inputLetter = document.getElementById("enter");
const porButton = document.getElementById("valider");
var imagecochon = "";

const EtatJeu = Object.freeze({
  VICTOIRE: "victoire",
  DEFAITE: "defaite",
  BON: "bon",
  MAUVAIS: "mauvais",
  CONTINUER: "continuer",
  RESET: "reset",
});
let etat = EtatJeu.RESET;

//#endregion

//#region
imagecochon = document.getElementById("cochon");
var cache = "";
var cache2 = "";
cache = document.querySelector(".cache");
cache2 = document.querySelector(".cache2");
cache.style.display = "none";
cache2.style.display = "none";

//#endregion

//#region initialisation
etat = EtatJeu.RESET;
imagecochonou();
function mot() {
  motmaj = document.getElementById("reponse");
  motBase = document.getElementById("enter").value;
  motBase = motBase.toUpperCase();
  repArray = motBase.split("");
  // alert("Le mot à deviner contient " + repArray.length + " lettres.");
  /*boucle de création du tableau de jeu */
  for (var i = 0; i < repArray.length; i++) {
    gamearray[i] = "_";
  }
  /*initialisation des vies */
  var lifebase = repArray.length;
  life = lifebase + 2;
  // alert("Vous avez " + life + " vies.");
  /*affichage du mot à deviner */
  motmaj.innerHTML = gamearray.join(" ");
  /*désactivation de l'input */
  inputLetter.disabled = true;
  porButton.disabled = true;
  EtatJeu.RESET;
  imagecochonou();
  /*cache le mot saisie*/
  oeil = false;
  visiblemaj();
  /*affichage des vies */
  livelife();
  // alert(repArray);
  playSound("start");
}
//#endregion

//#region visibilité du mot
function visible() {
  oeil = !oeil;
  playSound("erreur");
  visiblemaj();
}
function visiblemaj() {
  if (oeil) {
    inputLetter.type = "text";
  } else {
    inputLetter.type = "password";
  }
}
//#endregion

//#region life
const vie = document.querySelector(".coeur");

function livelife() {
  vie.innerHTML = "❤️".repeat(life);
}
//#endregion

//#region saisis lettre
function lettre(value) {
  enterLettre = value.toUpperCase();
  let bonneLettre = false;
  /*vérification de la lettre saisie */
  for (let j = 0; j < repArray.length; j++) {
    if (enterLettre === repArray[j]) {
      gamearray[j] = enterLettre;
      bonneLettre = true;
    }
  }
  /*affichage selon le résultat de la saisie */
  if (bonneLettre) {
    etat = EtatJeu.BON;
    playSound("valide");
    afficherCache(".cache2"); // pour le vert
  } else {
    etat = EtatJeu.MAUVAIS;
    life--;
    livelife();
    playSound("erreur");
    afficherCache(".cache"); // pour le rouge
  }
  /*mise à jour du mot affiché */
  motmaj.innerHTML = gamearray.join(" ");
  /*vérification de la fin de partie */
  fin();
  /*mise à jour de l'image du cochon */
  imagecochonou();
}
//#endregion

//#region visuelisation color
function afficherCache(selector) {
  const el = document.querySelector(selector);
  el.style.display = "block";
  setTimeout(() => (el.style.display = "none"), 100);
}

//#endregion

//#region fin de partie
function fin() {
  if (motBase === gamearray.join("")) {
    etat = EtatJeu.VICTOIRE;
    playSound("victoire");
    oeil = true;
  } else if (life <= 0) {
    etat = EtatJeu.DEFAITE;
    playSound("defaite");
    oeil = true;
  } else {
    return
  }
  visiblemaj();
  imagecochonou();
  setTimeout(() => (reset()), 10000);
}
//#endregion

//#region cochon image
function imagecochonou() {
  switch (etat) {
    case EtatJeu.VICTOIRE:
      imagecochon.src = "../media/coursecochon.jpg";
      break;
    case EtatJeu.DEFAITE:
      imagecochon.src = "../media/piggykill.jpg";
      break;
    case EtatJeu.BON:
      imagecochon.src = "../media/cochonheureux.jpg";
      break;
    case EtatJeu.MAUVAIS:
      imagecochon.src = "../media/cochontriste.jpg";
      break;
    case EtatJeu.CONTINUER:
      imagecochon.src = "../media/piggyporc.jpg";
      break;
    default:
      imagecochon.src = "../media/prisoncochon.jpg";
  }
}
//#endregion

//#region song
function playSound(id) {
  var son = document.getElementById(id);
  son.play();
}
//#endregion

//#region reset
function reset() {
  etat = EtatJeu.RESET;
  repArray = [];
  gamearray = [];
  oeil = true;
    inputLetter.value = "";
    motmaj.innerHTML = "_B_B_Q_";
    inputLetter.disabled = false;
    porButton.disabled = false;
    inputLetter.type = "text";
    imagecochonou();
    life = 0;
    livelife();
}
//#endregion