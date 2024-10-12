import React, { createContext, useContext, useMemo, useState } from 'react'

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

const NotificationContext = createContext({
	addNotification: (conf: NotifConf) => {},
	removeNotification: (a0: number) => {},
})

export const useNotificationManager = () => {
	return useContext(NotificationContext)
}

// NotificationDisplay Component
const NotificationDisplay: React.FC<{
	notifications: { message: string; id: number }[]
	onRemove: (id: number) => void
}> = ({ notifications, onRemove }) => {
	return (
		<div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
			{notifications.map((notification) => (
				<div
					key={notification.id}
					style={{
						margin: '5px',
						padding: '10px',
						border: '1px solid #ccc',
						background: '#fff',
					}}
				>
					<span>{notification.message}</span>
					<button
						onClick={() => onRemove(notification.id)}
						style={{ marginLeft: '10px' }}
					>
						Close
					</button>
				</div>
			))}
		</div>
	)
}

export const NotificationManager: React.FC<{
	children?: React.ReactNode
}> = ({ children }) => {
	const [notifications, setNotifications] = useState<
		{ message: string; id: number }[]
	>([])

	const removeNotification = (id: number) => {
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id)
		)
	}

	const addNotification = (conf: NotifConf) => {
		const newNotification = {
			id: Date.now(),
			message: conf.message,
		}
		setNotifications((prev) => [...prev, newNotification])

		// Set a timeout to remove the notification after the specified duration
		const timer = setTimeout(
			() => {
				removeNotification(newNotification.id)
			},
			conf.timeout ? conf.timeout : 3000
		)

		// Clean up the timer on unmount
		return () => clearTimeout(timer)
	}

	return (
		<NotificationContext.Provider
			// eslint-disable-next-line react/jsx-no-constructed-context-values
			value={{ addNotification, removeNotification }}
		>
			{children}
			<NotificationDisplay
				notifications={notifications}
				onRemove={removeNotification}
			/>
		</NotificationContext.Provider>
	)
}
