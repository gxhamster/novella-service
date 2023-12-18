import { Skeleton } from "@mantine/core";

export default function Loading() {
  return (
    <>
      {[0, 1].map((_) => (
        <Skeleton key={_} height={280} className="col-span-2" />
      ))}
    </>
  );
}
