import FavoritesPage from '@/pages/favorites'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/favorites')({
  component: FavoritesPage,
})

