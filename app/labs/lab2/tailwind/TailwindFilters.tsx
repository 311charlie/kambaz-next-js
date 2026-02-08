export default function TailwindFilters() {
  return (
    <div>
      <h3 className="text-3xl font-bold mb-4">Blurs</h3>
      <div className="flex">
        <img className="blur-none w-1/4" src="/images/angel-falls.jpg" alt="Angel Falls" />
        <img className="blur-sm w-1/4" src="/images/angel-falls.jpg" alt="Angel Falls" />
        <img className="blur-lg w-1/4" src="/images/angel-falls.jpg" alt="Angel Falls" />
        <img className="blur-2xl w-1/4" src="/images/angel-falls.jpg" alt="Angel Falls" />
      </div>
    </div>
  );
}
