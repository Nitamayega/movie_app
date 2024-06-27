import React, {createContext, useEffect, useState} from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState({darkMode: false})

  //didMount
  useEffect(() => {
    try {
      const deserialisedTheme = JSON.parse(window.localStorage.getItem('theme'))
      setTheme({...deserialisedTheme})
    } catch (err) {}
  }, [])

  //didUpdate
  useEffect(() => {
    const serialisedTheme = JSON.stringify(theme)
    window.localStorage.setItem('theme', serialisedTheme)
  }, [theme])

  const changeTheme = () => {
    setTheme({darkMode: !theme['darkMode']})
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
