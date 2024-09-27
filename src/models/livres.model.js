const sql = require("../config/db_pg.js");

const Livres = (livres) => {}

/**
 * Vérifier l'existence d'un livre par ISBN
 * @param {*} ISBN ISBN du livre
 * @returns Retourne 1 si le livre existe, 0 sinon
 */
Livres.verifierExistenceISBN = (ISBN) => {
    return new Promise((resolve, reject) => {
        const requete = `select count(*) as count_isbn from Livre l where l.ISBN = $1`;
        const param_ISBN = [ISBN];
        sql.query(requete, param_ISBN, (err, resultats) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(resultats.rows[0].count_isbn > 0);
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
        const requete = `select count(*) as count_isbn from bibliotheque b where b.id_livre = $1`;
        const param_ISBN = [ISBN];

        sql.query(requete, param_ISBN, (err, resultats) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(resultats.rows[0].count_isbn > 0);
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
        const requete = `select count(*) as count_appreciation from appreciation a where a.id_livre = $1`;
        const param_ISBN = [ISBN];

        sql.query(requete, param_ISBN, (err, resultats) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                console.log("Resultat count appreciation", resultats.rows[0].count_appreciation);
                resolve(resultats.rows[0].count_appreciation > 0);
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
        const requete = `select l.statut_livre from Livre l where l.ISBN = $1`;
        const param_ISBN = [ISBN];

        sql.query(requete, param_ISBN, (err, resultats) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                console.log("Resultat statut livre", resultats.rows[0].statut_livre);
                resolve(resultats.rows[0].statut_livre);
            }
        });
    })
}

/**
 * Vérifie l'existence d'un genre dans la base de données
 * @param {*} genre_id Genre du livre (id)
 * @returns 
 */
Livres.verifierExistenceGenre = (genre_id) => {
    return new Promise((resolve, reject) => {
        const requete = `select count(*) as count_genre from Genre g where g.id_genre = $1`;
        const param_genre_id = [genre_id];

        sql.query(requete, param_genre_id, (err, resultats) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(resultats.rows[0].count_genre > 0);
            }
        });
    })
}

/**
 * Vérifie l'existence d'un type de livre dans la base de données
 * @param {*} type_livre_id ID du type de livre
 * @returns 
 */
Livres.verifierExsitenceTypelivre = (type_livre_id) => {
    return new Promise((resolve, reject) => {
        const requete = `select count(*) as count_typelivre from Type_livre t where t.id_type_livre = $1`;
        const param_type_livre_id = [type_livre_id];

        sql.query(requete, param_type_livre_id, (err, resultats) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(resultats.rows[0].count_typelivre > 0);
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
                resolve(resultats.rows);
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
            where l.ISBN = $1`;
        const param_ISBN = [ISBN];

        sql.query(requete, param_ISBN, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            else {
                resolve(resultat.rows);
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
                resolve(resultat.rows);
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
        const requete = `insert into Bibliotheque(id_livre) values ($1)`;
        const param_ISBN = [ISBN];
        sql.query(requete, param_ISBN, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            else {
                console.log("Resultat livre", resultat)
                resolve(resultat.rows);
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
        const requete = `delete from bibliotheque b where b.id_livre = $1`;
        const param_ISBN = [ISBN];
        sql.query(requete, param_ISBN, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            else {
                resolve(resultat.rows);
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
                resolve(resultat.rows);
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
            where l.ISBN = $1`;
        const param_ISBN = [ISBN];

        sql.query(requete, param_ISBN, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            else {
                resolve(resultat.rows);
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
        const requete = `INSERT INTO Appreciation (titre_appreciation, commentaire, etoiles, id_livre) VALUES ($1, $2, $3, $4)`;
        const params = [titre_appreciation, commentaire, nbre_etoiles, isbn];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            else {
                console.log("Resultat appreciation", resultat);
                resolve(resultat.rows);
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
Livres.modifierStatutLivre = async (statutsEncodes, ISBN) => {
    return new Promise((resolve, reject) => {
        const requete = `UPDATE Livre SET statut_livre = $1 WHERE ISBN = $2`;
        const params = [statutsEncodes, ISBN];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            else {
                console.log("Resultat statut livre", resultat.rows);
                resolve(resultat.rows);
            }
        })
    })
}

/**
 * Ajoute un livre
 * @param {*} titre Titre du livre
 * @param {*} auteur Auteur du livre
 * @param {*} genre_id id du genre du livre
 * @param {*} date_publication date de publication du livre
 * @param {*} nbre_pages Nombre de pages du livre
 * @param {*} photo_URL URL de la photo du livre
 * @param {*} type_livre_id Type du livre: roman, essai, etc.
 * @returns 
 */
Livres.ajouterLivre = async (titre, auteur, genre_id, date_publication, nbre_pages, photo_URL, type_livre_id) => {
    return new Promise((resolve, reject) => {
        const requete = `INSERT INTO Livre (titre, auteur, genre_id, date_publication, nbre_pages, photo_URL, statut_livre, type_livre_id, is_favoris) VALUES ($1, $2, $3, $4, $5, $6, 'à lire', $7, FALSE)`;
        const params = [titre, auteur, genre_id, date_publication, nbre_pages, photo_URL, type_livre_id];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            else {
                console.log("Resultat ajout livre", resultat.rows);
                resolve(resultat.rows);
            }
        })
    })
}

module.exports = Livres;
