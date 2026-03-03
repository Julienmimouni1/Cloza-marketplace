# [1-7] Seeding de Données Produits Massif & Architecture Catalogue

**Status:** Done
**Assignee:** Dev Agent
**Priority:** High
**Last Updated:** 14 Jan 2026

## User Story
En tant que développeur, je veux peupler la base de données avec un large volume de produits réalistes et structurer la navigation pour garantir une expérience utilisateur fluide ("Consumer-Grade"), où chaque produit est accessible précisément via la recherche, le menu ou les catégories.

## Context
Le projet dispose d'une structure de catégories détaillée dans `old_version_cloza/_legacy/Cloza - Menu Structure.csv`.
**Évolution du besoin :** Le seed initial simple n'était pas suffisant. Pour garantir une navigation précise (sans "faux positifs" dans les résultats de recherche), nous avons dû faire évoluer le modèle de données et la logique de filtrage.

## Acceptance Criteria (Mise à jour v2)

### 1. Modèle de Données (Schema Upgrade)
- [x] **Modification Schema Prisma :** Ajout explicite des champs `subCategory` (L2) et `leafCategory` (L3) au modèle `Product`.
    *   *Justification :* Le filtrage par texte (fuzzy matching) dans la description était trop imprécis.
- [x] **Migration Base de Données :** Migration appliquée et base de données réinitialisée.

### 2. Stratégie de Seeding (High Volume)
- [x] Le script de seed (`prisma/seed.ts`) lit et parse `old_version_cloza/_legacy/Cloza - Menu Structure.csv`.
- [x] **Densification :** Génération de **10 produits** (vs 5 initialement) pour chaque feuille (L3) de l'arbre.
    *   *Total :* ~770 produits générés.
- [x] **Persistance des Données :**
    - Mapping L1 -> `Category` Enum (Textile, Beauty, Food).
    - Sauvegarde L2 -> Champ `subCategory` (ex: "Facial Care").
    - Sauvegarde L3 -> Champ `leafCategory` (ex: "Cleansers & Toners").
- [x] **Qualité des Données :**
    - Prix réalistes (20€ - 500€).
    - Images Unsplash thématiques par catégorie.
    - SKUs et Slugs uniques.

### 3. Navigation & Filtrage (Universal Access)
- [x] **Refonte du Filtrage (`src/app/catalog/page.tsx`) :**
    - Logique stricte : Utilisation de `AND` entre la recherche et la catégorie.
    - Ciblage précis : La recherche par catégorie cible désormais les colonnes `subCategory` OU `leafCategory` (exact match).
- [x] **Architecture des Menus (`src/lib/menu-data.ts`) :**
    - Centralisation : Une seule source de vérité pour le MegaMenu, le Menu Mobile et la section "Shop By Category".
    - **Normalisation des URLs :** Utilisation systématique du paramètre query `/catalog?category=...`.
    - **Gestion des Caractères Spéciaux :** Encodage strict des URLs (ex: `&` devient `%26`) pour supporter les catégories complexes comme "Biscuits, Chocolate & Sweets" sans casser le parsing.
- [x] **Accessibilité Totale :** Vérification que tous les produits sont accessibles via :
    - La barre de recherche (Header).
    - Le MegaMenu (Desktop).
    - Le Menu Mobile (Burger).
    - La section "Shop By Category" (Homepage).

## Technical Implementation Details
- **Schema Changes:**
  ```prisma
  model Product {
    // ...
    subCategory  String? // Added
    leafCategory String? // Added
  }
  ```
- **URL Strategy:**
  - Before: `/beauty-wellness/facial-care` (Static routes, hard to maintain dynamic filtering)
  - After: `/catalog?category=Facial%20Care` (Dynamic, filter-based, robust)

## Notes
Cette implémentation dépasse la demande initiale pour assurer une base solide au e-commerce B2B. L'architecture supporte maintenant des milliers de produits sans confusion de catégorisation.