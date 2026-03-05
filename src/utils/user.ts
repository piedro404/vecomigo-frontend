export function getOrCreateUser() {
  const stored = localStorage.getItem('vecomigo:user')

  if (stored) {
    return JSON.parse(stored)
  }

  const newUser = {
    id: crypto.randomUUID(),
    name: generateGuestName()
  }

  localStorage.setItem('vecomigo:user', JSON.stringify(newUser))

  return newUser
}

export function updateStoredUser(user: any) {
  localStorage.setItem('vecomigo:user', JSON.stringify(user))
}

function generateGuestName() {
  return `User-${Math.floor(Math.random() * 1000)}`
}