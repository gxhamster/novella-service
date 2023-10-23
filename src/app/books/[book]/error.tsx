"use client";
type ErrorProps = {
  error: Error;
};
export default function Error({ error }: ErrorProps) {
  return (
    <div className="flex flex-col gap-5 items-center justify-center w-full h-full">
      <span className="text-xl block">Error Has Occured</span>
      <pre>{error.message}</pre>
    </div>
  );
}
