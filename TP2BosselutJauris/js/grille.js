import Cookie from "./cookie.js";
import { create2DArray } from "./utils.js";

/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
export default class Grille {
  

  constructor(l, c) {
    this.c = c;
    this.l = l;

    this.tabcookies = this.remplirTableauDeCookies(6);
    this.TableauCookieSelectionnes = [];
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index / this.l);
      let colonne = index % this.c; 

       console.log("On remplit le div index=" + index + " l=" + ligne + " col=" + colonne);

      // on récupère le cookie correspondant à cette case
      let cookie = this.tabcookies[ligne][colonne];
      let img = cookie.htmlImage;

      img.onclick = (event) => {
        console.log("On a cliqué sur la ligne " + ligne + " et la colonne " + colonne);
        //let cookieCliquee = this.getCookieFromLC(ligne, colonne);
        console.log("Le cookie cliqué est de type " + cookie.type);
        // highlight + changer classe CSS

        if (this.TableauCookieSelectionnes.length < 2){
          cookie.selectionnee();
          this.TableauCookieSelectionnes.push(cookie);
          console.log(cookie.type);
        }

        if(this.TableauCookieSelectionnes[0] == this.TableauCookieSelectionnes[1]){
          this.TableauCookieSelectionnes[0].deselectionnee();
          this.TableauCookieSelectionnes[1].deselectionnee();
          this.TableauCookieSelectionnes = [];
        }

        if (this.TableauCookieSelectionnes.length == 2 && Cookie.distance(this.TableauCookieSelectionnes[0], this.TableauCookieSelectionnes[1]) === 1) {
          Cookie.swapCookies(this.TableauCookieSelectionnes[0], this.TableauCookieSelectionnes[1]);
          this.TableauCookieSelectionnes = [];
          this.DetecterEtSupprimerAlignements();
          this.TomberCookies();
          this.ReapparitionCookies();
        }
      }

      img.ondragstart = (event) => {
        let cookieDragguee = cookie;
        cookieDragguee.selectionnee();
        this.tabcookieselected = [];
        this.tabcookieselected.push(cookieDragguee);
      }

      img.ondragover = (event) => {
          return false;
        }

      img.ondragenter = (event) => {
        const i = event.target;
        i.classList.add("imgDragStart");
      }

      img.ondragleave = (event) => {
        const i = event.target;
        i.classList.remove("imgDragStart");
      }

