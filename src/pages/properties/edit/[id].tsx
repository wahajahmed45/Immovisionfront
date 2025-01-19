import dynamic from 'next/dynamic';

const EditPropertyComponent = dynamic(
  () => import('../../../pages/components/property/EditProperty'),
  { ssr: false }
);

export default function EditProperty() {
  return <EditPropertyComponent />;
}