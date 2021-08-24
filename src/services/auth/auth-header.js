export default function authHeader () {
  const user = JSON.parse(localStorage.getItem('user'))

  if (user && user.token) {
    console.log('Authenticated call')
    return { Authorization: 'Bearer ' + user.token }
  } else {
    console.log('No auth')
    return {}
  }
}
