import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const userTimer = (end: number) => {
	const start = useMemo(() => new Date().getTime() / 1000, []);
	const target = useMemo(() => end, [end]);

	const [timer, setTimer] = useState(target - start);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimer(target - new Date().getTime() / 1000);
		}, 100);

		return () => clearInterval(interval);
	}, []);

	return timer;
};

const size = 15;

export default function App() {
	const time = useMemo(() => {
		try {
			const url = new URL(location.href);
			const until = url.searchParams.get("until");
			return new Date(until as string)
		} catch {
			return undefined
		}
	}, []);

	if (!time) {
		return <p>
			No date or nonsense was provided. If this was Java we would be very upset. 😣
		</p>
	}

	return <Timer until={time} />;
}

function Timer({ until }: { until: Date }) {
	const timer = userTimer(until.getTime() / 1000);
	const str = getTimeString(timer);

	return (
		<div className="timer">
			<AnimatePresence>
				{str.split("").map((c, i) => {
					return (
						<motion.span
							key={`${c}-${i}`}
							exit={{ y: size, opacity: 0, position: "absolute" }}
							initial={{ y: -size * 2, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{
								ease: "easeOut",
								duration: 0.5,
							}}
							className="text-lg"
						>
							{c}
						</motion.span>
					);
				})}
			</AnimatePresence>
		</div>
	);
}

function getTimeString(t: number) {
	const seconds = Math.floor(t);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) {
		return `${pad(days)}:${pad(hours % 24)}:${pad(minutes % 60)}:${pad(seconds % 60)}`;
	}

	if (hours > 0) {
		return `${pad(hours)}:${pad(minutes % 60)}:${pad(seconds % 60)}`;
	}

	if (minutes > 0) {
		return `${pad(minutes)}:${pad(seconds % 60)}`;
	}

	if (seconds > 0) {
		return `${pad(seconds)}`;
	}

	return "00";
}

function pad(n: number) {
	return n < 10 ? `0${n}` : n;
}
