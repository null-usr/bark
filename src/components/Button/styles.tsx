import styled from 'styled-components'
import colors from '@/helpers/theme/colors'
import { Paragraph } from '../Typography/text'

export interface BaseProps {
	block?: boolean
	danger?: boolean
	disabled?: boolean
}

export const Base = styled.button<BaseProps>`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
	border: none;
	margin: 0;
	padding: 4px 8px;
	${({ block }) => (block ? 'flex: 1; width: 100%;' : '')}
	/* min-width: 88px; */
	min-height: 32px;
	text-decoration: none;
	cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
	text-align: center;
	-webkit-appearance: none;
	-moz-appearance: none;
	background: ${({ disabled, danger }) => {
		if (disabled && danger) return `${colors.red[20]}`
		if (disabled) return `${colors.blue[30]}`
		if (danger) return `${colors.red[40]}`
		return `${colors.blue[60]}`
	}};
	border-radius: 4px;

	${Paragraph} {
		color: ${colors.gray[10]};
	}
`

export const Primary = styled(Base)`
	&:hover {
		background: ${({ disabled, danger }) => {
			if (disabled && danger) return `${colors.red[20]}`
			if (disabled) return `${colors.blue[30]}`
			if (danger) return `${colors.red[50]}`
			return `${colors.blue[70]}`
		}};
	}

	&:focus {
		${({ disabled, danger }) => {
			if (disabled) return ''
			if (danger)
				return 'box-shadow: 0px 2px 6px rgba(255, 120, 117, 0.25);'
			return 'box-shadow: 0px 2px 6px rgba(23, 151, 214, 0.25);'
		}};
	}

	&:active {
		background: ${({ disabled, danger }) => {
			if (disabled && danger) return `${colors.red[20]}`
			if (disabled) return `${colors.blue[30]}`
			if (danger) return `${colors.red[60]}`
			return `${colors.blue[80]}`
		}};
	}
`

export const Secondary = styled(Base)`
	border: 1px solid
		${({ disabled, danger }) => {
			if (disabled && danger) return `${colors.red[20]}`
			if (disabled) return `${colors.blue[30]}`
			if (danger) return `${colors.red[40]}`
			return `${colors.blue[60]}`
		}};
	background: none;

	${Paragraph} {
		color: ${({ disabled, danger }) => {
			if (disabled && danger) return `${colors.red[20]}`
			if (disabled) return `${colors.blue[30]}`
			if (danger) return `${colors.red[40]}`
			return `${colors.blue[60]}`
		}};
	}

	& svg {
		color: ${({ disabled, danger }) => {
			if (disabled && danger) return `${colors.red[20]}`
			if (disabled) return `${colors.blue[30]}`
			if (danger) return `${colors.red[40]}`
			return `${colors.blue[60]}`
		}};
	}

	&:hover {
		${({ disabled, danger }) => {
			if (disabled) return ''
			if (danger)
				return `
        border: 1px solid ${colors.red[50]};
        ${Paragraph} {
          color: ${colors.red[50]};
        } 
        & svg{
          color: ${colors.red[50]};
        }`
			return `
        border: 1px solid ${colors.blue[80]};
        ${Paragraph} {
          color: ${colors.blue[80]};
        } 
        & svg{
          color: ${colors.blue[80]};
        }`
		}}
	}

	&:focus {
		${({ disabled, danger }) => {
			if (disabled) return ''
			if (danger)
				return `
        border: 1px solid ${colors.red[40]};
        filter: drop-shadow(0px 2px 6px rgba(255, 120, 117, 0.25));
        ${Paragraph}{
          color: ${colors.red[40]};
        } 
        & svg{
          color: ${colors.red[40]};
        }      
      `
			return `
        border: 1px solid ${colors.blue[60]};
        /* Button/focus blue */
        filter: drop-shadow(0px 2px 6px rgba(23, 151, 214, 0.25));
        ${Paragraph}{
          color: ${colors.blue[60]};
        } 
        & svg{
          color: ${colors.blue[60]};
        }
      `
		}}
	}

	&:active {
		${({ disabled, danger }) => {
			if (disabled) return ''
			if (danger)
				return `
        border: 1px solid ${colors.red[60]};
        ${Paragraph}{
          color: ${colors.red[60]};
        }       
        & svg {
          color: ${colors.red[60]};
        }`
			return `
        border: 1px solid ${colors.blue[80]};
        ${Paragraph}{
          color: ${colors.blue[80]};
        } 
        & svg {
          color: ${colors.blue[80]};
        }`
		}}
	}
`

