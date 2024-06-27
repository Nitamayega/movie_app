import React, {useContext} from 'react'
import {ThemeContext} from './themeContext'

const Button = () => {
  const {theme, changeTheme} = useContext(ThemeContext)
  return (
    <button
      className={theme['darkMode'] ? 'dark-button' : 'light-button'}
      onClick={changeTheme}
    >
      {theme['darkMode'] ? 'Light' : 'Dark'}
    </button>
  )
}

export default Button
