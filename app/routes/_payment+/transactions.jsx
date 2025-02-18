// app/routes/_payment+/transactions.jsx
import { useLoaderData } from "@remix-run/react";
import {
  CurrencyBangladeshiIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export async function loader() {
  // Mock data - replace with real API calls
  return {
    stats: {
      balance: 125000,
      income: 250000,
      expenses: 125000,
      pending: 35000,
    },
    transactions: [
      {
        id: 1,
        date: "2024-05-20",
        description: "Payment received from Tech Solutions BD",
        amount: 150000,
        type: "deposit",
        status: "completed",
      },
      {
        id: 2,
        date: "2024-05-19",
        description: "Mobile app development project payment",
        amount: -75000,
        type: "withdrawal",
        status: "completed",
      },
      {
        id: 3,
        date: "2024-05-18",
        description: "Website redesign project deposit",
        amount: 50000,
        type: "deposit",
        status: "pending",
      },
    ],
  };
}

export default function Transactions() {
  const { stats, transactions } = useLoaderData();
  const statusStyles = {
    completed: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <CurrencyBangladeshiIcon className="h-8 w-8 text-emerald-600 mr-3" />
          Transaction History
        </h1>
        <button className="flex items-center text-emerald-600 hover:text-emerald-700">
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Export Statement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={CurrencyBangladeshiIcon}
          title="Current Balance"
          value={`৳${stats.balance.toLocaleString()}`}
        />
        <StatCard
          icon={ArrowDownIcon}
          title="Total Income"
          value={`৳${stats.income.toLocaleString()}`}
        />
        <StatCard
          icon={ArrowUpIcon}
          title="Total Expenses"
          value={`৳${stats.expenses.toLocaleString()}`}
        />
        <StatCard
          icon={ClockIcon}
          title="Pending Transactions"
          value={`৳${stats.pending.toLocaleString()}`}
        />
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-full">
              All
            </button>
            <button className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full hover:bg-emerald-200">
              Income
            </button>
            <button className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full hover:bg-emerald-200">
              Expense
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 border-b">
                <th className="pb-4">Date</th>
                <th className="pb-4">Description</th>
                <th className="pb-4 text-right">Amount</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="py-4">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-4">{transaction.description}</td>
                  <td
                    className={`py-4 text-right ${
                      transaction.amount > 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    ৳{Math.abs(transaction.amount).toLocaleString()}
                  </td>
                  <td className="py-4 capitalize">{transaction.type}</td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusStyles[transaction.status]
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing 1-{transactions.length} of {transactions.length}{" "}
            transactions
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded">
              1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center">
        <div className="bg-emerald-100 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="ml-4">
          <dt className="text-sm font-medium text-gray-500">{title}</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
        </div>
      </div>
    </div>
  );
}
