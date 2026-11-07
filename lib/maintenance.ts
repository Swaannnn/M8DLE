/**
 * Mode maintenance, piloté par la variable d'environnement MAINTENANCE_MODE.
 * Sur Vercel, un changement de valeur n'est pris en compte qu'après un redéploiement.
 */
export function isInMaintenanceMode() {
    return process.env.MAINTENANCE_MODE === 'true'
}
