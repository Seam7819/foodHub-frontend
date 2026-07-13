const SkeletonCard = () => {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="h-48 w-full bg-gray-200" />
      <div className="flex grow flex-col p-4">
        <div className="h-4 w-3/4 bg-gray-200" />
        <div className="mt-2 h-3 w-1/2 bg-gray-200" />
        <div className="mt-auto h-8 w-24 rounded bg-gray-200" />
      </div>
    </div>
  );
};

export default SkeletonCard;
