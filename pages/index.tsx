import type { NextPage } from 'next'
import Product from '../components/Product'

const Home: NextPage = () => {
  return (
    <div className='w-full grid grid-cols-productGrid gap-4 '>
      {[1, 1, 1, 1].map(() => <Product></Product>)}
    </div>

  )
}

export default Home
