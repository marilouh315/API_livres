const livresModel = require("../models/livres.model.js");

/**
 * Afficher TOUS les livres
 * @param {*} req 
 * @param {*} res 
 */
exports.afficherTousLivres = (req, res) => {
    livresModel.afficherTousLivres()
    .then((livre_resultats) => {
        console.log(livre_resultats);
        if (!livre_resultats) {
            res.status(404).json;
            res.send({
                erreur: `Données non trouvées.`,
                message: `Aucun livres ont été trouvés dans la base de données ou données inexistantes.`
            })
            return;
        }
        else {
            res.status(200).json({
                result: livre_resultats,
            });
        }
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).json
        res.send({
            erreur: `Erreur serveur`,
            message: "Erreur lors de la récupération des livres."
        });
    });
}

/**
 * Afficher les détails d'un livre
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.afficherDetailsLivre = (req, res) => {
    const ISBN = parseInt(req.params.ISBN);

    if (!ISBN || ISBN <= 0 || isNaN(ISBN) || ISBN == undefined) {
        res.status(400).json;
        res.send({
            erreur: `Erreur des données.`,
            message: `L'ISBN est invalide. Il est obligatoire et doit être un nombre.`,
            champs_manquants: ["ISBN"]
        })
        return;
    }

    livresModel.verifierExistenceISBN(ISBN)
    .then((ISBN_existe) => {
        if (ISBN_existe == false || ISBN_existe <= 0) {
            res.status(404).json;
            res.send({
                erreur: `Données non trouvées.`,
                message: `L'ISBN ${ISBN} n'existe pas dans la base de données.`
            })
            return;
        }
        else {
            livresModel.afficherDetailsLivre(ISBN)
            .then((livre_resultat) => {
                if (!livre_resultat) {
                    res.status(404).json;
                    res.send({
                        erreur: `Données non trouvées.`,
                        message: `Aucun détails de livre ont été trouvés dans la base de données ou données inexistantes.`
                    })
                    return;
                }
                else {
                    res.status(200).json({
                        result: livre_resultat,
                    });
                }
            })
            .catch((erreur) => {
                console.log('Erreur : ', erreur);
                res.status(500).json
                res.send({
                    erreur: `Erreur serveur`,
                    message: "Erreur lors de la récupération des détails de livre."
                });
            });
        }
        
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).json
        res.send({
            erreur: `Erreur serveur`,
            message: "Erreur lors de la vérification de l'ISBN."
        });
    });
}

/**
 * Afficher les livres de la bibliothèque personnelle
 * @param {*} req 
 * @param {*} res 
 */
exports.afficherBibli = (req, res) => {
    livresModel.afficherBibli()
    .then((bibli_resultats) => {
        if (!bibli_resultats) {
            res.status(404).json;
            res.send({
                erreur: `Données non trouvées.`,
                message: `Aucun livres de la bibliothèque ont été trouvés.`
            })
            return;
        }
        else {
            res.status(200).json({
                result: bibli_resultats,
            });
        }
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).json
        res.send({
            erreur: `Erreur serveur`,
            message: "Erreur lors de la récupération des livres."
        });
    });
}

/**
 * Ajouter un livre à la bibliothèque personnelle
 * @param {*} req 
 * @param {*} res 
 * @returns Retourne un message de confirmation
 */