      img.ondrop = (event) => {
        let cookieDragguee = cookie;
        cookieDragguee.selectionnee();

        // On ajoute au tableau des cookies séléctionnés le deuxième cookie
        this.tabcookieselected.push(cookieDragguee);

        // On vérifie si on peut interchanger leur position
        if (Cookie.distance(this.tabcookieselected[0], this.tabcookieselected[1]) === 1){
          Cookie.swapCookies(this.tabcookieselected[0], this.tabcookieselected[1]);
          this.tabcookieselected = [];
          this.DetecterEtSupprimerAlignements();
          this.TomberCookies();
          this.ReapparitionCookies();
        }
        else{
          this.tabcookieselected[0].deselectionnee();
          cookieDragguee.deselectionnee();
          this.tabcookieselected = [];
          cookieDragguee.htmlImage.classList.remove("imgDragStart");
        }
      }
      // on affiche l'image dans le div pour la faire apparaitre à l'écran.
      div.appendChild(img);
    });
  }


  getCookieFromLC(ligne, colonne) {
    return this.tabcookies[ligne][colonne];
  }
  
  
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    let tab = create2DArray(9);

    // remplir
    for(let l = 0; l < this.l; l++) {
      for(let c =0; c < this.c; c++) {

        const type = Math.floor(Math.random()*nbDeCookiesDifferents);
        //console.log(type)
        tab[l][c] = new Cookie(type, l, c);
      }
    }

    return tab;
  }

  DetecterEtSupprimerAlignements() {
    // Score des cases cachées
    let scoreCasesCachees = 0;

    // Vérification des alignements en ligne et cache les cookies
    for (let y = 0; y < this.l; y++) {
      for (let x = 0; x < this.c - 2; x++) {
         if ((this.tabcookies[y][x].type === this.tabcookies[y][x + 1].type) && (this.tabcookies[y][x + 1].type === this.tabcookies[y][x + 2].type)) {
          this.tabcookies[y][x].Cachee();
          this.tabcookies[y][x + 1].Cachee();
          this.tabcookies[y][x + 2].Cachee();
         }
       }
   }
   for (let x = 0; x < this.c; x++) {
    for (let y = 0; y < this.l - 2; y++) {
        if (this.tabcookies[y][x].type === this.tabcookies[y + 1][x].type && this.tabcookies[y + 1][x].type === this.tabcookies[y + 2][x].type) {
            this.tabcookies[y][x].Cachee();
            this.tabcookies[y + 1][x].Cachee();
            this.tabcookies[y + 2][x].Cachee();
        }
    }
   }

   // Ajouter le score
   for (let y = 0; y < this.l; y++) {
    for (let x = 0; x < this.c; x++) {
        if (this.tabcookies[y][x].htmlImage.classList.contains("cookies-cachee")) {
            scoreCasesCachees += 10;
        }
    }
   }
   this.updateScore(scoreCasesCachees);
  }

  // Méthode pour mettre à jour le score
  updateScore(points) {
    score += points;
    let scoreElement = document.getElementById("score");
    scoreElement.textContent = "Score : " + score;
  }

  TomberCookies() {
    // Parcourir chaque colonne de la grille
    for (let x = 0; x < this.c; x++) {
      let compteurNull = 0; // Initialiser le compteur de cookies cachés à zéro pour chaque colonne
      // Parcourir les lignes de bas en haut pour compter les cookies cachés
      for (let y = this.l - 1; y >= 0; y--) {
        if (this.tabcookies[y][x].htmlImage.classList.contains("cookies-cachee")) {
          compteurNull++; // Incrémenter le compteur si un cookie caché est trouvé
        }
      }
      // Si des cookies cachés sont présents dans la colonne
      if (compteurNull > 0) {
        // Déplacer les cookies cachés vers le bas
        for (let y = this.l - 1; y >= 0; y--) {
          // Si un cookie caché est trouvé dans la cellule
          if (this.tabcookies[y][x].htmlImage.classList.contains("cookies-cachee")) {
            let compteur = 1; // Initialiser le compteur de décalage à 1
            // Décaler le cookie caché vers le bas jusqu'à ce qu'il atteigne le bas de la grille ou qu'il n'y ait plus de cookie caché en dessous
            while (y + compteur < this.l && this.tabcookies[y + compteur][x].htmlImage.classList.contains("cookies-cachee")) {
              compteur++; // Incrémenter le compteur de décalage
            }
            // Vérifier si la ligne suivante existe avant d'accéder à l'élément
            if (this.tabcookies[y + compteur - 1]) {
              // Échanger les cookies entre la position actuelle et la position juste en dessous
              Cookie.swapCookies(this.tabcookies[y][x], this.tabcookies[y + compteur - 1][x]);
            }
          }
        }
      }
    }
  }



  ReapparitionCookies() {
    // Pour chaque cookie caché, je le remplace par un nouveau cookie avec des données aléatoires puis je remets l'image dans le div
    for (let y = 0; y < this.l; y++) {
      for (let x = 0; x < this.c; x++) {
          if (this.tabcookies[y][x].htmlImage.classList.contains("cookies-cachee")) {
              this.tabcookies[y][x] = new Cookie(Math.floor(Math.random()*6), y, x);
              this.tabcookies[y][x].htmlImage.src = Cookie.urlsImagesNormales[this.tabcookies[y][x].type];
          }
      }
    }
    this.showCookies(); // Réinitialiser les événements pour les nouveaux cookies
  }
}