import React, {useContext} from 'react'
import {ThemeContext} from './themeContext'
import Button from './content'

import './app.css'

const App = () => {
  const {theme} = useContext(ThemeContext)

  return (
    <div className={theme['darkMode'] ? 'app dark' : 'app light'}>
      <Button />
    </div>
  )
}

export default App
