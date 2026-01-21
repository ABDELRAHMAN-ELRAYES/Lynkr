

export default function Finance() {
  const payouts = [
    { id: "INV-1024", amount: "$1,250", date: "Mar 02", status: "Paid" },
    { id: "INV-1025", amount: "$980", date: "Mar 14", status: "Processing" },
  ];
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h1 className="text-xl text-gray-900 mb-4">Manage financial</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Earnings (30d)</p>
            <p className="text-2xl text-gray-900 font-semibold">$12,450</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Pending Invoices</p>
            <p className="text-2xl text-gray-900 font-semibold">3</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Payout Method</p>
            <p className="text-gray-900">Bank transfer •••• 4821</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-gray-900">Recent Payouts</h2>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Download CSV
          </button>
        </div>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Invoice</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td className="p-3 text-gray-900">{p.id}</td>
                  <td className="p-3 text-gray-900">{p.amount}</td>
                  <td className="p-3 text-gray-700">{p.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${p.status === "Paid"
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                        }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
