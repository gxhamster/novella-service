import Skeleton from "react-loading-skeleton";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
  return (
    <>
      {[0, 1, 2, 3].map((_) => (
        <Skeleton key={_} count={1} height={280} />
      ))}
    </>
  );
}
