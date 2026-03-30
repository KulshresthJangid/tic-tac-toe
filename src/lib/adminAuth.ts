export const SESSION_KEY = '__adm_verified'

export function isAuthed(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

export function signOut(): void {
  sessionStorage.removeItem(SESSION_KEY)
}
