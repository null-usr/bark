import { useEffect, useState } from 'react'
import { mediaQueries } from '../css'

const useIsMobile = () => {
	const [width, setWidth] = useState(window.innerWidth)
	const handleWindowSizeChange = () => {
		setWidth(window.innerWidth)
	}

	useEffect(() => {
		window.addEventListener('resize', handleWindowSizeChange)
		return () => {
			window.removeEventListener('resize', handleWindowSizeChange)
		}
	}, [])

	return (
		width <
		parseInt(
			mediaQueries.laptop.small
				.replace('(min-width: ', '')
				.replace('px)', ''),
			10
		)
	)
}

export default useIsMobile
