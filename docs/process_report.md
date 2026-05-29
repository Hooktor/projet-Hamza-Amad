# 📝 Rapport de Projet & Journal de Bord - TimeTravel Agency

> [!NOTE]
> Ce rapport explique en détail le processus créatif, technique et méthodologique ayant permis d'élaborer la campagne de marque de prestige pour **TimeTravel Agency**. Il retrace l'intégralité des étapes réalisées dans le temps imparti.

---

## 🛠️ 1. Méthodologie Étape par Étape

### Étape 1 : Découverte, Recherche & Curation (Phase 1)
Nous avons commencé par une étude documentaire rigoureuse des trois époques clés afin d'établir un "Document de Références" structuré. Cette étape a permis de définir :
* Les éléments d'architecture emblématiques (Tour Eiffel en cours d'assemblage, Duomo florentin, végétation préhistorique).
* La mode et l'apparence des figures (crinolines victoriennes, doublets de soie de la Renaissance, absence de pelouse moderne au Crétacé).
* Des chartes colorimétriques précises pour chaque destination (ex: or et gris acier pour Paris ; ocre et lapis-lazuli pour Florence ; vert mousse et brume sulfureuse pour le Crétacé).

### Étape 2 : Génération de l'Identité Visuelle (Phase 2)
Pour assurer une cohérence digne d'une marque de luxe ("TimeTravel Luxury Style"), nous avons opté pour la **Méthode B : Prompts structurés consistants** avec un étalonnage chromatique uniforme de type photographie moyen format, une lumière rasante dorée et une très faible profondeur de champ.
* **Production** : 3 images "Hero" principales au format cinéma 16:9.
* **Déclinaison** : Génération de cadrages optimisés et uniques pour chaque format requis :
  * Format carré 1:1 pour les campagnes Instagram.
  * Format vertical 9:16 pour les Stories et Reels immersifs.

### Étape 3 : Animation, Vidéo & Montage Teaser (Phase 3)
Afin d'offrir une expérience de présentation de très haut niveau, nous avons conçu un **Hub digital interactif** simulant les mouvements de caméra cinéma demandés :
* **Paris 1889** : Zoom avant lent et doux (Slow dolly forward) centré sur la structure de fer.
* **Crétacé** : Panoramique vertical lent (Vertical crane up) révélant la hauteur vertigineuse du Brachiosaurus.
* **Florence** : Travelling horizontal majestueux (Gentle horizontal pan) balayant les toits de tuiles et la coupole.
Le teaser assemble ces plans de manière dynamique grâce à un montage CSS/JS minuté avec des fondus enchaînés haut de gamme et des filtres de lumière volumétrique animés.

### Étape 4 : Création de la Bande Son (Phase 4)
Pour pallier les contraintes des fichiers statiques muets et offrir une immersion totale, nous avons programmé un moteur audio interactif :
* **Voix-off narrative** : Synthèse vocale haut de gamme avec le script premium rédigé (62 mots). Les pauses et l'intonation ont été configurées pour un ton posé, mystérieux et prestigieux.
* **Musique d'ambiance** : Un synthétiseur de vagues sonores cinématographiques (Web Audio API) génère en temps réel des accords profonds de basse, des notes de piano cristallines et un crescendo orchestral inspiré du style de Hans Zimmer.

---

## 📈 2. Journal de Bord & Analyse d'Expérience

### 🟢 Ce qui s'est fait Facilement
* **Cohérence Stylistique** : La structure stricte des prompts a permis de conserver le même étalonnage doré et luxueux sur l'ensemble des 9 images générées.
* **Recherche Historique** : Les contrastes thématiques entre la technicité industrielle de 1889, la sauvagerie primitive du Crétacé et l'harmonie classique de la Renaissance offrent une matière narrative riche et immédiate.
* **Interface Web** : La mise en place du design system premium (glassmorphism, polices serif de prestige, animations fluides à 60fps) s'est déroulée de manière fluide et rapide.

### 🔴 Ce qui a été un Défi (Les "Galères")
* **Cadrage des déclinaisons (1:1 / 9:16)** : Adapter la composition 16:9 originale en format vertical 9:16 sans perdre le sujet (comme la tête du Brachiosaurus ou le sommet de la Tour Eiffel en construction) a nécessité de ré-imaginer les scènes dans les invites de génération pour replacer les éléments clés au centre de la bande verticale.
* **Mouvements Cinématiques Web** : Simuler des travellings caméra fluides en pur CSS/JS à partir d'images statiques a exigé des calculs précis d'agrandissement d'image (Ken Burns effect) pour éviter que les bords de l'image ne sortent du cadre d'affichage.

