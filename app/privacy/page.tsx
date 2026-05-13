'use client'

import { tuskerGrotesk } from '@/utils/fontUtils'
import { Heading, List, Stack, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'

const Privacy = () => (
    <VStack
        w={{ base: '90vw', md: '50vw' }}
        mx="auto"
        gap="1rem"
    >
        <Text
            as="h1"
            fontSize={{ base: '2.5rem', md: '4rem' }}
            className={tuskerGrotesk.className}
            textAlign="center"
        >
            POLITIQUE DE CONFIDENTIALITÉ
        </Text>
        <Stack gap="2rem">
            <Stack>
                <Heading size="lg">1. Données collectées</Heading>
                <Text>M8DLE collecte les informations suivantes lors de l&apos;utilisation du site :</Text>
                <List.Root>
                    <List.Item>
                        <strong>Identité et contact :</strong> email et identifiant Discord pour la création et gestion
                        des comptes.
                    </List.Item>
                    <List.Item>
                        <strong>Données de jeu :</strong> réussite des joueurs et tous leurs essais journaliers.
                    </List.Item>
                    <List.Item>
                        <strong>Analytique :</strong> données anonymes pour mesurer l&apos;usage du site via Vercel
                        (statistiques de trafic, erreurs).
                    </List.Item>
                </List.Root>
            </Stack>
            <Stack>
                <Heading size="lg">2. Finalité des données</Heading>
                <Text>Les données collectées sont utilisées exclusivement pour :</Text>
                <List.Root>
                    <List.Item>Gérer les comptes utilisateurs.</List.Item>
                    <List.Item>Calculer et afficher les classements des joueurs.</List.Item>
                    <List.Item>Assurer le fonctionnement et la sécurité du site.</List.Item>
                </List.Root>
                <Text>M8DLE ne vend ni ne loue vos données à des tiers.</Text>
            </Stack>
            <Stack>
                <Heading size="lg">3. Partage et stockage des données</Heading>
                <List.Root>
                    <List.Item>
                        Les données sont stockées sur les serveurs de la base de données Neon et sur l’hébergement
                        Vercel pour les sessions et fonctionnalités du site.
                    </List.Item>
                    <List.Item>Elles ne sont partagées avec aucun autre organisme ou société.</List.Item>
                </List.Root>
            </Stack>
            <Stack>
                <Heading size="lg">4. Cookies et sessions</Heading>
                <List.Root>
                    <List.Item>
                        M8DLE utilise des cookies pour gérer les sessions utilisateurs et améliorer la navigation.
                    </List.Item>
                    <List.Item>
                        Ces cookies sont valables 7 jours et peuvent être supprimés via les paramètres de votre
                        navigateur.
                    </List.Item>
                    <List.Item>
                        Les cookies ne sont utilisés qu&apos;à des fins de sécurité et de fonctionnement du site.
                    </List.Item>
                </List.Root>
            </Stack>
            <Stack>
                <Heading size="lg">5. Droits des utilisateurs (RGPD)</Heading>
                <Text>Conformément au RGPD, vous disposez des droits suivants :</Text>
                <List.Root>
                    <List.Item>
                        <strong>Accès :</strong> connaître les données que nous détenons sur vous.
                    </List.Item>
                    <List.Item>
                        <strong>Modification / rectification :</strong> corriger vos données si elles sont incorrectes.
                    </List.Item>
                    <List.Item>
                        <strong>Suppression :</strong> demander la suppression de vos données personnelles.
                    </List.Item>
                    <List.Item>
                        <strong>Portabilité :</strong> récupérer vos données dans un format structuré.
                    </List.Item>
                </List.Root>
                <Text>
                    Pour exercer vos droits, contactez-nous à :
                    <Link
                        href="mailto:swanngille@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="contact email"
                    >
                        swanngille@gmail.com
                    </Link>
                </Text>
            </Stack>
            <Stack>
                <Heading size="lg">6. Sécurité des données</Heading>
                <List.Root>
                    <List.Item>
                        Les données des utilisateurs sont stockées de manière sécurisée et les sessions sont protégées
                        par un chiffrement JWT.
                    </List.Item>
                    <List.Item>
                        Nous mettons en œuvre des mesures pour prévenir tout accès non autorisé ou perte de données.
                    </List.Item>
                </List.Root>
            </Stack>
            <Stack>
                <Heading size="lg">7. Mineurs</Heading>
                <List.Root>
                    <List.Item>M8DLE est accessible à tous, y compris aux mineurs.</List.Item>
                    <List.Item>
                        Nous recommandons aux parents ou tuteurs de superviser l’utilisation du site par les plus
                        jeunes.
                    </List.Item>
                </List.Root>
            </Stack>
            <Stack>
                <Heading size="lg">8. Modifications de la politique</Heading>
                <List.Root>
                    <List.Item>Cette politique peut être mise à jour à tout moment.</List.Item>
                    <List.Item>La dernière version sera toujours disponible sur le site.</List.Item>
                    <List.Item>Dernière mise à jour : 22 février 2026</List.Item>
                </List.Root>
            </Stack>
        </Stack>
    </VStack>
)

export default Privacy
