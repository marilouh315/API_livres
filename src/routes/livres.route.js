const express = require('express');
const router = express.Router();
const livresController = require('../controllers/livres.controller');

// Afficher tous les livres
router.get('/all', livresController.afficherTousLivres);
//Afficher les livres de la bibliothèque personnelle
router.get('/bibli', livresController.afficherBibli);
//Afficher les détails d'un livre
router.get('/:ISBN', livresController.afficherDetailsLivre);
//Afficher tous les livres favoris 
router.get('/favoris/all', livresController.afficherFavoris);

//Afficher les appreciations pour un livre
router.get('/appreciation/:ISBN', livresController.afficherAppreciation);
//Ajouter une appreciation
router.post('/appreciation', livresController.ajouterAppreciation);

//Ajouter un livre à la bibliothèque personnelle
router.post('/bibli/:ISBN', livresController.ajouterLivreBibli);
//Retirer un livre de la bibliothèque personnelle
router.delete('/bibli/:ISBN', livresController.retirerLivreBibli);

//Modifier le statut d'un livre
router.put('/', livresController.modifierStatutLivre);

//Modifier le statut d'un livre *****FAIT
//Ajouter un livre à la bibliothèque personnelle *******FAIT
//Retirer un livre de la bibliothèque personnelle (DELETE) ********FAIT
//TRIAGE : par statut, par genre, par type, par appreciation (etoiles)
//Afficher liste de favoris *****FAIT
//Ajouter une appreciataion ******FAIT
//Afficher les appreciations pour un livre ******FAIT


module.exports = router;

