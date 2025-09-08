import Header from '@/app/components/header'
import Login from '@/app/components/login/login'
import Option from '@/app/components/login/language'

export default function AuthPage() {
  return (
    <div 
     style={{
         backgroundImage: `url('/bg2.jpg')`, 
         backgroundSize: 'cover', 
         backgroundRepeat: 'no-repeat',
         backgroundPosition: 'center'
     }}
     className='flex flex-col justify-between min-h-screen'
    >
      <div className='w-full'>
        <Header />
      </div>
      <div className='flex flex-col gap-2 items-center justify-center'>
        <Login />
        <Option />
      </div>
      <p className='text-xs text-center my-5'>Copyright of PT Molca Teknologi Nusantara</p>
    </div>
  )
}
