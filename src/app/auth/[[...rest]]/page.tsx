import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export default function AuthPage() {
  return (
    <div 
     style={{
         backgroundImage: `url('/bg2.jpg')`, 
         backgroundSize: 'cover', 
         backgroundRepeat: 'no-repeat',
         backgroundPosition: 'center'
     }}
     className='min-h-screen relative'
    >
      <div className='absolute inset-0 flex flex-col justify-center items-center'>
        <SignIn
          afterSignInUrl="/home"
          appearance={{
            baseTheme: dark,
          }}
        />
      </div>
    </div>
  )
}





