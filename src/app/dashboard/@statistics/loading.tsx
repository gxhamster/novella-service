import { Skeleton } from "@mantine/core";

export default function Loading() {
  return (
    <>
      {[0, 1, 2, 3].map((_) => (
        <Skeleton key={_} height={280} />
      ))}
    </>
  );
}
