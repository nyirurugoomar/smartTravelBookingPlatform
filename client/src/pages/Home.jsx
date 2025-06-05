import React from 'react'
import Hero from '../components/Hero'
import Hotels from '../components/Hotels'
import Event from '../components/Event'
import Trip from '../components/Trip'
import Flights from '../components/Flights'

function Home() {
  return (
    <div>
        <Hero/>
        <Hotels/>
        <Event/>
        <Flights/>
        <Trip/>
    </div>
  )
}

export default Home