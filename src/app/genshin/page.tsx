'use client';

import { useEffect, useState } from "react";
import { Skeleton } from "@heroui/skeleton";
import Papa from "papaparse";

interface Sheet {
  name: string;
  data: string[][];
}

export default function Home() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const res = await fetch("/api/sheets");
        const data = await res.json();

        // Parse CSV data using PapaParse
        const parsedData = data.map((sheet: { name: string; data: string }) => ({
          name: sheet.name,
          data: Papa.parse(sheet.data, { skipEmptyLines: true }).data,
        }));

        setSheets(parsedData);
      } catch (err) {
        setError("Failed to load data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSheets();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Natlan World Quests</h1>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="border border-gray-300 rounded-md p-4">
              <Skeleton className="m-1 h-6 w-4/5 mb-6 rounded-lg"/>

              <Skeleton className="m-1 h-5 w-3/5 mb-3 rounded-lg" />

              <Skeleton className="m-3 h-4 w-2/5 mb-2 rounded-lg" />
              <Skeleton className="m-3 h-4 w-3/5 mb-2 rounded-lg" />
              <Skeleton className="m-3 h-4 w-4/5 mb-2 rounded-lg" />
              <Skeleton className="m-3 h-4 w-full mb-2 rounded-lg" />
              <Skeleton className="m-3 h-4 w-4/5 mb-2 rounded-lg" />
              <Skeleton className="m-3 h-4 w-3/5 mb-2 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sheets.map((sheet, idx) => (
            <div
              key={idx}
              className="mb-8 border border-gray-300 rounded-md overflow-hidden"
            >
              <h2 className="text-xl font-semibold p-4 bg-gray-100 dark:bg-black dark:text-white">
                {sheet.name}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-blue-900 dark:border-gray-600">
                  <thead>
                    <tr>
                      {sheet.data[0].map((header, idx) => (
                        <th
                          key={idx}
                          className="border border-gray-100 dark:border-gray-600 px-4 py-2 text-left bg-gray-200 dark:bg-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sheet.data.slice(1).map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="border border-gray-300 dark:border-gray-600 px-4 py-2"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
