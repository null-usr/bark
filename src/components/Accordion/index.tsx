import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChevronDown from '../Icons/ChevronDown'

const Accordion: React.FC<{
	header: string
	children: ReactNode
}> = ({ header, children }) => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className="overflow-hidden rounded-xl border border-gray-200">
			<button
				className="flex w-full items-center justify-between p-5 text-left font-medium text-black transition hover:bg-gray-100"
				onClick={() => setIsOpen((prev) => !prev)}
				aria-expanded={isOpen}
			>
				<h2 className="text-xl font-semibold text-gray-800">
					{header}
				</h2>
				<ChevronDown
					className={`h-5 w-5 transform transition-transform duration-300 ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</button>

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

export default Accordion
