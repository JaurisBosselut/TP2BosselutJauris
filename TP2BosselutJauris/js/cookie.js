// Définition de la classe Cookie
export default class Cookie {
  // Propriétés de la classe
  ligne = 0; // Ligne du cookie dans la grille
  colonne = 0; // Colonne du cookie dans la grille
  type = 0; // Type de cookie
  htmlImage = undefined; // Image HTML représentant le cookie

  // Tableaux des URLs des images normales et surlignées des cookies
  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];

  // Constructeur de la classe Cookie
  constructor(type, ligne, colonne) {
    this.type = type; // Initialisation du type de cookie
    this.ligne = ligne; // Initialisation de la ligne du cookie
    this.colonne = colonne; // Initialisation de la colonne du cookie

    const url = Cookie.urlsImagesNormales[type]; // URL de l'image normale du cookie

    // Création de l'élément image avec le DOM
    let img = document.createElement("img");
    img.src = url;
    img.width = 80;
    img.height = 80;
    img.dataset.ligne = ligne; // Attribution de l'attribut "data-ligne"
    img.dataset.colonne = colonne; // Attribution de l'attribut "data-colonne"

    this.htmlImage = img; // Attribution de l'image HTML à la propriété htmlImage
  }

  // Méthode pour mettre en surbrillance le cookie
  selectionnee() {
    this.htmlImage.src = Cookie.urlsImagesSurlignees[this.type];
    this.htmlImage.classList.add("cookies-selected");
  }

  // Méthode pour désélectionner le cookie
  deselectionnee() {
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
    this.htmlImage.classList.remove("cookies-selected");
  }

  // Méthode statique pour échanger deux cookies
  static swapCookies(c1, c2) {
    // Échange des images et des types des cookies
    const ImageCookie2 = c2.htmlImage.src;
    c2.htmlImage.src = c1.htmlImage.src;
    c1.htmlImage.src = ImageCookie2;

    const TypeCookie2 = c2.type;
    c2.type = c1.type;
    c1.type = TypeCookie2;

    // Désélection des cookies
    c1.deselectionnee();
    c2.deselectionnee();
  }
  
  // Méthode statique pour calculer la distance entre deux cookies
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    // Calcul de la distance entre les deux cookies
    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    console.log("Distance = " + distance);
    return distance;
  }

  // Méthode pour cacher le cookie
  Cachee() {
    this.htmlImage.classList.add("cookies-cachee");
  }
}
