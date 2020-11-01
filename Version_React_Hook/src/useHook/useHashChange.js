import {
	useState,
	useEffect
} from 'react'


export default function useHashChange() {

	const [hash, setHash] = useState(() => window.location.hash.slice(2))


	const handleHashChange = (e) => {
		// 为什么这里不能使用 location 会报错呢
		// console.log(location)
		setHash(window.location.hash.slice(2))
	}

	useEffect(() => {
		window.addEventListener('hashchange', handleHashChange, false)

		return () => {
			window.removeEventListener('hashcahnge', handleHashChange, false)
		}
	}, [])

	return hash
}