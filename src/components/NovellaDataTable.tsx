"use client";
// type TableField = {
//   [key: string]: string;
// };

export default function NovellaDataTable<
  T extends Record<string, any>[] | undefined
>({ data, headers }: { data: T; headers: string[] }) {
  return (
    <div>
      <table className="w-full">
        <thead className="text-surface-900 bg-surface-300">
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-start p-2 px-5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((v: any) => (
            <tr
              key={v.id}
              className="text-surface-800 font-light bg-surface-200 text-sm border-b-[0.7px] border-surface-400"
            >
              {Object.keys(v).map((field) => (
                <td key={field} className="p-2 px-4">
                  {v[field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data && data.length <= 0 ? (
        <div className="text-center p-5 font-light text-surface-600">
          No books issued at the moment
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
