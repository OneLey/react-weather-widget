import { useEffect, useState } from 'react'
import './index.css'

const KEY = 'git add'

function App() {
	const [city, setCity] = useState('')
	const [weatherData, setWeatherData] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const [coords, setCoords] = useState(null)

	useEffect(() => {
		if (!navigator.geolocation) {
			setError("Your browser don't support geolocation")
			return
		}
		navigator.geolocation.getCurrentPosition(
			p => {
				const { latitude, longitude } = p.coords
				console.log(p)
				setCoords({ latitude, longitude })
			},
			err => {
				console.log(err.message)
				setError('Failed to get your geolocation')
			}
		)
	}, [])

	useEffect(() => {
		if (!city.trim() && !coords) {
			setWeatherData(null)
			setError(null)
			return
		}
		async function getData() {
			setLoading(true)
			try {
				console.log(coords)
				const q = city.trim() ? city : `${coords.latitude},${coords.longitude}`

				const res = await fetch(
					`https://api.weatherapi.com/v1/current.json?key=${KEY}&q=${q}`
				)
				const data = await res.json()
				setError(data.error?.message)

				setWeatherData(data)
			} catch (err) {
				console.log(err)
			} finally {
				setLoading(false)
			}
		}
		getData()
	}, [city, coords])

	return (
		<div className='app'>
			<div className='widget-container'>
				<div className='weather-card-container'>
					<h1 className='app-title'>Weather Widget</h1>
					<div className='search-container'>
						<input
							type='text'
							placeholder='Enter city name'
							className='search-input'
							value={city}
							onChange={e => setCity(e.target.value)}
						/>
					</div>
				</div>
				{loading ? (
					<p>Loading...</p>
				) : error ? (
					<p>{error}</p>
				) : (
					weatherData && (
						<div className='weather-card'>
							<h2>
								{`${weatherData?.location?.country}, ${weatherData?.location?.name}`}
							</h2>
							<img
								src={weatherData?.current?.condition.icon}
								alt='icon'
								className='weather-icon'
							/>
							<p className='temperature'>
								{Math.floor(weatherData?.current?.temp_c)}°C
							</p>
							<p className='condition'>
								{weatherData?.current?.condition.text}
							</p>
							<div className='weather-details'>
								<p>Humidity: {weatherData?.current?.humidity}%</p>
								<p>Wind: {Math.floor(weatherData?.current?.wind_kph)} km/h</p>
							</div>
						</div>
					)
				)}
			</div>
		</div>
	)
}

export default App
