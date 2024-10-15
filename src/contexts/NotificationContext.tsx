import ErrorIcon from '@/components/Icons/alerts/Error'
import SuccessIcon from '@/components/Icons/alerts/Success'
import WarningIcon from '@/components/Icons/alerts/Warning'
import Modal from '@/components/modal/Modal'
import Notification from '@/components/Notification'
import { FlexColumn } from '@/components/styles'
import colors from '@/helpers/theme/colors'
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'

export type NotificationPlacement =
	| 'top'
	| 'topright'
	| 'topleft'
	| 'bottom'
	| 'bottomleft'
	| 'bottomright'

export type NotificationType = 'error' | 'warning' | 'info' | 'success'

export type TNotification = {
	id: number
	message: string
	placement?: NotificationPlacement
	type?: NotificationType
	title?: string
}

export type NotifConf = {
	message: string
	placement?: NotificationPlacement
	type?: NotificationType
	title?: string
	timeout?: number
}

export interface INotificationContext {
	addNotification: (conf: NotifConf) => number
	removeNotification: (id: number) => void
}

const getPosition = (location: string) => {
	let top
	let bottom
	let left
	let right

	switch (location) {
		case 'top':
			top = '24px'
			break
		case 'topleft':
			top = '24px'
			left = '24px'
			break
		case 'topright':
			top = '24px'
			right = '24px'
			break
		case 'bottom':
			bottom = '24px'
			break
		case 'bottomleft':
			bottom = '24px'
			left = '24px'
			break
		case 'bottomright':
			bottom = '24px'
			right = '24px'
			break
		default:
			top = '24px'
			right = '24px'
			break
	}

	return { top, bottom, left, right }
}

const getIcon = (type?: string) => {
	switch (type) {
		case 'info':
			return <WarningIcon color={colors.blue[60]} />
		case 'success':
			return <SuccessIcon color={colors.green[60]} />
		case 'warning':
			return <WarningIcon color={colors.gold[60]} />
		case 'error':
			return <ErrorIcon color={colors.red[40]} />
		default:
			return undefined
	}
}

const NotificationContext = createContext({
	addNotification: (conf: NotifConf) => {},
	removeNotification: (a0: number) => {},
})

export const useNotificationManager = () => {
	return useContext(NotificationContext)
}

export const NotificationManager: React.FC<{
	children?: React.ReactNode
}> = ({ children }) => {
	const [notifications, setNotifications] = useState<TNotification[]>([])

	const [positionalNotifications, setPositionalNotifications] = useState<{
		[key: string]: TNotification[]
	}>({
		top: [],
		topleft: [],
		topright: [],
		bottom: [],
		bottomleft: [],
		bottomright: [],
	})

	const removeNotification = (id: number) => {
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id)
		)
	}

	const addNotification = (conf: NotifConf) => {
		const newNotification = {
			id: Date.now(),
			...conf,
		}
		setNotifications((prev) => [...prev, newNotification])

		// Set a timeout to remove the notification after the specified duration
		const timer = setTimeout(
			() => {
				removeNotification(newNotification.id)
			},
			conf.timeout ? conf.timeout : 5000
		)

		// Clean up the timer on unmount
		return () => clearTimeout(timer)
	}

	useEffect(() => {
		const tmp: { [key: string]: TNotification[] } = {
			top: [],
			topleft: [],
			topright: [],
			bottom: [],
			bottomleft: [],
			bottomright: [],
		}

		notifications.forEach((n) => {
			// eslint-disable-next-line dot-notation
			if (!n.placement) tmp['topright'].push(n)
			else {
				tmp[n.placement].push(n)
			}
		})

		setPositionalNotifications(tmp)

		// const timer = setTimeout(() => {
		// 	if (notifications.length > 0) {
		// 		removeNotification(notifications[0].id)
		// 	}
		// }, 10000)

		// return () => {
		// 	clearTimeout(timer)
		// }
	}, [notifications])

	return (
		<NotificationContext.Provider
			// eslint-disable-next-line react/jsx-no-constructed-context-values
			value={{ addNotification, removeNotification }}
		>
			{children}
			{Object.keys(positionalNotifications).map((k) => {
				const { top, bottom, left, right } = getPosition(k)

				return (
					<Modal
						key={k}
						top={top}
						bottom={bottom}
						left={left}
						right={right}
						isOpen={positionalNotifications[k].length > 0}
						hideCloseButton
					>
						<FlexColumn>
							{positionalNotifications[k].map((notification) => {
								return (
									<Notification
										title={notification.title}
										Icon={getIcon(notification.type)}
										key={notification.id}
										notification={notification.message}
										onClose={() =>
											removeNotification(notification.id)
										}
									/>
								)
							})}
						</FlexColumn>
					</Modal>
				)
			})}
		</NotificationContext.Provider>
	)
}
