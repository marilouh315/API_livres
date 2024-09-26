const sql = require("../config/db");

const Livres = (livres) => {}

/**
 * Vérifier l'existence d'un livre par ISBN
 * @param {*} ISBN ISBN du livre
 * @returns Retourne 1 si le livre existe, 0 sinon
 */
Livres.verifierExistenceISBN = (ISBN) => {
    return new Promise((resolve, reject) => {
        const requete = `select count(*) as count_isbn from Livre l where l.ISBN = ?`;
        const param_ISBN = [ISBN];
        sql.query(requete, param_ISBN, (err, resultats) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(resultats[0].count_isbn > 0);
            }
        });
    });
}

/**
 * Verifier si le livre est dans la bibliothèque personnelle
 * @param {*} ISBN ISBN du livre
 * @returns Retourne 1 si le livre est dans la bibli, 0 sinon
 */
Livres.verifierISBNBibli = (ISBN) => {
    return new Promise((resolve, reject) => {
        const requete = `select count(*) as count_isbn from bibliotheque b where b.id_livre = ?`;
        const param_ISBN = [ISBN];

        sql.query(requete, param_ISBN, (err, resultats) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(resultats[0].count_isbn > 0);
            }
        });
    })
}

/**
 * Vérifie si un livre possède des appréciations
 * @param {*} ISBN L'ISBN du livre
 * @returns 
 */
Livres.verifierAppreciation = (ISBN) => {
    return new Promise((resolve, reject) => {
        const requete = `select count(*) as count_appreciation from appreciation a where a.id_livre = ?`;
        const param_ISBN = [ISBN];

        sql.query(requete, param_ISBN, (err, resultats) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                console.log("Resultat count appreciation", resultats[0].count_appreciation);
                resolve(resultats[0].count_appreciation > 0);
            }
        });
    })
}

/**
 * Vérifie le statut d'un livre
 * @param {*} ISBN L'ISBN du livre
 * @returns 
 */
Livres.verifieStatutLivre = (ISBN) => {
    return new Promise((resolve, reject) => {
        const requete = `select statut_livre from Livre l where l.ISBN = ?`;
        const param_ISBN = [ISBN];

        sql.query(requete, param_ISBN, (err, resultats) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                console.log("Resultat statut livre", resultats[0].statut_livre);
                resolve(resultats[0].statut_livre);
            }
        });
    })
}




/**
 * Get TOUS les livres
 * 
 * @returns Renvoie une promesse avec les résultats de la requête SQL
 */
Livres.afficherTousLivres = async () => {
    return new Promise((resolve, reject) => {
        const requete = 
        `SELECT l.ISBN, l.titre, l.auteur, g.nom_genre, l.date_publication, l.nbre_pages, l.photo_URL, l.statut_livre, t.nom_genre, l.is_favoris from Genre g
            inner join Livre l on g.id_genre = l.genre_id
            inner join Type_livre t on l.type_livre_id = t.id_type_livre
            ORDER BY l.titre ASC`;
        sql.query(requete, (err, resultats) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(resultats);
            }
        });
    })
}

/**
 * Get les détails d'un livre
 * @param {*} ISBN ISBN du livre
 * @returns 
 */
Livres.afficherDetailsLivre = async (ISBN) => {
    return new Promise((resolve, reject) => {
        const requete = 
        `select l.ISBN, l.titre, l.auteur, g.nom_genre, l.date_publication, l.nbre_pages, l.photo_URL, l.statut_livre, t.nom_genre, l.is_favoris from Genre g
            inner join Livre l on g.id_genre = l.genre_id
            inner join Type_livre t on l.type_livre_id = t.id_type_livre 
            where l.ISBN = 9780143128540`;
        const param_ISBN = [ISBN];

        sql.query(requete, param_ISBN, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            else {
                resolve(resultat);
            }
        })
    })
}

/**
 * Get les livres de la bibliothèque personnelle
 * @param {*} async 
 * @returns 
 */
Livres.afficherBibli = async => {
    return new Promise((resolve, reject) => {
        const requete = 
        `select b.id_livre, l.titre, l.auteur, l.date_publication, l.statut_livre, l.is_favoris from livre l 
            inner join bibliotheque b ON l.ISBN = b.id_livre`;
        sql.query(requete, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            else {
                resolve(resultat);
            }
        })
    })
}

/**
 * Ajouter un livre à la bibliothèque personnelle
 * @param {*} ISBN ISBN du livre
 * @returns 
 */
Livres.ajouterLivreBibli = async (ISBN) => {
    return new Promise((resolve, reject) => {
        const requete = `insert into Bibliotheque(id_livre) values (?)`;
        const param_ISBN = [ISBN];
        sql.query(requete, param_ISBN, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            else {
                console.log("Resultat livre", resultat)
                resolve(resultat);
            }
        })
    })
}

/**
 * Retire un livre de la bibliothèque personnelle
 * @param {*} ISBN L'ISBN du livre
 * @returns 
 */
Livres.retirerLivreBibli = async (ISBN) => {
    return new Promise((resolve, reject) => {
        const requete = `delete from bibliotheque b where b.id_livre = ?`;
        const param_ISBN = [ISBN];
        sql.query(requete, param_ISBN, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            else {
                resolve(resultat);
            }
        })
    })
}

/**
 * Get tous les livres favoris
 * @param {*} async 
 * @returns 
 */
Livres.afficherFavoris = async ()=> {
    return new Promise((resolve, reject) => {
        const requete = `select l.ISBN, l.titre, l.auteur, l.date_publication, l.statut_livre, l.is_favoris from livre l where l.is_favoris = true`;
        sql.query(requete, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            else {
                resolve(resultat);
            }
        })
    })
}

/**
 * Affiche les appreciations pour un livre
 * @param {*} ISBN L'ISBN du livre
 * @returns 
 */
Livres.afficherAppreciation = async (ISBN) => {
    return new Promise((resolve, reject) => {
        const requete = `select l.ISBN, l.titre, l.auteur, a.titre_appreciation, a.commentaire, a.etoiles from livre l 
            inner join appreciation a on l.ISBN = a.id_livre
            where l.ISBN = ?`;
        const param_ISBN = [ISBN];

        sql.query(requete, param_ISBN, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            else {
                resolve(resultat);
            }
        })
    })
}

/**
 * Ajoute une appréciation pour un livre
 * @param {*} titre_appreciation Le titre de l'appréciation
 * @param {*} commentaire Commentaire de l'appréciation
 * @param {*} nbre_etoiles Le nombre d'étoiles données pour le livre
 * @param {*} isbn L'ISBN du livre
 * @returns 
 */
Livres.ajouterAppreciation = async (titre_appreciation, commentaire, nbre_etoiles, isbn) => {
    return new Promise((resolve, reject) => {
        const requete = `INSERT INTO Appreciation (titre_appreciation, commentaire, etoiles, id_livre) VALUES (?, ?, ?, ?)`;
        const params = [titre_appreciation, commentaire, nbre_etoiles, isbn];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            else {
                console.log("Resultat appreciation", resultat);
                resolve(resultat);
            }
        })
    }) 
}

/**
 * Modifie le statut d'un livre
 * @param {*} statut Le statut du livre: à lire ou déjà lu
 * @param {*} ISBN L'ISBN du livre
 * @returns 
 */
Livres.modifierStatutLivre = async (statut, ISBN) => {
    return new Promise((resolve, reject) => {
        const requete = `UPDATE Livre SET statut_livre = ? WHERE ISBN = ?`;
        const params = [statut, ISBN];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            else {
                resolve(resultat);
            }
        })
    })
}

module.exports = Livres;
