/* eslint-disable */

import dimensions from './dimensions'

//https://jsramblings.com/how-to-use-media-queries-with-styled-components/
const mediaQueries = {
	mobile: {
		small: `(min-width: ${dimensions.mobile.small}px)`,
		medium: `(min-width: ${dimensions.mobile.medium}px)`,
		large: `(min-width: ${dimensions.mobile.large}px)`,
	},
	tablet: `(min-width: ${dimensions.tablet}px)`,
	laptop: {
		small: `(min-width: ${dimensions.laptop.small}px)`,
		medium: `(min-width: ${dimensions.laptop.medium}px)`,
		large: `(min-width: ${dimensions.laptop.large}px)`,
	},
}

export default mediaQueries
