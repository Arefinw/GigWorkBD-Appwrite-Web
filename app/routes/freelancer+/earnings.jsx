// app/routes/freelancer+/earnings.jsx
import { useLoaderData } from "@remix-run/react";
import {
  CurrencyBangladeshiIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CalculatorIcon,
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
      totalEarnings: 325000,
      avgPerJob: 45000,
      pendingPayments: 75000,
      earningsTrend: 15.5,
    },
    earningsData: [
      { month: "Jan", earnings: 40000 },
      { month: "Feb", earnings: 65000 },
      { month: "Mar", earnings: 82000 },
      { month: "Apr", earnings: 45000 },
      { month: "May", earnings: 93000 },
    ],
    transactions: [
      {
        id: 1,
        date: "2024-05-15",
        amount: 45000,
        client: "Tech Solutions BD",
        status: "completed",
      },
      {
        id: 2,
        date: "2024-05-10",
        amount: 30000,
        client: "Design Innovators",
        status: "pending",
      },
    ],
  };
}

export default function FreelancerEarnings() {
  const { stats, earningsData, transactions } = useLoaderData();

  return (
    <div className="space-y-8">
      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={CurrencyBangladeshiIcon}
          title="Total Earnings"
          value={`৳${stats.totalEarnings.toLocaleString()}`}
        />
        <StatCard
          icon={CalculatorIcon}
          title="Avg. per Job"
          value={`৳${stats.avgPerJob.toLocaleString()}`}
        />
        <StatCard
          icon={ClockIcon}
          title="Pending Payments"
          value={`৳${stats.pendingPayments.toLocaleString()}`}
        />
        <StatCard
          icon={ArrowTrendingUpIcon}
          title="Earnings Trend"
          value={`+${stats.earningsTrend}%`}
        />
      </div>

      {/* Earnings Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Earnings Overview</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={earningsData}>
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
                  "Earnings",
                ]}
              />
              <Line
                type="monotone"
                dataKey="earnings"
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
                <h3 className="font-medium">{transaction.client}</h3>
                <p className="text-gray-600 text-sm">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ৳{transaction.amount.toLocaleString()}
                </p>
                <span
                  className={`text-sm ${
                    transaction.status === "completed"
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
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