exports.ajouterLivreBibli = (req, res) => {
    const ISBN = parseInt(req.params.ISBN);
    console.log(ISBN);

    if (!ISBN || ISBN <= 0 || isNaN(ISBN) || ISBN == undefined) {
        res.status(400).json;
        res.send({
            erreur: `Erreur des données.`,
            message: `L'ISBN est invalide. Il est obligatoire et doit être un nombre.`,
            champs_manquants: ["ISBN"]
        })
        return;
    }

    livresModel.verifierExistenceISBN(ISBN)
    .then((ISBN_existe) => {
        if (!ISBN_existe || ISBN_existe <= 0){
            res.status(404).json;
            res.send({
                erreur: `Données non trouvées.`,
                message: `L'ISBN ${ISBN} n'existe pas dans la base de données.`
            })
            return;
        }
        else {
            livresModel.verifierISBNBibli(ISBN)
            .then ((ISBN_bibli_existe) => {
                if (ISBN_bibli_existe) {
                    res.status(400).json;
                    res.send({
                        erreur: `Erreur des données.`,
                        message: `Le livre avec l'ISBN ${ISBN} est déjà dans la bibliothèque.`
                    })
                    return;
                }
                else {
                    livresModel.ajouterLivreBibli(ISBN)
                    .then((resultat) => {
                        res.status(200).json;
                        res.send({
                            message: `Le livre avec l'ISBN ${ISBN} a été ajouté à la bibliothèque.`
                        })
                    })
                    .catch((erreur) => {
                        console.log('Erreur : ', erreur);
                        res.status(500).json
                        res.send({
                            erreur: `Erreur serveur`,
                            message: "Erreur lors de l'ajout du livre à la bibliothèque."
                        });
                    });
                }
            })
        }
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).json
        res.send({
            erreur: `Erreur serveur`,
            message: "Erreur lors de la vérification de l'ISBN."
        });
    });
}

/**
 * Retire un livre de la bibliothèque personnelle
 * @param {*} req 
 * @param {*} res 
 * @returns Retourne un message de confirmation
 */
exports.retirerLivreBibli = (req, res) => {
    const ISBN = parseInt(req.params.ISBN);

    if (!ISBN || ISBN <= 0 || isNaN(ISBN) || ISBN == undefined) {
        res.status(400).json;
        res.send({
            erreur: `Erreur des données.`,
            message: `L'ISBN est invalide. Il est obligatoire et doit être un nombre.`,
            champs_manquants: ["ISBN"]
        })
        return;
    }

    livresModel.verifierISBNBibli(ISBN)
    .then((ISBN_bibli_existe) => {
        if (!ISBN_bibli_existe || ISBN_bibli_existe <= 0){
            res.status(404).json;
            res.send({
                erreur: `Données non trouvées.`,
                message: `L'ISBN ${ISBN} n'existe pas dans la bibliothèque. Pour retirer un livre de la bibliothèque, il doit être présent dans la bibliothèque.`
            })
            return;
        }
        else {
            livresModel.retirerLivreBibli(ISBN)
            .then((resultat) => {
                res.status(200).json;
                res.send({
                    message: `Le livre avec l'ISBN ${ISBN} a été retiré de la bibliothèque.`
                })
            })
            .catch((erreur) => {
                console.log('Erreur : ', erreur);
                res.status(500).json
                res.send({
                    erreur: `Erreur serveur`,
                    message: "Erreur lors du retrait du livre de la bibliothèque."
                });
            });
        }
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).json
        res.send({
            erreur: `Erreur serveur`,
            message: "Erreur lors de la vérification de l'ISBN dans la bibli."
        });
    });
}

/**
 * Affiche tous les livres étant favoris 
 * @param {*} req 
 * @param {*} res 
 * @returns Retourne les livres favoris
 */
exports.afficherFavoris = (req, res) => {
    livresModel.afficherFavoris()
    .then((favoris_resultats) => {
        if (!favoris_resultats) {
            res.status(404).json;
            res.send({
                erreur: `Données non trouvées.`,
                message: `Aucun livres ont été trouvés dans la base de données ou données inexistantes.`
            })
            return;
        }
        else {
            res.status(200).json({
                result: favoris_resultats,
            });
        }
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).json
        res.send({
            erreur: `Erreur serveur`,
            message: "Erreur lors de la récupération des livres."
        });
    });
}

/**
 * Afficher les appréciations pour un livre
 * @param {*} req 
 * @param {*} res 
 * @returns Retourne les appréciations ou un message indiquant qu'il n'y a pas d'appréciation
 */
