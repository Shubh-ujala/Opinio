import { redirect } from '@tanstack/react-router'

export const authGuard = () => {
  const token = localStorage.getItem('token')
  if (!token) throw redirect({ to: '/login' })
}