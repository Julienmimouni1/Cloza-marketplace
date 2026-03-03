# Story 6.2 : Advanced Vendor Product Integration (Import de Masse & Sync)

## 1. Objectif
Faciliter l'onboarding et la gestion quotidienne des vendeurs en leur permettant d'importer leur catalogue produit existant sans saisie manuelle fastidieuse.

## 2. User Stories

### US-1 : Import de Masse (CSV/XLSX)
**En tant que** Vendeur,
**Je veux** pouvoir uploader un fichier CSV ou Excel contenant mes produits,
**Afin de** créer ou mettre à jour mon catalogue en une seule opération.

**Critères d'Acceptation :**
- [ ] Bouton "Import / Export" sur la page `/vendor/products`.
- [ ] Possibilité de télécharger un **gabarit (template)** CSV/Excel respectant le schéma actuel (Nom, Description, Prix, SKU, Stock, etc.).
- [ ] Validation des données uploadées (types, champs obligatoires) avec rapport d'erreurs précis (ex: "Erreur ligne 4 : Prix invalide").
- [ ] Support de la création (nouveaux produits) et de la mise à jour (basée sur le SKU).

### US-2 : Connexion Site Externe (MVP)
**En tant que** Vendeur,
**Je veux** connecter mon site e-commerce existant (ex: Shopify, WooCommerce) via une clé API ou un flux,
**Afin que** mes produits sur Cloza soient synchronisés automatiquement.

**Critères d'Acceptation :**
- [ ] Nouvelle section "Intégrations" dans le dashboard vendeur.
- [ ] Formulaire de configuration pour ajouter une source externe (URL, API Key).
- [ ] Mapping basique des champs (Titre -> Titre, Prix -> Prix).
- [ ] Bouton "Synchroniser maintenant" pour lancer une récupération manuelle.

---

## 3. Implémentation Technique

### Architecture de Données (Prisma)
Ajout d'un modèle pour gérer les connexions externes :

```prisma
model ExternalIntegration {
  id          String   @id @default(cuid())
  vendorId    String
  type        String   // "SHOPIFY", "WOOCOMMERCE", "GENERIC_CSV"
  config      Json     // Stockage sécurisé des API Keys / Endpoints
  lastSync    DateTime?
  status      String   // "ACTIVE", "ERROR"
  vendor      Vendor   @relation(fields: [vendorId], references: [id])
}
```

### Frontend (Next.js)
1.  **Composant `ProductImportModal`** :
    - Utilisation de `react-dropzone` pour l'upload.
    - Parsing client-side (ou server-side) du CSV.
    - Prévisualisation des données avant validation.
2.  **Page `IntegrationSettings`** :
    - Formulaire sécurisé pour les credentials.

### Backend (Server Actions)
1.  **Action `bulkCreateProducts`** :
    - Reçoit un tableau de produits validés par Zod (`productSchema`).
    - Exécute une transaction `prisma.product.createMany` pour la performance.
2.  **Service `ExternalSyncService`** :
    - Pattern "Adapter" pour gérer différentes sources (ShopifyAdapter, WooAdapter).
    - Logique de mapping des données externes vers le format interne Cloza.

## 4. Plan de déploiement
1.  Implémenter le modèle Prisma `ExternalIntegration`.
2.  Développer la fonctionnalité d'import CSV (priorité haute pour l'onboarding immédiat).
3.  Développer le connecteur générique ou Shopify (MVP Sync).