exports.afficherAppreciation = (req, res) => {
    const ISBN = parseInt(req.params.ISBN);
    console.log(ISBN);

    if (!ISBN || ISBN <= 0 || isNaN(ISBN) || ISBN == undefined) {
        res.status(400).json;
        res.send({
            erreur: `Erreur des données.`,
            message: `L'ISBN est invalide. Il est obligatoire et doit être un nombre.`,
            champs_manquants: ["ISBN"]
        })
        return;
    }

    livresModel.verifierExistenceISBN(ISBN)
    .then((ISBN_existe) => {
        if (ISBN_existe == false || ISBN_existe <= 0) {
            res.status(404).json;
            res.send({
                erreur: `Données non trouvées.`,
                message: `L'ISBN ${ISBN} n'existe pas dans la base de données.`
            })
            return;
        }
        else {
            livresModel.verifierAppreciation(ISBN)
            .then((appreciation_existe) => {
                if (appreciation_existe == false || appreciation_existe <= 0) {
                    res.status(404).json;
                    res.send({
                        erreur: `Données non trouvées.`,
                        message: `Il n'y a pas encore d'appréciation pour le livre avec l'ISBN ${ISBN}.`
                    })
                    return;
                }
                else {
                    livresModel.afficherAppreciation(ISBN)
                    .then((appreciation_resultat) => {
                        if (!appreciation_resultat) {
                            res.status(404).json;
                            res.send({
                                erreur: `Données non trouvées.`,
                                message: `Aucune appréciation pour le livre avec l'ISBN ${ISBN} n'a été trouvée.`
                            })
                            return;
                        }
                        else {
                            res.status(200).json({
                                result: appreciation_resultat,
                            });
                        }
                    })
                    .catch((erreur) => {
                        console.log('Erreur : ', erreur);
                        res.status(500).json
                        res.send({
                            erreur: `Erreur serveur`,
                            message: "Erreur lors de la récupération des appréciations."
                        });
                    });
                }
            })
            .catch((erreur) => {
                console.log('Erreur : ', erreur);
                res.status(500).json
                res.send({
                    erreur: `Erreur serveur`,
                    message: "Erreur lors de la vérification de l'appréciation."
                });
            });
        } 
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).json
        res.send({
            erreur: `Erreur serveur`,
            message: "Erreur lors de la vérification de l'ISBN."
        });
    });
}

/**
 * Ajouter une appréciation pour un livre
 * @param {*} req 
 * @param {*} res 
 * @returns Retourne l'appréciation ajoutée ou un message d'erreur
 */
exports.ajouterAppreciation = (req, res) => {  
     const {
        titre_appreciation,
        commentaire,
        nbre_etoiles,
        isbn
    } = req.body;

    const champsManquants = [];

    // Vérification de chaque champ et ajout à champsManquants s'il est manquant
    if (!titre_appreciation) champsManquants.push("titre_appreciation");
    if (!commentaire) champsManquants.push("commentaire");
    if (!nbre_etoiles) champsManquants.push("nbre_etoiles");
    if (!isbn) champsManquants.push("isbn");
    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: `Donnée(s) non valide(s).`,
            message: `Le format des données est invalide.`,
            champs_manquants: champsManquants
        });
    }

    livresModel.verifierExistenceISBN(isbn)
    .then((ISBN_existe) => {
        if (ISBN_existe == false || ISBN_existe <= 0) {
            res.status(404).json;
            res.send({
                erreur: `Données non trouvées.`,
                message: `L'ISBN ${isbn} n'existe pas dans la base de données.`
            })
            return;
        }
        else {
            livresModel.ajouterAppreciation(titre_appreciation, commentaire, nbre_etoiles, isbn)
            .then((appreciation_ajoute) => {
                if (!appreciation_ajoute) {
                    res.status(404).json;
                    res.send({
                        erreur: `Données non trouvées.`,
                        message: `L'appréciation n'a pas pu être ajoutée.`
                    })
                    return;
                }
                else {
                    res.status(200).json({
                        message: `L'appréciation a été ajoutée avec succès!`,
                        appreciation_ajoute: {
                            titre_appreciation: titre_appreciation,
                            commentaire: commentaire,
                            nbre_etoiles: nbre_etoiles,
                            isbn: isbn
                        }
                    });
                }
            })
            .catch((erreur) => {
                console.log('Erreur : ', erreur);
                res.status(500).json
                res.send({
                    erreur: `Erreur serveur`,
                    message: "Erreur lors de l'ajout de l'appréciation."
                });
            });
        }
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).json
        res.send({
            erreur: `Erreur serveur`,
            message: "Erreur lors de la vérification de l'ISBN."
        });
    });
}

