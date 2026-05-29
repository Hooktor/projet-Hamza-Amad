# 🧭 TimeTravel Agency — Luxury Temporal Web Application

Bienvenue dans le dépôt officiel de la **TimeTravel Agency**, une application web interactive ultra-premium conçue pour une clientèle d'élite désireuse d'explorer les couloirs du temps. 

Cette plateforme fusionne un design **glassmorphic sombre aux accents d'or**, des **panoramas visuels en 8K**, un **moteur audio procédural immersif**, une **synthèse vocale narrative**, et des **modules interactifs avancés** (Quiz d'Affinité, Salon de Réservation Prestige, et Compagnon Conversationnel Temporel).

---

## 🌟 Fonctionnalités Clés

### 1. 🧭 Test d'Affinité Temporelle (Interactive Quiz)
Un questionnaire exclusif en **4 étapes** qui analyse vos aspirations et sensibilités afin de déterminer votre époque d'âme :
* **Paris 1889 (La Belle Époque)** : Raffinement mondain et effervescence industrielle.
* **Le Crétacé sauvage** : Frisson primitif et contact direct avec les géants de la Terre.
* **Florence Renaissance (1505)** : Harmonie classique, humanisme et éveil des sens artistiques.
* *Fonctionnalité Premium :* Le résultat propose un bouton d'action immédiat qui pré-remplit le passeport de réservation et y fait défiler le client de manière fluide.

### 2. 🛎️ Salon de Réservation Prestige (Booking Engine)
Un module de simulation de devis ultra-détaillé et interactif connecté à un **passeport chronologique dynamique** :
* **Calculateur en temps réel** prenant en compte :
  * Le tarif de base de la destination choisie (Paris : 15k€, Florence : 25k€, Crétacé : 75k€).
  * Le nombre d'explorateurs (multiplicateur direct).
  * La classe de corridor temporel choisi (*Impériale* : x1.50, *Signature* : x1.25, *Observateur* : x1.00).
  * Les options deluxe sélectionnées (*Assurance Paradoxe Temporel*, *Pack Vêtements d'Époque*, *Chronomètre de Luxe*).
* **Générateur automatique de reçus chronologiques** avec numéros de série dynamiques et validation quantique.
* **Modal de confirmation quantique** avec des informations sur le vol de corridor Alcubierre stabilisé.

### 3. 💬 Léo, le Chrono-Guide (Conversational AI Chatbot)
Un widget conversationnel flottant, glassmorphic et animé :
* Configuré avec une personnalité de **guide érudit, courtois et enthousiaste**.
* Capable de répondre de manière fluide et détaillée aux requêtes sur les tarifs, la sécurité, les dresscodes, les paradoxes temporels, et les trois destinations historiques majeures.
* Intègre des **puces de réponse rapide** (chips) pour une navigation fluide sur mobile et desktop.
* Connecté au moteur de **synthèse vocale (Web Speech API)** pour dicter à voix haute et chaleureuse les réponses au client.

### 4. 🎵 Console Harmonique & Visualiseur (Web Audio API)
* Un **synthétiseur procédural en temps réel** modélisant des nappes graves à la Hans Zimmer et des arpeggios cristallins de piano changeant dynamiquement de tonalité en fonction de l'époque sélectionnée !
* Un visualiseur audio sur Canvas 2D dessinant des vagues néons dorées et ivoires synchronisées sur le signal d'oscillation.
* Un lecteur de **narration audio immersive** avec suivi de mots en temps réel pour surligner le texte d'époque narré.

---

## 🎨 Charte Graphique & Jetons de Design

Inspirée directement de la charte créative originale, notre identité visuelle repose sur le noir sidéral et l'or de luxe, complétés par des palettes dédiées à chaque époque :

* **Couleurs Institutionnelles** :
  * Or Temporel (`#D4AF37`) & Bronze (`#C29F65`)
  * Fond Sidéral sombre (`#07090b`)
  * Verre acrylique (`rgba(17, 20, 25, 0.65)`)

* **Palettes Historiques** :
  * 🗼 **Paris 1889** : Gris Acier Eiffel (`#4F5D75`) & Rouge Opéra (`#7A1C2E`)
  * 🦕 **Crétacé originel** : Vert Cycade (`#1C3A27`) & Bleu Lagon (`#2B506E`)
  * 🖼️ **Florence Renaissance** : Sienne brûlée (`#A85A32`) & Lapis-Lazuli (`#1E3A8A`)

---

## 🛠️ Stack Technique

* **Structure & Sémantique** : HTML5, FontAwesome v6 (icônes premium).
* **Styles & Animations** : CSS3 natif (Zéro dépendance de framework type Tailwind afin de garantir un contrôle millimétré de la charte de luxe), Gradients linéaires, Flous d'arrière-plan (`backdrop-filter`), animations clés.
* **Interactions & Logique** : Vanilla ES6+ JavaScript.
* **Animations au Défilement** : IntersectionObserver natif pour des apparitions progressives et fluides.
* **Audio & Voix** : Web Audio API (oscillateurs, filtres de gain quantiques), Web Speech Synthesis (voix narratives françaises chaleureuses).

---

## 🚀 Lancement Local

L'application est entièrement **offline-first** et autonome. Elle ne nécessite aucun jeton d'API externe ou de serveur lourd.

Pour lancer l'application en local :

1. Ouvrez votre terminal dans le répertoire racine du projet.
2. Lancez un serveur HTTP statique léger (par exemple, avec Python) :
   ```bash
   python -m http.server 8080
   ```
3. Ouvrez votre navigateur et accédez à :
   `http://localhost:8080`

---

## 👥 Crédits & Remerciements

* **Direction Créative** : Campagne interactive de luxe de la TimeTravel Agency.
* **Ingénierie IA** : Antigravity (Google DeepMind Advanced Agentic Coding Team).
* **Modèles Visuels** : Générés via des modèles génératifs d'images en 8K ultra-réalistes (Midjourney / Imagen).
* **Conception Audio** : Synthétiseur procédural Web Audio modélisé par synthèse additive.
