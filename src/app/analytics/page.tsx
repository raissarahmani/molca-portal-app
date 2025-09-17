import Header from '@/app/components/ui/dashboard/header'
import UserVisit from '../components/ui/analytics/UserVisit'
import ProjectType from '../components/ui/analytics/ProjectType'
import ProjectTitleClick from '../components/ui/analytics/ProjectTitleClick'
import ProjectTypeClick from '../components/ui/analytics/ProjectTypeClick'

export default function Analytics() {
  return (
    <div className='bg-[var(--color-text)] min-h-screen'>
      <div><Header /></div>
      <div className='border-2 border-[var(--color-grey-light)] rounded-lg'><UserVisit /></div>
      <div className='flex flex-row justify-between'>
        <div className='border-2 border-[var(--color-grey-light)] rounded-lg'><ProjectType /></div>
        <div className='border-2 border-[var(--color-grey-light)] rounded-lg'><ProjectTypeClick /></div>
        <div className='border-2 border-[var(--color-grey-light)] rounded-lg'><ProjectTitleClick /></div>       
      </div>
    </div>
  )
}
