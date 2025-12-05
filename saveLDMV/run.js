//#region info
/********************************************** */
let textinfo0 =
  "voir pour la gestion des collisions des plateformes et le bug du grounded dessus";
let textinfo1 = "";
//-----------------------------------------------
//afficher les infos
//-----------------------------------------------
// alert(textinfo0);
// alert(textinfo1);
/********************************************** */
//#endregion info

//#region initialisation des variables
/********************************************** */
const player = document.getElementById("player");
let x = 60; // position initiale
let y = 320;
const speed = 8; // vitesse de déplacement (pixels)
const jump = 10; // hauteur du saut (pixels)
const MaxJumpHeight = 200; // hauteur maximale du saut (pixels)
let jumpPosition = 0;
let jumpused = 0;

let isOnGround = false; // Indicateur pour savoir si le joueur touche le sol
let isJumping = false; // Indicateur pour savoir si le joueur est en train de sauter
let isRunning = false; // Indicateur pour savoir si le joueur court
let collisionYDetected = false;
let collisionXDetected = false;

let yVelocity = 0; // Vitesse verticale actuelle (commence à zéro)
let xVelocity = 0; // Vitesse horizontale actuelle (commence à zéro)
let futureX = 0;
let futureY = 0;
const GRAVITY = 0.8; // Accélération de la gravité (à ajuster)
const GROUND_Y = 620; // Position Y du sol (par exemple, 500px depuis le haut)

// --- Définitions du Joueur et Limites ---
const playerWidth = player.offsetWidth;
const playerHeight = player.offsetHeight;

playerRectX = {
  x: futureX,
  y: futureY,
  width: playerWidth,
  height: playerHeight,
};

//#endregion initialisation des variables
/********************************************** */

//#region update boucle principale
/********************************************** */
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
    case "q":
      xVelocity = -speed; // Déplacement gauche
      info();
      break;
    case "ArrowRight":
    case "d":
      xVelocity = speed; // Déplacement droite
      info();
      break;
    case "ArrowUp":
    case "z":
      if (isOnGround && !isJumping) {
        isOnGround = false; // Le joueur n'est plus au sol lorsqu'il saute
        isJumping = true; // Le joueur est en train de sauter
        yVelocity = -jump; // Appliquer une vitesse verticale vers le haut

        info();
      }
      break;
  }
});

