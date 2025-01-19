import dynamic from 'next/dynamic'

const AddPropertyComponent = dynamic(() => import('../../pages/components/property/AddProperty'), {
  ssr: false
})

export default function AddProperty() {
  return <AddPropertyComponent />
}