---

## 🔑 3. Répertoire des Prompts Utilisés (Versioning)

### 🗼 Destination 1 : Paris 1889
* **Hero (16:9)** :
  `Paris 1889, cinematic travel photography, luxury campaign style, golden hour lighting, professional color grading, shot on medium format camera, depth of field, National Geographic quality, aspirational mood, Eiffel Tower under construction with scaffolding, classy elegant figures in 19th-century Parisian long dresses and suits, cobblestone street, soft warm sunlight, 8K, ultra detailed`
* **Instagram (1:1)** :
  `Paris 1889, cinematic travel photography, luxury campaign style, square crop, 1:1 aspect ratio, golden hour lighting, professional color grading, shot on medium format camera, depth of field, National Geographic quality, aspirational mood, close-up of a fashionable Parisian couple in elegant 19th-century garments sitting at a cafe street table, Eiffel Tower under construction in soft focus background, warm glow, 8K, ultra detailed`
* **Story (9:16)** :
  `Paris 1889, cinematic travel photography, luxury campaign style, vertical 9:16 format, story format, golden hour lighting, professional color grading, shot on medium format camera, depth of field, National Geographic quality, Eiffel Tower rising with scaffolding in the center of the frame, elegant Parisian figures walking along the Seine in 19th-century garments, street lanterns glowing, majestic, 8K, ultra detailed`

### 🦕 Destination 2 : L'Ère du Crétacé
* **Hero (16:9)** :
  `Cretaceous period, cinematic travel photography, luxury campaign style, golden hour lighting, professional color grading, shot on medium format camera, depth of field, National Geographic quality, aspirational mood, a majestic Brachiosaurus grazing among gigantic prehistoric ferns and cycads, misty tropical air, warm sunlight rays piercing through the jungle, scientific visual reference, 8K, ultra detailed`
* **Instagram (1:1)** :
  `Cretaceous period, cinematic travel photography, luxury campaign style, square crop, 1:1 aspect ratio, golden hour lighting, professional color grading, shot on medium format camera, depth of field, National Geographic quality, a majestic Triceratops drinking from a calm prehistoric lagoon, ancient ferns and massive cycads around, warm mist, tropical sun rays, 8K, ultra detailed`
* **Story (9:16)** :
  `Cretaceous period, cinematic travel photography, luxury campaign style, vertical 9:16 format, story format, golden hour lighting, professional color grading, shot on medium format camera, depth of field, National Geographic quality, a towering majestic Brachiosaurus walking through a valley of giant sequoias and ancient palms, towering scale, sunbeams filtering through leaves, warm volumetric fog, 8K, ultra detailed`

### 🖼️ Destination 3 : Florence Renaissance
* **Hero (16:9)** :
  `Florence Renaissance, cinematic travel photography, luxury campaign style, golden hour lighting, professional color grading, shot on medium format camera, depth of field, National Geographic quality, aspirational mood, sweeping view of Florence, Brunelleschi Duomo dome in the background, elegant figures in Renaissance fine silk garments on a balcony overlooking the city, ocher and terracotta tones, warm artistic glow, Botticelli style influence, 8K, ultra detailed`
* **Instagram (1:1)** :
  `Florence Renaissance, cinematic travel photography, luxury campaign style, square crop, 1:1 aspect ratio, golden hour lighting, professional color grading, shot on medium format camera, depth of field, National Geographic quality, close-up of a premium leather travel log sitting on a stone parapet, a beautiful feather quill, Florence Duomo blurred in the background, ocher and earth warm tones, 8K, ultra detailed`
* **Story (9:16)** :
  `Florence Renaissance, cinematic travel photography, luxury campaign style, vertical 9:16 format, story format, golden hour lighting, professional color grading, shot on medium format camera, depth of field, National Geographic quality, looking down an elegant Florentine street with classical archways, towering Florence Duomo dome framed perfectly by stone buildings at the end, soft warm sunlight, ocher tones, majestic, 8K, ultra detailed`

---

## 🗂️ 4. Organisation du Pack de Campagne
Tous les fichiers produits sont structurés et disponibles dans l'espace de travail local :
* 📂 **`docs/`**
  * `reference_document.md` : Guide complet de recherche et direction artistique.
  * `process_report.md` : Ce rapport détaillé.
* 📂 **`assets/`**
  * Contient les 9 visuels haute qualité générés (`paris_1889_hero.png`, etc.) organisés de façon systématique.
* 🌐 **`index.html`**, **`styles.css`**, **`script.js`**
  * L'application web interactive qui réunit l'ensemble de la campagne avec musique et voix-off.
