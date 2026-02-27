'use client'

import { tuskerGrotesk } from '@/utils/fontUtils'
import { Heading, Stack, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'

const Email = () => (
    <Link
        href="mailto:swanngille@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="contact email"
    >
        swanngille@gmail.com
    </Link>
)

const Legal = () => (
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
            MENTIONS LÉGALES
        </Text>
        <Stack gap="2rem">
            <Stack>
                <Heading size="lg">1. Éditeur du site</Heading>
                <Text>Swann Gillé</Text>
                <Text>Nantes, France</Text>
                <Email />
            </Stack>
            <Stack>
                <Heading size="lg">2. Hébergeur du site</Heading>
                <Text>Vercel</Text>
                <Text>
                    Site web :{' '}
                    <Link
                        href="https://vercel.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Vercel website"
                    >
                        https://vercel.com
                    </Link>
                </Text>
            </Stack>
            <Stack>
                <Heading size="lg">3. Propriété intellectuelle</Heading>
                <Text>
                    L&apos;ensemble des contenus présents sur le site (textes, images, etc.) est la propriété exclusive
                    de M8DLE, sauf mentions contraires. Toute reproduction, distribution ou modification, partielle ou
                    totale, est strictement interdite sans autorisation écrite préalable.
                </Text>
                <Text>
                    <strong>Précision importante :</strong>
                </Text>
                <Text>
                    M8DLE est un projet de fans. Il n&apos;est pas affilié, sponsorisé ou validé par Gentle Mates ni par
                    aucune autre organisation mentionnée sur le site.
                </Text>
                <Text>
                    Les noms des organisations mentionnées sur le site restent la propriété exclusive de leurs
                    détenteurs respectifs.
                </Text>
            </Stack>
            <Stack>
                <Heading size="lg">4. Données personnelles</Heading>
                <Text>
                    Pour utiliser certaines fonctionnalités du site (création de compte, suivi des scores), M8DLE
                    collecte les emails et/ou les identifiants Discord.
                </Text>
                <Text>
                    Les données sont utilisées uniquement pour la gestion des comptes et des fonctionnalités du jeu.
                </Text>
                <Text>
                    Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de modification, de rectification
                    et de suppression des données vous concernant. Pour exercer ce droit, veuillez contacter : <Email />
                </Text>
                <Text>
                    Le site utilise également des cookies pour gérer les sessions utilisateurs et améliorer
                    l&apos;expérience sur le site. Ces cookies ne sont utilisés qu&apos;à des fins de sécurité et de
                    navigation.
                </Text>
            </Stack>
            <Stack>
                <Heading size="lg">5. Responsabilité</Heading>
                <Text>
                    M8DLE ne peut être tenu responsable des dommages directs ou indirects pouvant résulter de
                    l&apos;accès ou de l&apos;utilisation du site, ni de l&apos;interprétation des informations qui y
                    sont présentées.
                </Text>
            </Stack>
            <Stack>
                <Heading size="lg">6. Liens externes</Heading>
                <Text>
                    Le site peut contenir des liens vers d&apos;autres sites. M8DLE n&apos;exerce aucun contrôle sur
                    leur contenu et décline toute responsabilité quant à ces sites tiers.
                </Text>
            </Stack>
            <Stack>
                <Heading size="lg">7. Loi applicable</Heading>
                <Text>
                    Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls
                    compétents.
                </Text>
            </Stack>
        </Stack>
    </VStack>
)

export default Legal
