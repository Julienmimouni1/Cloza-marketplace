# Spécification Technique : Intégration Vendeur (Shopify)

**Date :** 21 Janvier 2026
**Auteur :** L'équipe BMAD (Paige, Winston, Sally)
**Statut :** En cours d'implémentation

## 1. Objectif
Permettre aux vendeurs de connecter leur boutique Shopify à Cloza pour :
1.  Synchroniser automatiquement le catalogue (Produits, Variantes, Images, Prix).
2.  Synchroniser les stocks en temps réel (Webhooks).
3.  Centraliser la gestion sur le Dashboard Vendeur Cloza.

## 2. Architecture Technique

### 2.1 Modèle de Données (Prisma)
Ajout d'un modèle `VendorIntegration` lié au `Store` (ou `Company`).

```prisma
model VendorIntegration {
  id             String   @id @default(cuid())
  vendorId       String
  provider       String   // "SHOPIFY"
  storeUrl       String
  accessToken    String   // Chiffré (AES)
  scope          String?
  isActive       Boolean  @default(true)
  lastSyncAt     DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  vendor         Vendor   @relation(fields: [vendorId], references: [id])
}
```

### 2.2 Flux d'Authentification (OAuth)
1.  Vendeur clique sur "Connecter Shopify" sur Cloza.
2.  Redirection vers l'URL OAuth Shopify (`/admin/oauth/authorize`).
3.  Shopify redirige vers Cloza (`/api/integrations/shopify/callback`).
4.  Cloza échange le code temporaire contre un `access_token` permanent.
5.  Cloza enregistre l'intégration et lance une synchronisation initiale (Job asynchrone).

### 2.3 Synchronisation (Webhooks)
Cloza s'abonnera aux topics Shopify suivants :
-   `products/create`
-   `products/update`
-   `products/delete`
-   `inventory_levels/update`

**Endpoint :** `POST /api/webhooks/shopify`
**Sécurité :** Vérification de la signature HMAC Shopify.

## 3. Interface Utilisateur (UX)

### Page : `/vendor/dashboard/integrations`
-   Carte "Shopify" avec statut (Connecté/Non connecté).
-   Bouton "Connecter" ou "Gérer".
-   Logs de synchronisation récents (Succès/Échec).

## 4. Plan de Tests
-   [ ] Unit : Chiffrement/Déchiffrement des tokens.
-   [ ] Integration : Flux OAuth complet avec une boutique Sandbox.
-   [ ] E2E : Réception d'un webhook simulé et mise à jour du stock en DB.
