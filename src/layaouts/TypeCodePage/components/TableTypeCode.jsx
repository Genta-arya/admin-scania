import React from 'react';

const TableTypeCode = () => {
  // Data tabel (type, code, dan link PDF)
  const data = [
    { type: 'Type A', code: 'A001', link: '/pdf/type-a.pdf' },
    { type: 'Type B', code: 'B002', link: '/pdf/type-b.pdf' },
    { type: 'Type C', code: 'C003', link: '/pdf/type-c.pdf' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Type Code Table</h2>
      <table className="w-[90%] bg-white border border-gray-300 overflow-x-auto">
        <thead>
          <tr className=''>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Code</th>
            <th className="py-2 px-4 border-b">Link PDF</th>
            <th className="py-2 px-4 border-b">Link PDF</th>
            <th className="py-2 px-4 border-b">Link PDF</th>
            <th className="py-2 px-4 border-b">Link PDF</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{item.type}</td>
              <td className="py-2 px-4 border-b">{item.code}</td>
              <td className="py-2 px-4 border-b">
                <a href={item.link} className="text-blue-500 hover:underline">
                  View PDF
                </a>
              </td>
              <td className="py-2 px-4 border-b">
                <a href={item.link} className="text-blue-500 hover:underline">
                  View PDF
                </a>
              </td>
              <td className="py-2 px-4 border-b">
                <a href={item.link} className="text-blue-500 hover:underline">
                  View PDF
                </a>
              </td>
              <td className="py-2 px-4 border-b">
                <a href={item.link} className="text-blue-500 hover:underline">
                  View PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableTypeCode;