/**
 * Modifie le statut d'un livre
 * @param {*} req 
 * @param {*} res 
 * @returns Retourne un message de confirmation et les données modifiées sinon un message
 */
exports.modifierStatutLivre = (req, res) => {
    const {
        statut,
        ISBN
    } = req.body;

    const champsManquants = [];
    let statutsEncodes;

    if (statut == 0) {
        statutsEncodes = "à lire";
    }
    else if (statut == 1) {
        statutsEncodes = "déjà lu";
    }
    else {
        return res.status(400).json({
            erreur: `Donnée(s) non valide(s).`,
            message: `Le format du champ (statut) doit être un nombre entier (0 ou 1). 0 = à lire, 1 = déjà lu.`,
            champs_manquants: ["statut"]
        });
    }

    if (!ISBN || ISBN <= 0 || isNaN(ISBN) || ISBN == undefined) {
        res.status(400).json;
        res.send({
            erreur: `Erreur des données.`,
            message: `L'ISBN est invalide. Il est obligatoire et doit être un nombre.`,
            champs_manquants: ["ISBN"]
        })
        return;
    }

    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: `Donnée(s) non valide(s).`,
            message: `Le format des données est invalide. Tous les champs sont obligatoires.`,
            champs_manquants: champsManquants
        });
    }

    livresModel.verifierExistenceISBN(ISBN)
    .then((ISBN_existe) => {
        if (ISBN_existe == false || ISBN_existe <= 0) {
            res.status(404).json;
            res.send({
                erreur: `Données non trouvées.`,
                message: `L'ISBN ${ISBN} n'existe pas dans la base de données.`
            })
            return;
        }
        else {
            livresModel.verifieStatutLivre(ISBN)
            .then((statut_livre) => {
                if (statut_livre == statutsEncodes) {
                    res.status(409).json;
                    res.send({
                        erreur: `Conflit d'envoi.`,
                        message: `Le statut du livre est déjà "${statutsEncodes}". Tu ne peux pas modifier le statut du livre pour le même statut.`
                    })
                    return;
                }
                else {
                    livresModel.modifierStatutLivre(statutsEncodes, ISBN)
                    .then((statut_modifie) => {
                        if (!statut_modifie) {
                            res.status(404).json;
                            res.send({
                                erreur: `Données non trouvées.`,
                                message: `Le statut du livre n'a pas pu être modifié.`
                            })
                            return;
                        }
                        else {
                            res.status(200).json({
                                message: `Le statut du livre a été modifié avec succès!`,
                                statut_modifie: {
                                    statut: statutsEncodes,
                                    ISBN: ISBN
                                }
                            });
                        }
                    })
                    .catch((erreur) => {
                        console.log('Erreur : ', erreur);
                        res.status(500).json
                        res.send({
                            erreur: `Erreur serveur`,
                            message: "Erreur lors de la modification du statut du livre."
                        });
                    });
                }
                
            })
            .catch((erreur) => {
                console.log('Erreur : ', erreur);
                res.status(500).json
                res.send({
                    erreur: `Erreur serveur`,
                    message: "Erreur lors de la vérification du statut du livre."
                });
            });
        }
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500).json
        res.send({
            erreur: `Erreur serveur`,
            message: "Erreur lors de la vérification de l'ISBN."
        });
    });
}