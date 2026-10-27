export default function AdSlot({ label = 'Advertisement' }: { label?: string }) {
  return (
    <div className="ad-slot" aria-label={label}>
      <small>{label}</small>
      <span>Ad space</span>
    </div>
  );
}
