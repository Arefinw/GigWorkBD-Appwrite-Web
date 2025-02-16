import { useLoaderData } from "@remix-run/react";
import {
  CurrencyBangladeshiIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export async function loader() {
  // Mock data - replace with real API calls
  return {
    stats: {
      totalSpent: 2250000,
      pendingPayments: 350000,
      upcomingPayments: 150000,
      avgPayment: 75000,
    },
    paymentHistory: [
      { month: "Jan", amount: 250000 },
      { month: "Feb", amount: 450000 },
      { month: "Mar", amount: 650000 },
      { month: "Apr", amount: 350000 },
      { month: "May", amount: 850000 },
    ],
    transactions: [
      {
        id: 1,
        date: "2024-05-15",
        recipient: "Tech Solutions BD",
        amount: 150000,
        status: "completed",
        method: "Bank Transfer",
      },
      {
        id: 2,
        date: "2024-05-10",
        recipient: "Design Innovators",
        amount: 75000,
        status: "pending",
        method: "bKash",
      },
    ],
    upcomingPayments: [
      {
        id: 1,
        date: "2024-06-01",
        recipient: "Web Dev Team",
        amount: 100000,
        project: "E-commerce Platform",
      },
    ],
    paymentMethods: [
      { type: "card", last4: "4242", provider: "Visa" },
      { type: "mobile", provider: "bKash", number: "017XX-XXXXXX" },
    ],
  };
}

export default function ClientPayments() {
  const {
    stats,
    paymentHistory,
    transactions,
    upcomingPayments,
    paymentMethods,
  } = useLoaderData();

  const statusStyles = {
    completed: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={CurrencyBangladeshiIcon}
          title="Total Spent"
          value={`৳${stats.totalSpent.toLocaleString()}`}
        />
        <StatCard
          icon={ClockIcon}
          title="Pending Payments"
          value={`৳${stats.pendingPayments.toLocaleString()}`}
        />
        <StatCard
          icon={CalendarIcon}
          title="Upcoming Payments"
          value={`৳${stats.upcomingPayments.toLocaleString()}`}
        />
        <StatCard
          icon={CheckCircleIcon}
          title="Avg. Payment"
          value={`৳${stats.avgPayment.toLocaleString()}`}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Payment History Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={paymentHistory}>
                  <XAxis
                    dataKey="month"
                    stroke="#059669"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#059669"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `৳${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ border: "none", borderRadius: "8px" }}
                    formatter={(value) => [
                      `৳${value.toLocaleString()}`,
                      "Amount",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={{ fill: "#059669", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              <button className="flex items-center text-emerald-600 hover:text-emerald-700">
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Export Statement
              </button>
            </div>

            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{transaction.recipient}</h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ৳{transaction.amount.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          statusStyles[transaction.status]
                        }`}
                      >
                        {transaction.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {transaction.method}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Upcoming Payments */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Payments</h2>
            <div className="space-y-4">
              {upcomingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{payment.recipient}</h3>
                      <p className="text-sm text-gray-600">{payment.project}</p>
                    </div>
                    <span className="text-emerald-600">
                      ৳{payment.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Due {new Date(payment.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    {method.type === "card" ? (
                      <CreditCardIcon className="h-6 w-6 text-emerald-600 mr-3" />
                    ) : (
                      <div className="h-6 w-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mr-3">
                        ৳
                      </div>
                    )}
                    <div>
                      <span className="font-medium">{method.provider}</span>
                      <span className="text-gray-600 ml-2">
                        {method.last4 || method.number}
                      </span>
                    </div>
                  </div>
                  <button className="text-emerald-600 hover:text-emerald-700 text-sm">
                    Edit
                  </button>
                </div>
              ))}
              <button className="w-full py-2 border-2 border-dashed border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                Add Payment Method
              </button>
            </div>
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
