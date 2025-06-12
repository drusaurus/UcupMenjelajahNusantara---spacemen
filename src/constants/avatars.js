import characters from '../assets/characters.json'

export const AVATARS = characters.map((characters, index) => ({
    id: `avatar${index + 1}`,
    name: characters.name,
    avatar: characters.avatar,
    alt: characters.name,
    animation: characters.animation,
    dead: characters.dead,
}))