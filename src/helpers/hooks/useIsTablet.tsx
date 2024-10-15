import { dimensions } from '../css'
import useWindowWidth from './useWindowWidth'

const useIsTablet = () => {
	const width = useWindowWidth()

	return width < dimensions.laptop.small && width >= dimensions.tablet
}

export default useIsTablet
