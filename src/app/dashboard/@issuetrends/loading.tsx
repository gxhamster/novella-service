import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
  return <Skeleton count={1} height={280} className="col-span-2" />;
}
