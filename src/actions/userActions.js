export const setUser = (userObj) => {
  return {
      type: "SET_USER",
      payload: userObj
  }
}

export const logOut = () => {
  return {
      type: "LOG_OUT"
  }
}
