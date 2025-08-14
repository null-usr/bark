import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import About from './AboutPage'
import reportWebVitals from './reportWebVitals'

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
	<React.StrictMode>
		<About />
	</React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