export const Subtle = styled(Base)`
	background: white;
	border: 1px solid
		${({ disabled, danger }) => {
			if (disabled && danger) return `${colors.red[20]}`
			if (disabled) return `${colors.gray[50]}`
			if (danger) return 'none'
			return `${colors.gray[40]}`
		}};

	${Paragraph} {
		color: ${({ disabled, danger }) => {
			if (disabled && danger) return `${colors.red[20]}`
			if (disabled) return `${colors.gray[50]}`
			if (danger) return `${colors.red[40]}`
			return `${colors.gray[80]}`
		}};
	}

	& svg {
		color: ${({ disabled, danger }) => {
			if (disabled && danger) return `${colors.red[20]}`
			if (disabled) return `${colors.gray[50]}`
			if (danger) return `${colors.red[40]}`
			return `${colors.gray[80]}`
		}};
	}

	&:hover {
		${({ disabled, danger }) => {
			if (disabled) return ''
			if (danger)
				return `${Paragraph}{
          color: ${colors.red[50]};
        }
        & svg {
          color: ${colors.red[50]};
        }`
			return `border: 1px solid ${colors.gray[70]};`
		}}
	}

	&:focus {
		${({ disabled, danger }) => {
			if (disabled) return ''
			if (danger) return ''
			return `/* Button/focus gray */
        filter: drop-shadow(0px 2px 6px rgba(152, 152, 152, 0.25));`
		}}
	}

	&:active {
		${({ disabled, danger }) => {
			if (disabled) return ''
			if (danger)
				return `${Paragraph}{
          color: ${colors.red[60]};
        }
        & svg {
          color: ${colors.red[60]};
        }`
			return `
        ${Paragraph}{
          color: ${colors.blue[80]};
        } 
        & svg {
          color: ${colors.blue[80]};
        }
        border: 1px solid ${colors.blue[80]};`
		}}
	}
`

export const Text = styled(Base)`
	padding: 0px;
	min-width: auto;
	min-height: auto;
	background: none;
	border: none;

	${Paragraph} {
		text-decoration: ${({ danger }) => (danger ? 'none' : 'underline')};
		color: ${({ disabled, danger }) => {
			if (disabled && danger) return `${colors.red[20]}`
			if (disabled) return `${colors.gray[50]}`
			if (danger) return `${colors.red[40]}`
			return `${colors.gray[80]}`
		}};
	}

	& svg {
		color: ${({ disabled, danger }) => {
			if (disabled && danger) return `${colors.red[20]}`
			if (disabled) return `${colors.gray[50]}`
			if (danger) return `${colors.red[40]}`
			return `${colors.gray[80]}`
		}};
	}

	&:hover {
		${({ disabled, danger }) => {
			if (disabled) return ''
			if (danger)
				return `${Paragraph}{
          color: ${colors.red[50]};
        }
        & svg {
          color: ${colors.red[50]};
        }
      `
			return ''
		}}
	}

	&:active {
		${({ disabled, danger }) => {
			if (disabled) return ''
			if (danger)
				return `${Paragraph}{
          color: ${colors.red[60]};
        }
        & svg {
          color: ${colors.red[60]};
        }`
			return `
        ${Paragraph}{
          color: ${colors.blue[80]};
        } 
        & svg {
          color: ${colors.blue[80]};
        }`
		}}
	}
`
