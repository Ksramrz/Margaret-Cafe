import { GetServerSideProps } from 'next';
import { useState } from 'react';

interface TableData {
  table: string;
  count: number;
  data: any[];
  timestamp: string;
}

interface BrowserProps {
  initialData?: TableData;
}

export default function DatabaseBrowser({ initialData }: BrowserProps) {
  const [currentTable, setCurrentTable] = useState('users');
  const [data, setData] = useState<TableData | null>(initialData || null);
  const [loading, setLoading] = useState(false);

  const tables = [
    { name: 'users', label: '👥 Users', description: 'User accounts and profiles' },
    { name: 'products', label: '☕ Products', description: 'Cafe products and menu items' },
    { name: 'orders', label: '🛒 Orders', description: 'Customer orders and purchases' },
    { name: 'verification_codes', label: '📱 SMS Codes', description: 'SMS verification codes' },
  ];

  const loadTable = async (tableName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/debug/database-browser?table=${tableName}`);
      const result = await response.json();
      setData(result);
      setCurrentTable(tableName);
    } catch (error) {
      console.error('Error loading table:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? '✅' : '❌';
    if (value instanceof Date) return new Date(value).toLocaleString();
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🗄️ Database Browser</h1>
        
        {/* Table Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tables.map((table) => (
            <button
              key={table.name}
              onClick={() => loadTable(table.name)}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentTable === table.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-lg font-semibold">{table.label}</div>
              <div className="text-sm text-gray-600">{table.description}</div>
            </button>
          ))}
        </div>

        {/* Data Display */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-lg">Loading...</div>
          </div>
        )}

        {data && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {tables.find(t => t.name === data.table)?.label} ({data.count} records)
              </h2>
              <div className="text-sm text-gray-500">
                Last updated: {new Date(data.timestamp).toLocaleString()}
              </div>
            </div>

            {data.data.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No data found in this table
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(data.data[0]).map((key) => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.data.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {Object.values(row).map((value, valueIndex) => (
                          <td
                            key={valueIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {formatValue(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/debug/database-browser?table=users`);
    const data = await response.json();
    return {
      props: {
        initialData: data,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
