import UserVisit from './UserVisit'
import ProjectType from './ProjectType'
import ProjectTitleClick from './ProjectTitleClick'
import ProjectTypeClick from './ProjectTypeClick'

import { SignedIn } from '@clerk/nextjs'

export default function Analytics() {
  return (
    <div className='bg-[var(--color-text)] min-h-screen'>
      <SignedIn>
        <div className='flex flex-row'>
          <div className='border-2 border-[var(--color-grey-light)] rounded-lg w-1/2'><UserVisit /></div>
          <div className='border-2 border-[var(--color-grey-light)] rounded-lg w-1/2'><ProjectType /></div>
        </div>
        <div className='flex flex-row'>
          <div className='border-2 border-[var(--color-grey-light)] rounded-lg w-1/2'><ProjectTitleClick /></div>
          <div className='border-2 border-[var(--color-grey-light)] rounded-lg w-1/2'><ProjectTypeClick /></div>
        </div>
      </SignedIn>
    </div>
  )
}
