import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChevronDown from '../Icons/ChevronDown'

const ControlledAccordion: React.FC<{
	isOpen: boolean
	children: ReactNode
}> = ({ isOpen, children }) => {
	return (
		<div className="overflow-hidden">
			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						key="content"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<motion.div
							initial={{ height: 0 }}
							animate={{ height: 'auto' }}
							exit={{ height: 0 }}
							transition={{ duration: 0.25 }}
							className="overflow-hidden"
						>
							<div className="p-5 text-black">{children}</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default ControlledAccordion