document.addEventListener("keyup", (event) => {
  // Arrêter le mouvement lorsque la touche est relâchée
  if (
    event.key === "ArrowLeft" ||
    event.key === "q" ||
    event.key === "ArrowRight" ||
    event.key === "d"
  ) {
    xVelocity = 0;
  }
  if (event.key === "ArrowUp" || event.key === "z") {
    isJumping = false; // Le joueur n'est plus en train de sauter
    info();
  }
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function update() {
  //---------------------------------------------------------------------------------------------------------------
  //gestion des collisions
  collisionsXDetecter();
  //---------------------------------------------------------------------------------------------------------------
  updatePhysics();
  //---------------------------------------------------------------------------------------------------------------
  Jmoving();
  //---------------------------------------------------------------------------------------------------------------
  moving();
  //---------------------------------------------------------------------------------------------------------------
  // 6. GESTION DES BORNES D'ÉCRAN (pour le sol de l'écran)
  limiteScree();
  //---------------------------------------------------------------------------------------------------------------
  //gestion
  stopJump();
  //---------------------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------------
  // Mise à jour de la position du joueur
  majPosition();

  requestAnimationFrame(update);
}
requestAnimationFrame(update);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function majPosition() {
  y += yVelocity;
  x += xVelocity;
  player.style.left = `${x}px`;
  player.style.top = `${y}px`;
  info();
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function limiteScree() {
  const maxX = window.innerWidth - playerWidth * 2; // Utiliser playerWidth/Height
  const maxY = window.innerHeight - playerHeight / 2; // Utiliser playerWidth/Height

  // Bornes X et Y minimales (par exemple 0)
  const minX = 50;
  const minY = 10;

  // Gestion du sol de l'écran si pas de plateforme
  if (y > maxY) {
    y = maxY;
    yVelocity = 0;
    isOnGround = true;
  }

  x = Math.max(minX, Math.min(maxX, x));
  y = Math.max(minY, Math.min(maxY, y)); // y est déjà géré par la physique, mais c'est une sécurité
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function collisionsXDetecter() {
  // Mettre à jour les coordonnées futures du joueur
  futureX = x + xVelocity;

  // 2. Supposer que le joueur n'est PLUS au sol au début de la vérification
  // C'est ESSENTIEL pour réactiver la gravité s'il sort d'une plateforme.
  let tempIsOnGround = false;

  // Détection des collisions avec les plateformes
  collisionXDetected = false;
  const platforms = document.querySelectorAll(".platform"); // Sélectionner toutes les plateformes
  platforms.forEach((platform) => {
    const platformRect = platform.getBoundingClientRect(); // Récupérer les coordonnées de la plateforme

    // Vérification de la collision horizontale
    if (
      futureY < platformRect.bottom &&
      futureY + playerHeight > platformRect.top &&
      futureX + playerWidth > platformRect.left &&
      futureX < platformRect.right
    ) {
      // Collision détectée
      collisionXDetected = true;
      // Ajuster la position du joueur pour qu'il ne traverse pas la plateforme
      if (x + playerWidth <= platformRect.left) {
        x = platformRect.left - playerWidth;
        xVelocity = 0;
        info();
      } else if (x >= platformRect.right) {
        x = platformRect.right;
        xVelocity = 0;
        info();
      }
    }
  });
}
/*
function collisionsYDetecter() {
  // Mettre à jour les coordonnées futures du joueur
  futureX = x + xVelocity;
  futureY = y + yVelocity;

  // 2. Supposer que le joueur n'est PLUS au sol au début de la vérification
  // C'est ESSENTIEL pour réactiver la gravité s'il sort d'une plateforme.
  let tempIsOnGround = false;

  playerRectX = {
    x: futureX,
    y: futureY,
    width: playerWidth,
    height: playerHeight,
  };

  // Détection des collisions avec les plateformes
  collisionYDetected = false;
  collisionXDetected = false;
  const platforms = document.querySelectorAll(".platform"); // Sélectionner toutes les plateformes
  platforms.forEach((platform) => {
    const platformRect = platform.getBoundingClientRect(); // Récupérer les coordonnées de la plateforme
    // Vérification de la collision verticale
    if (
      futureX < platformRect.right &&
      futureX + playerWidth > platformRect.left &&
      futureY + playerHeight > platformRect.top &&
      futureY < platformRect.bottom
    ) {
      collisionYDetected = true;
      // Collision par le bas détectée, c'est une surface au sol
      tempIsOnGround = true;
      // y = platformRect.top - playerHeight; // Repousser au-dessus
      yVelocity = 0;
      // On s'arrête là car on a trouvé une surface pour se poser
      return;
    }
    if (tempIsOnGround) {
      isOnGround = true;
      info();
    } else {
      isOnGround = false;
      info();
    }

    // Vérification de la collision horizontale
    if (
      futureY < platformRect.bottom &&
      futureY + playerHeight > platformRect.top &&
      futureX + playerWidth > platformRect.left &&
      futureX < platformRect.right
    ) {
      // Collision détectée
      collisionXDetected = true;
      // Ajuster la position du joueur pour qu'il ne traverse pas la plateforme
      if (x + playerWidth <= platformRect.left) {
        x = platformRect.left - playerWidth;
        xVelocity = 0;
        info();
      } else if (x >= platformRect.right) {
        x = platformRect.right;
        xVelocity = 0;
        info();
      }
    }
  });
}
  */
//************************************************************* */
/*
function collisionsDetecter() {
  // Mettre à jour les coordonnées futures du joueur
  futureX = x + xVelocity;
  futureY = y + yVelocity;

  // 2. Supposer que le joueur n'est PLUS au sol au début de la vérification
  // C'est ESSENTIEL pour réactiver la gravité s'il sort d'une plateforme.
  let tempIsOnGround = false;

  playerRectX = {
    x: futureX,
    y: futureY,
    width: playerWidth,
    height: playerHeight,
  };

  // Détection des collisions avec les plateformes
  collisionYDetected = false;
  collisionXDetected = false;
  const platforms = document.querySelectorAll(".platform"); // Sélectionner toutes les plateformes
  platforms.forEach((platform) => {
    const platformRect = platform.getBoundingClientRect(); // Récupérer les coordonnées de la plateforme
    // Vérification de la collision verticale
    if (
      futureX < platformRect.right &&
      futureX + playerWidth > platformRect.left &&
      futureY + playerHeight > platformRect.top &&
      futureY < platformRect.bottom
    ) {
      collisionYDetected = true;
      // Collision par le bas détectée, c'est une surface au sol
      tempIsOnGround = true;
      // y = platformRect.top - playerHeight; // Repousser au-dessus
      yVelocity = 0;
      // On s'arrête là car on a trouvé une surface pour se poser
      return;
    }
    if (tempIsOnGround) {
      isOnGround = true;
      info();
    } else {
      isOnGround = false;
      info();
    }

    // Vérification de la collision horizontale
    if (
      futureY < platformRect.bottom &&
      futureY + playerHeight > platformRect.top &&
      futureX + playerWidth > platformRect.left &&
      futureX < platformRect.right
    ) {
      // Collision détectée
      collisionXDetected = true;
      // Ajuster la position du joueur pour qu'il ne traverse pas la plateforme
      if (x + playerWidth <= platformRect.left) {
        x = platformRect.left - playerWidth;
        xVelocity = 0;
        info();
      } else if (x >= platformRect.right) {
        x = platformRect.right;
        xVelocity = 0;
        info();
      }
    }
  });
}
  */
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function stopJump() {
  if (isOnGround) {
    jumpPosition = y;
    // jumpused = jumpPosition;
  }
  if (y <= jumpPosition - MaxJumpHeight) {
    yVelocity = 0;
  }
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//#endregion grounded
/********************************************** */

//#region gestion du grounded
/********************************************** */
function Jmoving() {
  document.addEventListener("keydown", (e) => {
    if (["ArrowUp", "z"].includes(e.key) && isOnGround) {
      isOnGround = false; // Le joueur n'est plus au sol lorsqu'il saute
      isJumping = true; // Le joueur est en train de sauter

      info();
    }
  });

  // Quand toutes les touches sont relâchées
  document.addEventListener("keyup", (e) => {
    if (["ArrowUp", "z"].includes(e.key)) {
      isJumping = false; // Le joueur n'est plus en train de sauter
      info();
    }
  });
}

//#endregion grounded
/********************************************** */

//#region gestion gravité
/**********************************************/
function updatePhysics() {
  if (!isOnGround && !isJumping) {
    // 1. APPLICATION DE LA GRAVITÉ
    // La gravité augmente constamment la vitesse verticale
    yVelocity += GRAVITY;
    info();

    // 2. APPLICATION DU MOUVEMENT
    // La position Y est mise à jour par la vitesse verticale
    y += yVelocity;
    info();

    // 3. VÉRIFICATION DU SOL (atterrissage)
    if (y >= GROUND_Y) {
      y = GROUND_Y; // Positionner le joueur sur le sol
      yVelocity = 0; // Arrêter la chute
      isOnGround = true;
      info();
    }

    // 4. MISE À JOUR CSS
    // Vous conservez vos mises à jour de position ici
    player.style.top = `${y}px`;
    info();
  }
}

//#endregion  gravité
/********************************************** */

//#region animation running
/********************************************** */
const runner = document.querySelector(".runner");
function moving() {
  // Quand une touche de déplacement est pressée
  document.addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowRight", "q", "d"].includes(e.key)) {
      // if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'z', 'q', 's', 'd'].includes(e.key)) {
      if (!isRunning) {
        runner.classList.add("running");
        isRunning = true;
        info();
      }
    }
  });

  // Quand toutes les touches sont relâchées
  document.addEventListener("keyup", (e) => {
    if (["ArrowLeft", "ArrowRight", "q", "d"].includes(e.key)) {
      runner.classList.remove("running");
      isRunning = false;
      info();
    }
  });
}
//#endregion animation running
/********************************************** */

//#region gestion info
/********************************************** */
function info() {
  let info = document.getElementById("info");
  info.innerText = `
  x: ${Math.round(x)} px /// y: ${Math.round(
    y
  )} px /// sol: ${isOnGround} /// jump: ${isJumping} /// run: ${isRunning}  /// col: ${collisionYDetected}  /// jumpbase: ${jumpPosition} px /// jumpbase: ${jumpused} px /// xVel: ${xVelocity} px/s /// yVel: ${yVelocity} px/s `;
}
// requestAnimationFrame(info);

//#endregion info
/********************************************** */
