const TOKEN_KEY = 'ecom_demo_token'
const USER_KEY = 'ecom_demo_user'

export const auth = {
  save(token, user){ localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(USER_KEY, JSON.stringify(user)) },
  getToken(){ return localStorage.getItem(TOKEN_KEY) },
  getUser(){ return JSON.parse(localStorage.getItem(USER_KEY) || 'null') },
  logout(){ localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY) }
}
